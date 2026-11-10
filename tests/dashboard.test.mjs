import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const requireModule = createRequire(import.meta.url);

// Compile the actual pure TypeScript modules with the already-installed compiler.
// No browser, database, or extra test dependencies are needed.
const compiled = new Map();
function load(relative) {
  const file = path.resolve(__dirname, '../src', relative);
  if (compiled.has(file)) return compiled.get(file).exports;
  const compiledModule = new Module(file);
  compiled.set(file, compiledModule);
  compiledModule.require = (id) => {
    if (id.startsWith('@/')) return load(`${id.slice(2)}.ts`);
    if (id.startsWith('.')) return load(path.relative(path.resolve(__dirname, '../src'), path.resolve(path.dirname(file), `${id}.ts`)));
    return requireModule(id);
  };
  const result = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  compiledModule._compile(result.outputText, file);
  return compiledModule.exports;
}
const { buildDashboardData, buildTrendData, filterTransactions, transactionsHref, validMonth, parseThreshold } = load('lib/dashboard-data.ts');
const { monthKey } = load('lib/date.ts');
const tx = (id, amount, date = '2026-10-23', type = 'expense', categoryId = 'food') => ({ id, amount, date, type, categoryId, note: `note ${id}`, createdAt: `${date}T00:00:00Z` });
const rows = [tx('salary', 10_000_000, '2026-10-01', 'income'), tx('boundary', 500_000), ...[1,2,3,4,5,6,7].map((n) => tx(String(n), n * 600_000, `2026-10-${10+n}`, 'expense', n % 2 ? 'food' : 'bills')), tx('previous', 200_000, '2026-09-30')];

test('monthly totals, cash flow, donut and daily trend reconcile; income is excluded', () => {
  const data = buildDashboardData(rows, '2026-10');
  assert.deepEqual(data.summary, { income: 10_000_000, expense: 17_300_000, net: -7_300_000 });
  assert.equal(data.groups.reduce((sum, item) => sum + item.amount, 0), data.summary.expense);
  assert.equal(data.groups.reduce((sum, item) => sum + item.count, 0), 8);
  assert.ok(Math.abs(data.groups.reduce((sum, item) => sum + item.share, 0) - 1) < 1e-10);
  assert.equal(buildTrendData(rows, '2026-10', 'month', 'vi-VN').reduce((sum, item) => sum + item.spending, 0), data.summary.expense);
  assert.equal(data.previous.expense, 200_000);
});
test('recent is limited to five, creation time then ID descending, includes income', () => {
  const sample = [tx('a', 1), tx('z', 1), tx('income', 1, '2026-10-24', 'income'), ...rows];
  const recent = buildDashboardData(sample, '2026-10').recent;
  assert.equal(recent.length, 5);
  assert.deepEqual(recent.slice(0, 4).map((item) => item.id), ['income', 'z', 'boundary', 'a']);
});
test('large excludes exactly threshold, sorts by amount, totals only displayed five', () => {
  const data = buildDashboardData(rows, '2026-10');
  assert.deepEqual(data.large.map((item) => item.amount), [4_200_000, 3_600_000, 3_000_000, 2_400_000, 1_800_000]);
  assert.equal(data.largeTotal, 15_000_000);
  const all = filterTransactions(rows, { month: '2026-10', type: 'expense', threshold: 500_000 });
  assert.equal(all.length, 7);
  assert.ok(all.every((item) => item.type === 'expense' && item.amount > 500_000));
  assert.equal(buildDashboardData(rows, '2026-10', 3_000_000).large.length, 2);
});
test('category and highlighted URLs retain all filters, including encoded category IDs', () => {
  const url = new URL(transactionsHref({ month: '2026-10', type: 'expense', category: 'food & drinks', threshold: 500_000 }), 'http://localhost');
  assert.equal(url.searchParams.get('category'), 'food & drinks');
  assert.equal(url.searchParams.get('month'), '2026-10');
  assert.equal(url.searchParams.get('type'), 'expense');
  assert.equal(url.searchParams.get('threshold'), '500000');
  assert.equal(filterTransactions(rows, { month: '2026-10', type: 'expense', category: 'food' }).length, 5);
});
test('empty month, previous December and leap February work', () => {
  const empty = buildDashboardData(rows, '2025-01');
  assert.deepEqual(empty.summary, { income: 0, expense: 0, net: 0 });
  assert.equal(empty.groups.length + empty.recent.length + empty.large.length, 0);
  assert.equal(buildDashboardData([tx('dec', 7, '2025-12-31')], '2026-01').previous.expense, 7);
  assert.equal(buildTrendData([], '2024-02', 'month', 'vi-VN').length, 29);
});
test('week spans Monday to Sunday around today or selected month end; year uses selected year', () => {
  const now = new Date(2026, 9, 23);
  const week = buildTrendData(rows, '2026-10', 'week', 'vi-VN', now);
  assert.equal(week[0].date, '2026-10-19');
  assert.equal(week.length, 7);
  assert.equal(week.at(-1).date, '2026-10-25');
  assert.equal(buildTrendData(rows, '2026-09', 'week', 'vi-VN', now).at(-1).date, '2026-10-04');
  assert.equal(buildTrendData(rows, '2026-10', 'week', 'vi-VN', new Date(2026, 9, 2)).length, 7);
  const year = buildTrendData(rows, '2026-10', 'year', 'vi-VN', now);
  assert.equal(year.length, 12);
  assert.equal(year[9].spending, 17_300_000);
  assert.equal(year[8].spending, 200_000);
});
test('adding, editing, moving months and deleting recompute every dashboard panel', () => {
  const base = buildDashboardData(rows, '2026-10');
  const added = tx('new', 12_000_000, '2026-10-30', 'expense', 'new-category');
  const updated = buildDashboardData([...rows, added], '2026-10');
  assert.equal(updated.summary.expense, base.summary.expense + added.amount);
  assert.equal(updated.groups[0].categoryId, 'new-category');
  assert.equal(updated.large[0].id, 'new');
  assert.equal(updated.recent[0].id, 'new');
  const moved = buildDashboardData([...rows, { ...added, date: '2026-11-01' }], '2026-10');
  assert.deepEqual(moved, base);
  const edited = buildDashboardData([...rows, { ...added, type: 'income' }], '2026-10');
  assert.equal(edited.summary.expense, base.summary.expense);
  assert.equal(edited.summary.income, base.summary.income + added.amount);
  assert.deepEqual(buildDashboardData(rows.filter((item) => item.id !== '7'), '2026-10').summary.expense, base.summary.expense - 4_200_000);
});
test('invalid query parameters are rejected and local month does not use UTC', () => {
  for (const value of ['', '2026-00', '2026-13', '2026-1', 'oops', '0000-01']) assert.equal(validMonth(value), false);
  for (const value of ['', '-1', 'NaN', 'Infinity', '1.5']) assert.equal(parseThreshold(value), undefined);
  assert.equal(parseThreshold('0'), 0);
  assert.equal(validMonth('2026-10'), true);
  const previousTZ = process.env.TZ;
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  assert.equal(monthKey(new Date('2026-09-30T18:00:00Z')), '2026-10');
  process.env.TZ = 'America/Los_Angeles';
  assert.equal(monthKey(new Date('2026-10-01T01:00:00Z')), '2026-09');
  if (previousTZ) process.env.TZ = previousTZ; else delete process.env.TZ;
});

const { sortTransactions, groupTransactionsByDate } = load('lib/transactions.ts');
test('recent and filtered transactions follow creation time regardless of date, amount or category', () => {
  const sample = [
    { ...tx('z', 9_000_000, '2026-10-25', 'expense', 'a'), createdAt: '2026-10-25T01:00:00Z' },
    { ...tx('a', 1, '2026-10-01', 'income', 'z'), createdAt: '2026-10-25T10:00:00+07:00' },
    { ...tx('m', 500, '2026-10-24'), createdAt: '2026-10-25T02:00:00Z' },
  ];
  const expected = ['a', 'm', 'z'];
  assert.deepEqual(sortTransactions(sample).map(item => item.id), expected);
  assert.deepEqual(buildDashboardData(sample, '2026-10').recent.map(item => item.id), expected);
  assert.deepEqual(filterTransactions(sample, { month: '2026-10' }).map(item => item.id), expected);
  assert.deepEqual(sample.map(item => item.id), ['z', 'a', 'm']);
  assert.deepEqual(sortTransactions(sample.map(item => ({ ...item, amount: 100, categoryId: 'changed', date: '2026-10-31' }))).map(item => item.id), expected);
});
test('feed groups by selected date descending and keeps newest first within each day', () => {
  const previousTZ = process.env.TZ;
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  try {
    const sample = [
      { ...tx('old', 10, '2026-10-25'), createdAt: '2026-10-24T16:00:00Z' },
      { ...tx('new', 1, '2026-10-01'), createdAt: '2026-10-24T18:00:00Z' },
      { ...tx('middle', 100, '2026-10-01'), createdAt: '2026-10-24T17:30:00Z' },
    ];
    assert.deepEqual(groupTransactionsByDate(sample).map(([date, items]) => [date, items.map(item => item.id)]), [
      ['2026-10-25', ['old']], ['2026-10-01', ['new', 'middle']],
    ]);
  } finally {
    if (previousTZ) process.env.TZ = previousTZ; else delete process.env.TZ;
  }
});


test('donut labels use two decimal places and currency-specific suffixes without symbols', () => {
  const { formatChartAmount, toBaseVnd } = load('utils/currency.ts');
  assert.equal(formatChartAmount(1_570_000, 'VND', 'vi-VN'), '1,57tr');
  assert.equal(formatChartAmount(1_572_000, 'VND', 'vi-VN'), '1,57tr');
  assert.equal(formatChartAmount(toBaseVnd(1_570_000, 'USD'), 'USD', 'vi-VN'), '1,57M');
  assert.equal(formatChartAmount(toBaseVnd(1_570_000, 'USD'), 'USD', 'en-US'), '1.57M');
  assert.equal(formatChartAmount(1_000_000, 'VND', 'vi-VN'), '1tr');
  assert.equal(formatChartAmount(15_700, 'VND', 'vi-VN'), '15,7k');
  assert.equal(formatChartAmount(1_570_000_000, 'VND', 'vi-VN'), '1,57tỷ');
  assert.equal(formatChartAmount(500, 'VND', 'vi-VN'), '500');
  assert.equal(formatChartAmount(0, 'VND', 'vi-VN'), '0');
  for (const code of ['EUR', 'JPY', 'AUD', 'SGD']) {
    assert.equal(formatChartAmount(toBaseVnd(1_570_000, code), code, 'vi-VN'), '1,57M');
  }
});

test('new category icons render from backward-compatible database rows', () => {
  const { mapCategory } = load('lib/supabase/finance.ts');
  const icons = ['users', 'paw-print', 'house', 'landmark', 'shield-check'];
  icons.forEach((icon, index) => {
    const category = mapCategory({ id: `00000000-0000-4000-8000-0000000000${11 + index}`, name: 'Category', icon: 'heart-pulse', color: 'rose', type: 'expense' });
    assert.equal(category.icon, icon);
  });
  assert.equal(mapCategory({ id: 'existing', name: 'Food', icon: 'utensils', color: 'amber', type: 'expense' }).icon, 'utensils');
});


test('backdated transactions and date edits move daily spending between groups', () => {
  const sample = [
    { ...tx('backdated', 100, '2026-11-02'), createdAt: '2026-11-03T08:00:00Z' },
    tx('today', 200, '2026-11-03'),
    tx('income', 500, '2026-11-02', 'income'),
  ];
  const daily = (items) => groupTransactionsByDate(items).map(([date, group]) => [
    date, group.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0),
  ]);
  assert.deepEqual(daily(sample), [['2026-11-03', 200], ['2026-11-02', 100]]);
  const edited = sample.map(item => item.id === 'backdated' ? { ...item, date: '2026-11-03' } : item);
  assert.deepEqual(daily(edited), [['2026-11-03', 300], ['2026-11-02', 0]]);
  assert.deepEqual(groupTransactionsByDate([]), []);
});

test('calendar weeks include adjacent months, future days, Monday and Sunday anchors', () => {
  const cases = [
    ['2026-11', new Date(2026, 10, 3), '2026-11-02', '2026-11-08'],
    ['2026-11', new Date(2026, 10, 1), '2026-10-26', '2026-11-01'],
    ['2026-11', new Date(2026, 10, 2), '2026-11-02', '2026-11-08'],
    ['2027-01', new Date(2027, 0, 1), '2026-12-28', '2027-01-03'],
    ['2026-12', new Date(2026, 10, 3), '2026-12-28', '2027-01-03'],
    ['2024-02', new Date(2026, 10, 3), '2024-02-26', '2024-03-03'],
  ];
  for (const [month, now, first, last] of cases) {
    const week = buildTrendData([], month, 'week', 'vi-VN', now);
    assert.equal(week.length, 7);
    assert.equal(week[0].date, first);
    assert.equal(week.at(-1).date, last);
    assert.ok(week.every(item => item.spending === 0));
    assert.deepEqual(week.map(item => item.label), ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]);
  }
  const sample = [tx('previous-month', 10, '2026-12-28'), tx('next-month', 20, '2027-01-03'),
    tx('income', 100, '2027-01-01', 'income'), tx('outside', 999, '2026-12-27')];
  const week = buildTrendData(sample, '2027-01', 'week', 'vi-VN', new Date(2027, 0, 1));
  assert.deepEqual(week.map(item => item.spending), [10, 0, 0, 0, 0, 0, 20]);
});

test('selected dates and week boundaries remain local across time zones', () => {
  const previousTZ = process.env.TZ;
  try {
    for (const timezone of ['Asia/Ho_Chi_Minh', 'America/Los_Angeles']) {
      process.env.TZ = timezone;
      const sample = [{ ...tx('local', 10, '2026-11-02'), createdAt: '2026-11-03T00:00:00Z' }];
      assert.equal(groupTransactionsByDate(sample)[0][0], '2026-11-02');
      const week = buildTrendData(sample, '2026-11', 'week', 'vi-VN', new Date(2026, 10, 3));
      assert.equal(week[0].date, '2026-11-02');
      assert.equal(week.at(-1).date, '2026-11-08');
      assert.equal(week[0].spending, 10);
    }
  } finally {
    if (previousTZ) process.env.TZ = previousTZ; else delete process.env.TZ;
  }
});

const categoryId = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const { getCategoryGroupId, getCategorySections, aggregateCategoryGroups } = load('lib/categories.ts');
const { CATEGORY_CHILDREN } = load('constants/category-hierarchy.ts');
const { getCategoryName } = load('i18n/categories.ts');
const { translate } = load('i18n/messages.ts');
const shoppingRows = [
  tx('parent', 100_000, '2026-10-12', 'expense', categoryId(4)),
  tx('cosmetics', 150_000, '2026-10-12', 'expense', categoryId(23)),
  tx('clothing', 200_000, '2026-10-12', 'expense', categoryId(24)),
  tx('shopping-other', 50_000, '2026-10-12', 'expense', categoryId(36)),
  tx('food', 80_000, '2026-10-12', 'expense', categoryId(1)),
];

test('shopping group includes parent and every child exactly once; exact filters preserve selected IDs', () => {
  const group = filterTransactions(shoppingRows, { month: '2026-10', group: categoryId(4) });
  assert.equal(group.length, 4);
  assert.equal(group.reduce((sum, item) => sum + item.amount, 0), 500_000);
  for (const row of shoppingRows) {
    const exact = filterTransactions(shoppingRows, { month: '2026-10', category: row.categoryId });
    assert.deepEqual(exact, [row]);
  }
  assert.equal(getCategoryName({ id: categoryId(4) }, (key) => translate('vi', key)), 'Mua sắm');
  assert.equal(getCategoryName({ id: categoryId(24) }, (key) => translate('vi', key)), 'Quần áo');
  assert.equal(getCategoryName({ id: categoryId(36) }, (key) => translate('vi', key)), 'Mua sắm khác');
});

test('group drilldown preserves month, type, search, threshold and exact category precedence', () => {
  const filters = { month: '2026-10', group: categoryId(4), type: 'expense', query: 'clothing', threshold: 150_000 };
  const selected = filterTransactions([...shoppingRows, tx('other-month', 500_000, '2026-09-12', 'expense', categoryId(24))], filters);
  assert.deepEqual(selected.map((item) => item.id), ['clothing']);
  const url = new URL(transactionsHref(filters), 'https://example.test');
  assert.equal(url.searchParams.get('group'), categoryId(4));
  assert.equal(url.searchParams.get('month'), filters.month);
  assert.equal(url.searchParams.get('q'), filters.query);
  assert.equal(url.searchParams.get('threshold'), '150000');
  const conflict = { month: '2026-10', group: categoryId(4), category: categoryId(1) };
  assert.deepEqual(filterTransactions(shoppingRows, conflict).map((item) => item.id), ['food']);
  assert.equal(new URL(transactionsHref(conflict), 'https://example.test').searchParams.has('group'), false);
  assert.deepEqual(filterTransactions(shoppingRows, { month: '2026-10', group: 'unknown' }), []);
});

test('group chart reconciles with detail chart, excludes income and follows category edits', () => {
  const sample = [...shoppingRows, tx('income-parent', 900_000, '2026-10-12', 'income', categoryId(41)), tx('salary', 1_000_000, '2026-10-12', 'income', categoryId(8))];
  const data = buildDashboardData(sample, '2026-10');
  const groups = aggregateCategoryGroups(data.groups);
  const shopping = groups.find((group) => group.categoryId === categoryId(4));
  assert.equal(shopping.amount, 500_000);
  assert.equal(shopping.count, 4);
  assert.equal(groups.reduce((sum, group) => sum + group.amount, 0), data.summary.expense);
  assert.equal(groups.reduce((sum, group) => sum + group.count, 0), 5);
  assert.ok(Math.abs(groups.reduce((sum, group) => sum + group.share, 0) - 1) < 1e-10);
  assert.equal(filterTransactions(sample, { month: '2026-10', group: categoryId(41), type: 'income' }).length, 2);
  const moved = shoppingRows.map((row) => row.id === 'clothing' ? { ...row, categoryId: categoryId(1) } : row);
  assert.equal(filterTransactions(moved, { month: '2026-10', group: categoryId(4) }).length, 3);
  assert.deepEqual(aggregateCategoryGroups([]), []);
});

test('hierarchy has unique children, selectable parents, food first and safe unknown category fallback', () => {
  const children = Object.values(CATEGORY_CHILDREN).flat();
  assert.equal(new Set(children).size, children.length);
  for (const [parent, childIds] of Object.entries(CATEGORY_CHILDREN)) {
    assert.equal(children.includes(parent), false);
    assert.equal(getCategoryGroupId(parent), parent);
    childIds.forEach((id) => assert.equal(getCategoryGroupId(id), parent));
  }
  const categories = Array.from({ length: 41 }, (_, i) => ({ id: categoryId(i + 1), type: [8, 9, 10, 41].includes(i + 1) ? 'income' : 'expense' }));
  const sections = getCategorySections(categories);
  assert.equal(sections[0].root.id, categoryId(1));
  const flattened = sections.flatMap(({ root, children }) => [root, ...children]);
  assert.equal(flattened.length, 41);
  assert.equal(new Set(flattened.map((item) => item.id)).size, 41);
  assert.deepEqual(getCategorySections([{ id: 'custom', type: 'expense' }]), [{ root: { id: 'custom', type: 'expense' }, children: [] }]);
  assert.equal(getCategorySections([{ id: categoryId(24), type: 'expense' }])[0].root.id, categoryId(24));
  assert.equal(getCategoryGroupId('custom'), 'custom');
});

test('migration catalog matches hierarchy, translations and existing supported icons', () => {
  const migration = fs.readFileSync(path.resolve(__dirname, '../supabase/migrations/20261106034209_add_category_hierarchy.sql'), 'utf8');
  const inserts = migration.split('on conflict')[0];
  const catalog = [...inserts.matchAll(/\('([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)'\)/g)];
  assert.equal(catalog.length, 25);
  assert.equal(new Set(catalog.map((row) => row[1])).size, 25);
  for (const [, id, name, icon, color, type] of catalog) {
    assert.ok(['receipt-text', 'car', 'shopping-bag', 'heart-pulse', 'briefcase-business', 'wallet-cards'].includes(icon));
    assert.ok(color);
    assert.equal(type, id === categoryId(41) ? 'income' : 'expense');
    for (const locale of ['en', 'vi']) {
      const translated = getCategoryName({ id, name: 'unmapped' }, (key) => translate(locale, key));
      assert.ok(translated && translated !== 'unmapped', `${name} missing ${locale} translation`);
    }
  }
});

test('trend labels use localized weekdays only in week view', () => {
  const now = new Date(2027, 0, 1);
  assert.deepEqual(buildTrendData([], '2027-01', 'week', 'en-US', now).map(item => item.label), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  assert.deepEqual(buildTrendData([], '2027-01', 'month', 'vi-VN', now).slice(0, 3).map(item => item.label), ['1', '2', '3']);
  assert.equal(buildTrendData([], '2027-01', 'year', 'en-US', now)[0].label, 'Jan');
});

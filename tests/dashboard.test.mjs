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
test('week ends today for local current month; past months end on last day; year uses selected year', () => {
  const now = new Date(2026, 9, 23);
  const week = buildTrendData(rows, '2026-10', 'week', 'vi-VN', now);
  assert.equal(week[0].date, '2026-10-17');
  assert.equal(week.at(-1).date, '2026-10-23');
  assert.equal(buildTrendData(rows, '2026-09', 'week', 'vi-VN', now).at(-1).date, '2026-09-30');
  assert.equal(buildTrendData(rows, '2026-10', 'week', 'vi-VN', new Date(2026, 9, 2)).length, 2);
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

const { sortTransactions, groupTransactionsByCreatedDate } = load('lib/transactions.ts');
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
test('feed groups by local creation day and keeps newest first within each day', () => {
  const previousTZ = process.env.TZ;
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  try {
    const sample = [
      { ...tx('old', 10, '2026-10-25'), createdAt: '2026-10-24T16:00:00Z' },
      { ...tx('new', 1, '2026-10-01'), createdAt: '2026-10-24T18:00:00Z' },
      { ...tx('middle', 100), createdAt: '2026-10-24T17:30:00Z' },
    ];
    assert.deepEqual(groupTransactionsByCreatedDate(sample).map(([date, items]) => [date, items.map(item => item.id)]), [
      ['2026-10-25', ['new', 'middle']], ['2026-10-24', ['old']],
    ]);
  } finally {
    if (previousTZ) process.env.TZ = previousTZ; else delete process.env.TZ;
  }
});

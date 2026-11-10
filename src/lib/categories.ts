import { CATEGORY_CHILDREN, CATEGORY_ROOT_ORDER } from "@/constants/category-hierarchy";
import type { Category } from "@/types/finance";

const parentByChild = new Map<string, string>(
  Object.entries(CATEGORY_CHILDREN).flatMap(([parent, children]) => children.map((child) => [child, parent] as const)),
);

export function getCategoryGroupId(categoryId: string): string {
  return parentByChild.get(categoryId) ?? categoryId;
}

export function getCategorySections(categories: Category[]) {
  const byId = new Map(categories.map((category) => [category.id, category]));
  const used = new Set<string>();
  const sections: { root: Category; children: Category[] }[] = [];
  for (const id of CATEGORY_ROOT_ORDER) {
    const root = byId.get(id);
    if (!root) continue;
    const childIds: readonly string[] = CATEGORY_CHILDREN[id as keyof typeof CATEGORY_CHILDREN] ?? [];
    const children = childIds.flatMap((childId) => {
      const child = byId.get(childId);
      return child && child.type === root.type ? [child] : [];
    });
    sections.push({ root, children });
    used.add(id);
    children.forEach((child) => used.add(child.id));
  }
  // Preserve visibility of custom categories or children during a partial rollout.
  for (const category of categories) {
    if (!used.has(category.id)) sections.push({ root: category, children: [] });
  }
  return sections;
}

export function aggregateCategoryGroups<T extends { categoryId: string; amount: number; count: number; share: number }>(rows: T[]) {
  const groups = new Map<string, { categoryId: string; amount: number; count: number; share: number }>();
  for (const row of rows) {
    const categoryId = getCategoryGroupId(row.categoryId);
    const group = groups.get(categoryId) ?? { categoryId, amount: 0, count: 0, share: 0 };
    group.amount += row.amount;
    group.count += row.count;
    group.share += row.share;
    groups.set(categoryId, group);
  }
  return [...groups.values()].sort((a, b) => b.amount - a.amount || a.categoryId.localeCompare(b.categoryId));
}

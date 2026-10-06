import type { MessageKey } from "@/i18n/messages";
import type { Category } from "@/types/finance";

const CATEGORY_KEYS: Record<string, MessageKey> = {
  "00000000-0000-4000-8000-000000000001": "category.food",
  "00000000-0000-4000-8000-000000000002": "category.bills",
  "00000000-0000-4000-8000-000000000003": "category.transport",
  "00000000-0000-4000-8000-000000000004": "category.shopping",
  "00000000-0000-4000-8000-000000000005": "category.health",
  "00000000-0000-4000-8000-000000000006": "category.entertainment",
  "00000000-0000-4000-8000-000000000007": "category.other",
  "00000000-0000-4000-8000-000000000008": "category.salary",
  "00000000-0000-4000-8000-000000000009": "category.freelance",
  "00000000-0000-4000-8000-000000000010": "category.otherIncome",
};

export function getCategoryName(
  category: Category,
  t: (key: MessageKey) => string,
) {
  const key = CATEGORY_KEYS[category.id];
  return key ? t(key) : category.name;
}

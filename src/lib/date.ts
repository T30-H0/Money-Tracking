// Date-only values are local calendar dates, not UTC timestamps.
function toDisplayDate(value: Date | string): Date {
  return typeof value === "string"
    ? /^\d{4}-\d{2}-\d{2}$/.test(value) ? fromLocalDateString(value) : new Date(value)
    : value;
}

export function formatDate(value: Date | string): string {
  const date = toDisplayDate(value);
  if (Number.isNaN(date.getTime())) return "—";
  return toLocalDateString(date).split("-").reverse().join("-");
}

export function formatDateTime(value: Date | string): string {
  const date = toDisplayDate(value);
  if (Number.isNaN(date.getTime())) return "—";
  const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  return `${formatDate(date)} ${time}`;
}

export function formatMonthYear(value: Date | string): string {
  const date = typeof value === "string" && /^\d{4}-\d{2}$/.test(value)
    ? fromLocalDateString(`${value}-01`)
    : toDisplayDate(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
}

export function formatMonthName(date: Date, locale: string): string {
  return locale.startsWith("vi")
    ? `Tháng ${date.getMonth() + 1}`
    : date.toLocaleDateString(locale, { month: "long" });
}

export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromLocalDateString(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function monthKey(date: Date): string {
  return toLocalDateString(date).slice(0, 7);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

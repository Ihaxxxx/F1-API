export function getCurrentYear(): string {
  const now = new Date();
  return String(now.getFullYear());
}
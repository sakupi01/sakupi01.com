export function formatRFC2822Date(dateStr: string): string {
  const date = new Date(dateStr);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

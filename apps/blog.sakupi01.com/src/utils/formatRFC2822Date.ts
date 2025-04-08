export function formatRFC2822Date(dateStr: string): string {
  const date = new Date(dateStr);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function convertToValidTimeDateString(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }
  return date.toISOString().split("T")[0];
}

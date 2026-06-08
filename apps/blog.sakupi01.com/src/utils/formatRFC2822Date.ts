export function formatRFC2822Date(dateStr: string): string {
  const date = new Date(dateStr);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // Date-only strings parse as UTC midnight; format in UTC so the rendered
    // day never shifts with the build machine's timezone.
    timeZone: "UTC",
  }).format(date);
}

export function convertToValidTimeDateString(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }
  return date.toISOString().split("T")[0];
}

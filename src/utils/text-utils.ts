export function truncateText(
  text: string,
  threshold: number = 20, // if text length is greater than this threshold, it will be truncated
  truncateLength: number = 15 // the number of characters to keep before adding ellipsis
): string {
  if (!text) return "";
  if (text.length > threshold) {
    return text.slice(0, truncateLength) + "...";
  }
  return text;
}

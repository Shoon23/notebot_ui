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
export function shuffleArray<T>(array: T[]): T[] {
  // Create a copy of the original array to avoid mutating it.
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at positions i and j
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

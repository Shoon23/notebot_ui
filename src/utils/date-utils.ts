import { formatDistanceToNow, parseISO } from "date-fns";

export const formatDate = (date: string) => {
  if (!date) {
    return "Invalid date"; // Fallback for empty or null values
  }

  // Replace space with 'T' if present to make it ISO 8601 compliant
  const isoDate = date.includes(" ") ? date.replace(" ", "T") : date;

  try {
    const formattedDate = formatDistanceToNow(parseISO(isoDate), {
      addSuffix: true,
    });
    const capitalizedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return capitalizedDate;
  } catch (error) {
    console.error("Invalid date format:", date, error);
    return "Invalid date";
  }
};

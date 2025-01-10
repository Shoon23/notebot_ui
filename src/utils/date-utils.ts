import { formatDistanceToNow, parseISO } from "date-fns";

export const formatDate = (date: string) => {
  if (!date) {
    return "Invalid date"; // Fallback for empty or null values
  }

  // Ensure the input is ISO 8601 compliant
  const isoDate =
    date.includes(" ") && !date.includes("T") ? date.replace(" ", "T") : date;

  try {
    // Parse and format the date
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

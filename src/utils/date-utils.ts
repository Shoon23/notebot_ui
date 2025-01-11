import { formatDistanceToNow, parseISO } from "date-fns";

export const formatDate = (date: string) => {
  if (!date) {
    return "Invalid date"; // Fallback for empty or null values
  }

  // Ensure the input is ISO 8601 compliant
  let isoDate = date;

  // Convert to ISO format if it's not already in ISO 8601 format
  if (date.includes(" ") && !date.includes("T")) {
    // If the date is in "YYYY-MM-DD HH:mm:ss" format, replace space with "T"
    isoDate = date.replace(" ", "T");
  }

  // Handle case where milliseconds are included (ensure full ISO 8601 format)
  if (!isoDate.includes("Z") && isoDate.length <= 19) {
    isoDate += "Z"; // Add "Z" for UTC if not present
  }

  try {
    // Parse and format the date
    const formattedDate = formatDistanceToNow(parseISO(isoDate), {
      addSuffix: true,
    });

    // Capitalize the result
    const capitalizedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return capitalizedDate;
  } catch (error) {
    console.error("Invalid date format:", date, error);
    return "Invalid date";
  }
};

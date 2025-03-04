import { PickedFile } from "@capawesome/capacitor-file-picker";

export function validateAndGetFileRubrics(
  pickedFiles: PickedFile[]
): PickedFile {
  // If no files selected, throw an error
  if (!pickedFiles || pickedFiles.length === 0) {
    throw new Error("No file selected");
  }

  // Warn if multiple files are selected and use only the first one
  if (pickedFiles.length > 1) {
    throw new Error("Multiple files selected");
  }
  const file = pickedFiles[0];
  console.log("Picked file:", file);
  console.log("File size property:", file.size);
  console.log("Data length:", file.data ? file.data.length : "No data");
  const maxSizeBytes = 5 * 1024 * 1024;

  // Use the provided size or calculate from file.data if missing.
  const fileSize =
    file.size ?? (file.data ? getFileSizeFromBase64(file.data) : 0);
  console.log("File size:", fileSize);

  if (fileSize > maxSizeBytes) {
    throw new Error("File size exceeds 5 MB");
  }

  // Extra safeguard: check the file's MIME type if available
  if (file.mimeType && file.mimeType !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  return file;
}
export function validateAndGetFileNote(pickedFiles: PickedFile[]): PickedFile {
  // If no files selected, throw an error
  if (!pickedFiles || pickedFiles.length === 0) {
    throw new Error("No file selected");
  }

  // Warn if multiple files are selected and use only the first one
  if (pickedFiles.length > 1) {
    throw new Error("You can only select 1 file");
  }
  const file = pickedFiles[0];

  const maxSizeBytes = 5 * 1024 * 1024;

  // Use the provided size or calculate from file.data if missing.
  const fileSize =
    file.size ?? (file.data ? getFileSizeFromBase64(file.data) : 0);
  console.log("File size:", fileSize);

  if (fileSize > maxSizeBytes) {
    throw new Error("File size exceeds 5 MB");
  }

  // Define allowed MIME types for PDF and DOCX
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  // Extra safeguard: check the file's MIME type if available
  if (file.mimeType && !allowedMimeTypes.includes(file.mimeType)) {
    throw new Error("Only PDF and DOCX files are allowed");
  }

  return file;
}
function getFileSizeFromBase64(base64: string): number {
  // Remove any data URL prefix (e.g., "data:application/pdf;base64,")
  const cleanedBase64 = base64.split(",").pop() || "";
  // Calculate padding if any
  const padding = (cleanedBase64.match(/=+$/) || [""])[0].length;
  return Math.floor(cleanedBase64.length * 0.75) - padding;
}

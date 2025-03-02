import { PickedFile } from "@capawesome/capacitor-file-picker";

export function validateAndGetFile(pickedFiles: PickedFile[]): PickedFile {
  // If no files selected, throw an error
  if (!pickedFiles || pickedFiles.length === 0) {
    throw new Error("No file selected");
  }

  // Warn if multiple files are selected and use only the first one
  if (pickedFiles.length > 1) {
    throw new Error("Multiple files selected");
  }
  const file = pickedFiles[0];

  // Define maximum file size (45 MB in bytes)
  const maxSizeBytes = 45 * 1024 * 1024;

  // Check file size (if available)
  if (file.size && file.size > maxSizeBytes) {
    throw new Error("File size exceeds 45 MB");
  }

  // Extra safeguard: check the file's MIME type if available
  if (file.mimeType && file.mimeType !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  return file;
}

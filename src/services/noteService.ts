import { iNote, iUploadNote } from "@/types/note";
import authAxiosInstance from "../lib/authAxiosInstance";

async function getNotes(userId: string) {
  const response = await authAxiosInstance.get(`/notes/${userId}`);
  console.log(response.data);
  return response.data;
}

async function uploadNote(
  noteType: "file" | "text",
  noteData: iUploadNote | FormData
): Promise<iNote> {
  if (noteType === "file") {
    const response = await authAxiosInstance.post("/note/upload", noteData, {
      headers: {
        "Content-Type": "multipart/form-data", // FormData headers are automatically set by the browser, but adding it here ensures clarity
      },
    });

    console.log(response);
    return response.data;
  } else if (noteType === "text") {
    const response = await authAxiosInstance.post("/note/upload", noteData);
    console.log(response);

    return response.data;
  } else {
    throw new Error("Unsupported noteData type");
  }
}

export default {
  getNotes,
  uploadNote,
};

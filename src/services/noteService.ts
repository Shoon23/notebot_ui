import { iUploadNote } from "@/types/note";
import authAxiosInstance from "../lib/authAxiosInstance";

async function getNotes(userId: string) {
  const response = await authAxiosInstance.get(`/notes/${userId}`);

  return response.data;
}

async function uploadNote(noteData: iUploadNote) {
  const response = await authAxiosInstance.post("/note/upload", noteData);
  console.log(response);
  return response.data;
}

export default {
  getNotes,
  uploadNote,
};

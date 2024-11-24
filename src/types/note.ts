export interface iUploadNote {
  user_id: string;
  content_text?: string;
  note_name: string;
  file?: string;
}

export interface iNote {
  note_id: string;
  content_text: string | null;
  content_pdf_url: string | null;
}

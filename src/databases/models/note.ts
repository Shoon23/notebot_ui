export interface Note {
  note_id: string;
  note_name: string;
  summarize?: string;
  content_text?: string;
  content_pdf_url?: string;
  created_at?: string;
  last_viewed_at?: string;
}

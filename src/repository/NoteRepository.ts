import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { Note } from "@/databases/models/note";

export interface iNote {
  content_text: string;
  content_pdf_url: string;
  note_name: string;
}

class NoteRepository {
  private db: SQLiteDBConnection;

  constructor(db: SQLiteDBConnection) {
    this.db = db;
  }

  async saveNote(note_data: {
    content_pdf_url: string | null | undefined;
    content_text: string | null | undefined;
    note_name: string | null;
  }): Promise<number> {
    const { note_name, content_pdf_url, content_text } = note_data;
    const sql = `INSERT INTO Note ( note_name, content_pdf_url, content_text) 
                 VALUES (?, ?, ?);`;
    const res = await this.db.run(sql, [
      note_name,
      content_pdf_url,
      content_text,
    ]);
    if (res.changes?.lastId) {
      return res.changes.lastId;
    }
    throw new Error(`NoteRepository.saveNote: lastId not returned`);
  }
  async updateNoteContent(note_content: {
    content_text: string;
    note_name: string;
    note_id: number;
  }): Promise<void> {
    const { content_text, note_name, note_id } = note_content;

    const sql = `
      UPDATE Note 
      SET 
        content_text = ?, 
        note_name = ? 
      WHERE 
        note_id = ?;
    `;

    const res = await this.db.run(sql, [content_text, note_name, note_id]);

    if (!res.changes) {
      throw new Error(
        `NoteRepository.updateNoteContent: No rows were updated for note_id ${note_id}`
      );
    }
  }

  async getNoteById(note_id: number) {
    const sql = `SELECT note_id, content_text, content_pdf_url, note_name FROM Note WHERE note_id=?;`;
    const result = await this.db.query(sql, [note_id]);
    if (!result.values || result.values.length === 0) {
      throw new Error("Note not found");
    }
    return result.values[0];
  }

  async getListOfNotes(filters: { limit?: number }): Promise<Note[]> {
    const { limit } = filters;
    const sql = `SELECT note_id, note_name, content_text, last_viewed_at FROM Note 
                 ORDER BY last_viewed_at DESC  ${
                   limit ? "LIMIT " + limit : ""
                 };`;
    const result = await this.db.query(sql);

    return result.values as Note[];
  }

  async updateLastViewed(note_id: number): Promise<void> {
    const sql = `UPDATE Note SET last_viewed_at=? WHERE note_id=?;`;
    const res = await this.db.run(sql, [new Date().toISOString(), note_id]);
    if (res.changes?.changes === 0) {
      throw new Error("Note not found to update");
    }
  }
}

export default NoteRepository;

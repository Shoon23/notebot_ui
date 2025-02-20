import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { Note } from "@/databases/models/note";

export interface iNote {
  content_text: string;
  content_pdf_url: string;
  note_name: string;
  note_id: number;
}

class NoteRepository {
  private db: SQLiteDBConnection;

  constructor(db: SQLiteDBConnection) {
    this.db = db;
  } // New method to delete a note and its related entries
  // Method to delete a note and its related entries without using a transaction
  async deleteNote(note_id: number): Promise<void> {
    // Delete the note from the Note table
    const deleteNoteSql = `DELETE FROM Note WHERE note_id = ?`;
    const res2 = await this.db.run(deleteNoteSql, [note_id]);

    if (res2.changes?.changes === 0) {
      throw new Error(`No note found with note_id ${note_id}`);
    }
  }
  async getNoteByConversationId(conversationId: number) {
    const sql = `
      SELECT n.note_id, n.content_text, n.content_pdf_url, n.note_name
      FROM Conversation c
      JOIN Note n ON c.note_id = n.note_id
      WHERE c.conversation_id = ?;
    `;
    const result = await this.db.query(sql, [conversationId]);

    if (!result.values || result.values.length === 0) {
      throw new Error("Note not found for the given conversation ID");
    }

    return result.values[0];
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
  async getListOfNotes(filters: {
    limit?: number;
    onlyWithContent?: boolean;
    onlyWithoutConversation?: boolean; // Existing filter
    onlyNotArchived?: boolean; // New filter: only fetch non-archived notes
  }): Promise<Note[]> {
    const { limit, onlyWithContent, onlyWithoutConversation, onlyNotArchived } =
      filters;

    const sql = `
      SELECT n.note_id, n.note_name, n.content_text, n.last_viewed_at, n.is_archived
      FROM Note n
      ${
        onlyWithoutConversation
          ? "LEFT JOIN Conversation c ON n.note_id = c.note_id"
          : ""
      }
      ${
        onlyWithContent || onlyNotArchived || onlyWithoutConversation
          ? "WHERE"
          : ""
      }
      ${
        onlyWithContent
          ? "((n.content_text IS NOT NULL AND n.content_text != '') OR (n.content_pdf_url IS NOT NULL AND n.content_pdf_url != ''))"
          : ""
      }
      ${
        onlyNotArchived
          ? `${onlyWithContent ? " AND " : ""} n.is_archived = 0`
          : ""
      }
      ${
        onlyWithoutConversation
          ? `${
              onlyWithContent || onlyNotArchived ? " AND " : ""
            } c.note_id IS NULL`
          : ""
      }
      ORDER BY n.last_viewed_at DESC
      ${limit ? "LIMIT " + limit : ""};
    `;

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
  async archiveNote(noteId: number): Promise<void> {
    const sql = `UPDATE Note SET is_archived = 1 WHERE note_id = ?;`;
    await this.db.query(sql, [noteId]);
  }
  async archiveRecordsByNoteId(noteId: number): Promise<void> {
    try {
      // Begin the transaction
      await this.db.beginTransaction();
      // Verify that the transaction is active
      const isTransActive = await this.db.isTransactionActive();
      if (!isTransActive) {
        throw new Error("Transaction not active");
      }

      // Archive the Note record(s)
      await this.db.run(
        `UPDATE Note SET is_archived = 1 WHERE note_id = ?;`,
        [noteId],
        false // false means autosave is disabled in transaction mode
      );

      // Archive the Conversation record(s) associated with the note
      await this.db.run(
        `UPDATE Conversation SET is_archived = 1 WHERE note_id = ?;`,
        [noteId],
        false
      );

      // Archive the Quiz record(s) associated with the note
      await this.db.run(
        `UPDATE Quiz SET is_archived = 1 WHERE note_id = ?;`,
        [noteId],
        false
      );

      // Fetch all quiz_ids from Quiz table associated with the note_id
      const result = await this.db.query(
        `SELECT quiz_id FROM Quiz WHERE note_id = ?;`,
        [noteId]
      );

      if (!result.values) return;
      const quizIds = result?.values.map((row: any) => row.quiz_id);

      // If there are any quiz IDs, archive all related QuizAttempt records
      if (quizIds.length > 0) {
        // Dynamically create placeholders for the IN clause
        const placeholders = quizIds.map(() => "?").join(", ");
        await this.db.run(
          `UPDATE QuizAttempt SET is_archived = 1 WHERE quiz_id IN (${placeholders});`,
          quizIds,
          false
        );
      }

      // Commit the transaction if all updates succeed
      await this.db.commitTransaction();
    } catch (error) {
      // Roll back the transaction on error to avoid partial updates
      await this.db.rollbackTransaction();
      throw new Error(
        `Error archiving records for note_id ${noteId}: ${error}`
      );
    }
  }
}

export default NoteRepository;

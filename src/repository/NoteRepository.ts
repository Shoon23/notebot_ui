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
    onlyNotArchived?: boolean; // When provided, true means non-archived, false means archived
  }): Promise<Note[]> {
    const { limit, onlyWithContent, onlyWithoutConversation, onlyNotArchived } =
      filters;

    // Build an array of conditions for the WHERE clause.
    const conditions: string[] = [];

    // Filter notes that have content (either text or a PDF URL)
    if (onlyWithContent) {
      conditions.push(
        "((n.content_text IS NOT NULL AND n.content_text != '') OR (n.content_pdf_url IS NOT NULL AND n.content_pdf_url != ''))"
      );
    }

    // Filter by archive status if provided.
    // If onlyNotArchived is true, fetch non-archived notes (is_archived = 0).
    // If false, fetch archived notes only (is_archived = 1).
    conditions.push(`n.is_archived = ${onlyNotArchived ? "0" : "1"}`);

    // Filter to only include notes that have no conversation.
    if (onlyWithoutConversation) {
      conditions.push("c.note_id IS NULL");
    }

    // Start building the SQL.
    let sql = `
      SELECT n.note_id, n.note_name, n.content_text, n.last_viewed_at, n.is_archived, n.archived_at
      FROM Note n
    `;

    // If we need to filter by conversation, include a LEFT JOIN.
    if (onlyWithoutConversation) {
      sql += "LEFT JOIN Conversation c ON n.note_id = c.note_id ";
    }

    // Append conditions if any.
    if (conditions.length > 0) {
      sql += "WHERE " + conditions.join(" AND ") + " ";
    }

    sql += "ORDER BY n.last_viewed_at DESC ";
    if (limit) {
      sql += "LIMIT " + limit;
    }
    sql += ";";

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
  async updateArchivedAt(note_id: number): Promise<void> {
    const sql = `UPDATE Note SET archived_at = ? WHERE note_id = ?;`;
    const res = await this.db.run(sql, [new Date().toISOString(), note_id]);
    if (res.changes?.changes === 0) {
      throw new Error("Note not found to update archived_at");
    }
  }

  async archiveRecordsByNoteId(noteId: number): Promise<void> {
    let startedTransaction = false;
    try {
      // Check if a transaction is already active
      const isTransActive = await this.db.isTransactionActive();
      if (!isTransActive) {
        await this.db.beginTransaction();
        startedTransaction = true;
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

      if (result.values) {
        const quizIds = result.values.map((row: any) => row.quiz_id);

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
      }

      // Update the archived_at date in the Note table
      await this.db.run(`UPDATE Note SET archived_at = ? WHERE note_id = ?;`, [
        new Date().toISOString(),
        noteId,
      ]);

      // Commit the transaction if this function started it
      if (startedTransaction) {
        await this.db.commitTransaction();
      }
    } catch (error) {
      // Roll back the transaction if this function started it
      if (startedTransaction) {
        await this.db.rollbackTransaction();
      }
      throw new Error(
        `Error archiving records for note_id ${noteId}: ${error}`
      );
    }
  }

  async unarchiveRecordsByNoteId(noteId: number): Promise<void> {
    try {
      // Begin the transaction
      await this.db.beginTransaction();
      // Verify that the transaction is active
      const isTransActive = await this.db.isTransactionActive();
      if (!isTransActive) {
        throw new Error("Transaction not active");
      }

      // Unarchive the Note record(s)
      await this.db.run(
        `UPDATE Note SET is_archived = 0 WHERE note_id = ?;`,
        [noteId],
        false // false means autosave is disabled in transaction mode
      );

      // Unarchive the Conversation record(s) associated with the note
      await this.db.run(
        `UPDATE Conversation SET is_archived = 0 WHERE note_id = ?;`,
        [noteId],
        false
      );

      // Unarchive the Quiz record(s) associated with the note
      await this.db.run(
        `UPDATE Quiz SET is_archived = 0 WHERE note_id = ?;`,
        [noteId],
        false
      );

      // Fetch all quiz_ids from the Quiz table associated with the note_id
      const result = await this.db.query(
        `SELECT quiz_id FROM Quiz WHERE note_id = ?;`,
        [noteId]
      );

      if (result.values && result.values.length > 0) {
        const quizIds = result.values.map((row: any) => row.quiz_id);

        // If there are any quiz IDs, unarchive all related QuizAttempt records
        if (quizIds.length > 0) {
          // Dynamically create placeholders for the IN clause
          const placeholders = quizIds.map(() => "?").join(", ");
          await this.db.run(
            `UPDATE QuizAttempt SET is_archived = 0 WHERE quiz_id IN (${placeholders});`,
            quizIds,
            false
          );
        }
      }

      // Commit the transaction if all updates succeed
      await this.db.commitTransaction();
    } catch (error) {
      // Roll back the transaction on error to avoid partial updates
      await this.db.rollbackTransaction();
      throw new Error(
        `Error unarchiving records for note_id ${noteId}: ${error}`
      );
    }
  }

  async archiveRecordsManyNotes(notes: Note[]): Promise<void> {
    // If no notes are provided, exit early.
    if (!notes || notes.length === 0) return;

    let startedTransaction = false;
    try {
      // Check if a transaction is already active.
      const isTransActive = await this.db.isTransactionActive();
      if (!isTransActive) {
        await this.db.beginTransaction();
        startedTransaction = true;
      }

      // Extract note_ids from the provided notes.
      const noteIds = notes.map((note) => note.note_id);
      const notePlaceholders = noteIds.map(() => "?").join(", ");
      // Archive the Note records.
      await this.db.run(
        `UPDATE Note SET is_archived = 1 WHERE note_id IN (${notePlaceholders});`,
        noteIds,
        false // autosave disabled in transaction mode
      );

      // Archive the Conversation records associated with these notes.
      await this.db.run(
        `UPDATE Conversation SET is_archived = 1 WHERE note_id IN (${notePlaceholders});`,
        noteIds,
        false
      );

      // Archive the Quiz records associated with these notes.
      await this.db.run(
        `UPDATE Quiz SET is_archived = 1 WHERE note_id IN (${notePlaceholders});`,
        noteIds,
        false
      );

      // Fetch all quiz_ids from the Quiz table associated with these note_ids.
      const result = await this.db.query(
        `SELECT quiz_id FROM Quiz WHERE note_id IN (${notePlaceholders});`,
        noteIds
      );

      if (result.values) {
        const quizIds = result.values.map((row: any) => row.quiz_id);

        // If there are any quiz IDs, archive all related QuizAttempt records.
        if (quizIds.length > 0) {
          const quizPlaceholders = quizIds.map(() => "?").join(", ");
          await this.db.run(
            `UPDATE QuizAttempt SET is_archived = 1 WHERE quiz_id IN (${quizPlaceholders});`,
            quizIds,
            false
          );
        }
      }

      // Update the archived_at date in the Note table for all given note_ids.
      await this.db.run(
        `UPDATE Note SET archived_at = ? WHERE note_id IN (${notePlaceholders});`,
        [new Date().toISOString(), ...noteIds]
      );

      // Commit the transaction if this function started it.
      if (startedTransaction) {
        await this.db.commitTransaction();
      }
    } catch (error) {
      // Roll back the transaction if this function started it.
      if (startedTransaction) {
        await this.db.rollbackTransaction();
      }
      throw new Error(`Error archiving Many Notes: ${error}`);
    }
  }
}

export default NoteRepository;

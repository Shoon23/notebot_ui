// Define the Message type
export interface iMessage {
  message_id?: number; // Unique identifier for the message
  conversation_id: number; // The ID of the conversation the message belongs to
  sender_type: "PERSON" | "BOT"; // Type of sender (either 'PERSON' or 'BOT')
  message_content: string | null; // The content of the message
  created_at?: string; // Timestamp when the message was created (ISO 8601 format)
}
// Define the type for Conversation with Note Name and Timestamps
export interface iConversationWithNote {
  conversation_id: number; // Unique identifier for the conversation
  note_name: string; // The name of the note associated with the conversation
  last_viewed_at: string; // Timestamp when the conversation was last viewed
}

class ConversationRepository {
  private db: any; // Replace with actual DB interface or connection

  constructor(db: any) {
    this.db = db;
  }

  // Add a new conversation for a specific note_id
  async addConversation(noteId: number): Promise<number | undefined> {
    const sql = `INSERT INTO Conversation (note_id) VALUES (?);`;
    try {
      const res = await this.db.query(sql, [noteId]);
      const get_convo_id = await this.db.query(
        "SELECT conversation_id FROM Conversation WHERE note_id = ?",
        [noteId]
      );

      if (!get_convo_id.values[0].conversation_id) {
        throw new Error("Misisng COnvo");
      }

      return get_convo_id.values[0].conversation_id;
    } catch (error) {
      throw new Error(`Error adding conversation: ${error}`);
    }
  }

  // Delete a conversation by conversation_id
  async deleteConversation(conversationId: number): Promise<void> {
    const sql = `DELETE FROM Conversation WHERE conversation_id = ?;`;
    try {
      await this.db.query(sql, [conversationId]);
    } catch (error) {
      throw new Error(`Error deleting conversation: ${error}`);
    }
  }

  // Delete a conversation by note_id (if note_id is the only identifier used)
  async deleteConversationByNoteId(noteId: number): Promise<void> {
    const sql = `DELETE FROM Conversation WHERE note_id = ?;`;
    try {
      await this.db.query(sql, [noteId]);
    } catch (error) {
      throw new Error(
        `Error deleting conversation for note_id ${noteId}: ${error}`
      );
    }
  }

  // Add a new message to a conversation
  async addMessage(
    conversationId: number,
    senderType: "PERSON" | "BOT",
    messageText: string | null
  ): Promise<iMessage> {
    const sql = `INSERT INTO Message (conversation_id, sender_type, message_content)
                 VALUES (?, ?, ?);`;

    try {
      const res = await this.db.run(sql, [
        conversationId,
        senderType,
        messageText,
      ]);

      if (res.changes?.lastId) {
        return {
          message_id: res.changes.lastId,
          conversation_id: conversationId,
          sender_type: senderType,
          message_content: messageText,
        };
      }
      throw new Error("MessageRepository.addMessage: lastId not returned");
    } catch (error) {
      throw new Error(`Error adding message: ${error}`);
    }
  }

  async deleteMessage(messageId: number): Promise<void> {
    const sql = `DELETE FROM Message WHERE message_id = ?;`;

    try {
      const res = await this.db.query(sql, [messageId]);

      // Optionally check if any row was affected.
      if (res.affectedRows === 0) {
        throw new Error(`No message found with id ${messageId}`);
      }
    } catch (error) {
      throw new Error(`Error deleting message: ${error}`);
    }
  }

  // Get messages for a specific conversation
  async getMessagesForConversation(
    conversationId: number,
    limit: number = 5,
    offset: number = 0
  ): Promise<iMessage[]> {
    const sql = `
      SELECT m.message_id, m.sender_type, m.created_at, m.message_content
      FROM Message m
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC;
      
    `;

    // LIMIT ? OFFSET ?;
    try {
      const result = await this.db.query(sql, [conversationId]);
      return result.values as iMessage[];
    } catch (error) {
      throw new Error(`Error retrieving messages: ${error}`);
    }
  }
  async getConversationsWithNoteName(filters?: {
    onlyNotArchived?: boolean;
  }): Promise<iConversationWithNote[]> {
    const onlyNotArchived = filters?.onlyNotArchived ?? false;
    let sql = `
      SELECT c.conversation_id, n.note_name, c.last_viewed_at, c.is_archived
      FROM Conversation c
      JOIN Note n ON c.note_id = n.note_id
    `;

    if (onlyNotArchived) {
      sql += " WHERE c.is_archived = 0";
    }

    sql += " ORDER BY c.last_viewed_at DESC;";

    try {
      const result = await this.db.query(sql);
      return result.values as iConversationWithNote[];
    } catch (error) {
      throw new Error(`Error retrieving conversations: ${error}`);
    }
  } // Update the last_viewed_at timestamp when a conversation is opened
  async updateLastViewedAt(conversationId: number): Promise<void> {
    const sql = `UPDATE Conversation 
                 SET last_viewed_at = CURRENT_TIMESTAMP
                 WHERE conversation_id = ?;`;

    try {
      await this.db.query(sql, [conversationId]);
    } catch (error) {
      throw new Error(`Error updating last_viewed_at: ${error}`);
    }
  }
  // In ConversationRepository class
  async deleteMessagesExceptFirstTwo(conversationId: number): Promise<void> {
    const sql = `
    DELETE FROM Message
    WHERE conversation_id = ?
      AND message_id NOT IN (
        SELECT message_id FROM (
          SELECT message_id 
          FROM Message
          WHERE conversation_id = ?
          ORDER BY created_at ASC
          LIMIT 1
        ) AS keepMessages
      );
  `;
    try {
      await this.db.query(sql, [conversationId, conversationId]);
    } catch (error) {
      throw new Error(`Error deleting messages except the first two: ${error}`);
    }
  }
}

export default ConversationRepository;

export const ConversationUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS Conversation (
           conversation_id INTEGER PRIMARY KEY AUTOINCREMENT,
           note_id INTEGER UNIQUE,
           FOREIGN KEY (note_id) REFERENCES Note(note_id)
         );`,
    ],
  },
];

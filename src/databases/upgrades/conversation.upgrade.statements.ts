export const ConversationUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS Conversation (
  conversation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  note_id INTEGER UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  
  last_viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,  
          is_archived INTEGER DEFAULT 0,

  FOREIGN KEY (note_id) REFERENCES Note(note_id) ON DELETE CASCADE
);
`,
    ],
  },
];

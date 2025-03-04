export const MessageUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS Message (
           message_id INTEGER PRIMARY KEY AUTOINCREMENT,
           conversation_id INTEGER NOT NULL,
           sender_type TEXT NOT NULL CHECK(sender_type IN ('PERSON', 'BOT')),
           message_content TEXT,
           created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
           FOREIGN KEY (conversation_id) REFERENCES Conversation(conversation_id) ON DELETE CASCADE
         );`,
    ],
  },
];

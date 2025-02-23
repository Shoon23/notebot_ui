export const QuizGenHistoryUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS QuizGenHistory (
             quiz_gen_id INTEGER PRIMARY KEY AUTOINCREMENT,
             quiz_id INTEGER NOT NULL,
             sender_type TEXT NOT NULL CHECK(sender_type IN ('PERSON', 'BOT')),
             content_text TEXT,
             file_url TEXT,
             created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
             FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id) ON DELETE CASCADE
  
           );`,
    ],
  },
];

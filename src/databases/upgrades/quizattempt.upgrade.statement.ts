export const QuizAttemptUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS QuizAttempt (
           quiz_attempt_id INTEGER PRIMARY KEY AUTOINCREMENT,
           quiz_id INTEGER NOT NULL,
           score INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
           FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id) ON DELETE CASCADE
         );`,
    ],
  },
];

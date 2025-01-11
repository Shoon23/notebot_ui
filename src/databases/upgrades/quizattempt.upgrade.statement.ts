export const QuizAttemptUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS QuizAttempt (
           quiz_attempt_id INTEGER PRIMARY KEY AUTOINCREMENT,
           num_questions INTEGER NOT NULL,
           quiz_id INTEGER NOT NULL,
           score INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
           updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
           finished_at DATETIME,
           FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id)
         );`,
    ],
  },
];

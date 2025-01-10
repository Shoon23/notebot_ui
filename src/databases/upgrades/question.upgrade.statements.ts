export const QuestionUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS Question (
           question_id INTEGER PRIMARY KEY AUTOINCREMENT,
           quiz_id INTEGER NOT NULL,
           content TEXT NOT NULL,
           FOREIGN KEY (quiz_id) REFERENCES Quiz(quiz_id)
         );`,
    ],
  },
];

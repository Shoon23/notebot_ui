export const IdentificationAnswerUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS IdentificationAnswer (
           identification_answer_id INTEGER PRIMARY KEY AUTOINCREMENT,
           quiz_attempt_id INTEGER NOT NULL,
           question_id INTEGER NOT NULL,
           is_correct BOOLEAN NOT NULL,
           answer TEXT NOT NULL,
           FOREIGN KEY (quiz_attempt_id) REFERENCES QuizAttempt(quiz_attempt_id)
         );`,
    ],
  },
];

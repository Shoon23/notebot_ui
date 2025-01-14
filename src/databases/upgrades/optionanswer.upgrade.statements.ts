export const OptionAnswerUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS OptionAnswer (
    option_answer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_attempt_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    option_id INTEGER,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (quiz_attempt_id) REFERENCES QuizAttempt(quiz_attempt_id)
);
`,
    ],
  },
];

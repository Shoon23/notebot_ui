export const EssayEvaluationUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS EssayEvaluation (
           essay_eval_id INTEGER PRIMARY KEY AUTOINCREMENT,
           essay_answer_id INTEGER UNIQUE NOT NULL,
           rubric_id INTEGER,
           FOREIGN KEY (essay_answer_id) REFERENCES EssayAnswer(essay_answer_id) ON DELETE CASCADE
         );`,
    ],
  },
];

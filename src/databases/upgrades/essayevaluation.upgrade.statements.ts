export const EssayEvaluationUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS EssayEvaluation (
           essay_eval_id INTEGER PRIMARY KEY AUTOINCREMENT,
           essay_answer_id INTEGER UNIQUE NOT NULL,
           content INTEGER NOT NULL,
           organization INTEGER NOT NULL,
           thesis_statement INTEGER NOT NULL,
           style_and_voice INTEGER NOT NULL,
           grammar_and_mechanics INTEGER NOT NULL,
           critical_thinking INTEGER NOT NULL,
           FOREIGN KEY (essay_answer_id) REFERENCES EssayAnswer(essay_answer_id)
         );`,
    ],
  },
];

export const CriteriaUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS Criteria (
             criteria_id INTEGER PRIMARY KEY AUTOINCREMENT,
             essay_eval_id INTEGER  NOT NULL,
             score INTEGER NOT NULL,
             max_score INTEGER NOT NULL,
             criteria_name TEXT NOT NULL,
             break_down TEXT NOT NULL, 
             FOREIGN KEY (essay_eval_id) REFERENCES EssayEvaluation(essay_eval_id) ON DELETE CASCADE
           );`,
    ],
  },
];

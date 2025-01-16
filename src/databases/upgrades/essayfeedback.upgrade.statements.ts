export const EssayFeedbackUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS EssayFeedback (
           essay_fb_id INTEGER PRIMARY KEY AUTOINCREMENT,
           feedback TEXT NOT NULL,
           essay_eval_id INTEGER UNIQUE NOT NULL,
           FOREIGN KEY (essay_eval_id) REFERENCES EssayEvaluation(essay_eval_id) ON DELETE CASCADE
         );`,
    ],
  },
];

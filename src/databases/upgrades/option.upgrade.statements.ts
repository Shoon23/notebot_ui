export const OptionUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS Option (
           option_id INTEGER PRIMARY KEY AUTOINCREMENT,
           question_id INTEGER NOT NULL,
           content TEXT NOT NULL,
           is_answer BOOLEAN NOT NULL,
           explanation TEXT,
           FOREIGN KEY (question_id) REFERENCES Question(question_id)
         );`,
    ],
  },
];

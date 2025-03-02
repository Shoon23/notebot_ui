export const RubricUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS Rubric (
               rubric_id INTEGER PRIMARY KEY AUTOINCREMENT,
               file_path TEXT NOT NULL,
               file_name TEXT NOT NULL,
               is_used INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP

             );`,
    ],
  },
];

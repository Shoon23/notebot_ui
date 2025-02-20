export const QuizUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS Quiz (
           quiz_id INTEGER PRIMARY KEY AUTOINCREMENT,
           quiz_name TEXT NOT NULL,
           note_id INTEGER NOT NULL,
           question_type TEXT NOT NULL,
           num_questions INTEGER NOT NULL,
           blooms_taxonomy_level TEXT NOT NULL,
           created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
           description TEXT,
          is_archived INTEGER DEFAULT 0,
           updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
           FOREIGN KEY (note_id) REFERENCES Note(note_id) ON DELETE CASCADE
         );`,
    ],
  },
];

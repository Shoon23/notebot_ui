export const NoteUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS Note (
           note_id INTEGER PRIMARY KEY AUTOINCREMENT,
           note_name TEXT NOT NULL,
           summarize TEXT,
           content_text TEXT,
           content_pdf_url TEXT,
          is_archived INTEGER DEFAULT 0,
           created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
           last_viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
         );`,
    ],
  },
];

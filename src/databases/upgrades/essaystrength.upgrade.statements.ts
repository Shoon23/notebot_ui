export const EssayStrengthUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS EssayStrength (
           strength_id INTEGER PRIMARY KEY AUTOINCREMENT,
           essay_fb_id INTEGER NOT NULL,
           content TEXT NOT NULL,
           FOREIGN KEY (essay_fb_id) REFERENCES EssayFeedback(essay_fb_id) ON DELETE CASCADE
         );`,
    ],
  },
];

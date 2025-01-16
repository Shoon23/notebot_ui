export const EssayAreaOfImprovementUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS EssayAreaOfImprovement (
           area_of_improvement_id INTEGER PRIMARY KEY AUTOINCREMENT,
           essay_fb_id INTEGER NOT NULL,
           content TEXT NOT NULL,
           FOREIGN KEY (essay_fb_id) REFERENCES EssayFeedback(essay_fb_id) ON DELETE CASCADE
         );`,
    ],
  },
];

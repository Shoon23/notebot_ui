import { SQLiteDBConnection } from "@capacitor-community/sqlite";

class OptionRepository {
  private db: SQLiteDBConnection;

  constructor(db: SQLiteDBConnection) {
    this.db = db;
  }

  // Save an option
  async saveOption(
    content: string,
    question_id: string,
    is_answer: boolean,
    explanation?: string | null
  ): Promise<number> {
    const sql = `INSERT INTO Option (content, question_id, is_answer, explanation) 
                 VALUES (?, ?, ?, ?);`;
    const res = await this.db.run(sql, [
      content,
      question_id,
      is_answer,
      explanation || null,
    ]);
    if (res.changes?.lastId) {
      return res.changes.lastId;
    }
    throw new Error("OptionRepository.saveOption: lastId not returned");
  }
}

export default OptionRepository;

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
  } // Update the content of an option by its id
  async updateOptionContent(
    option_id: number,
    newContent: string
  ): Promise<void> {
    const sql = `UPDATE Option SET content = ? WHERE option_id = ?;`;
    const res = await this.db.run(sql, [newContent, option_id]);
    if (res.changes) {
      return;
    }
    throw new Error(
      `OptionRepository.updateOptionContent: Update failed for option_id ${option_id}`
    );
  }
  async updateOptionExplanationAndContent(
    option_id: number,
    newExplanation: string,
    newContent: string
  ): Promise<void> {
    const sql = `UPDATE Option SET explanation = ?,content=? WHERE option_id = ?;`;
    const res = await this.db.run(sql, [newExplanation, newContent, option_id]);
    if (res.changes) {
      return;
    }
    throw new Error(
      `OptionRepository.updateOptionExplanation: Update failed for option_id ${option_id}`
    );
  }
}

export default OptionRepository;

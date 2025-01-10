import { SQLiteDBConnection } from "@capacitor-community/sqlite";

class QuestionRepository {
  private db: SQLiteDBConnection;

  constructor(db: SQLiteDBConnection) {
    this.db = db;
  }

  // Save a question
  async saveQuestion(quiz_id: string, content: string): Promise<number> {
    const sql = `INSERT INTO questions (quiz_id, content) VALUES (?, ?);`;
    const res = await this.db.run(sql, [quiz_id, content]);
    if (res.changes?.lastId) {
      return res.changes.lastId;
    }
    throw new Error(`QuestionRepository.saveQuestion: lastId not returned`);
  }

  // Get questions with the correct answers
  async getQuestionsWithAnswer(quiz_id: number) {
    const sql = `SELECT question_id, content 
                 FROM Question WHERE quiz_id=?;`;
    const result = await this.db.query(sql, [quiz_id]);
    if (!result.values || result.values.length === 0) {
      throw new Error("No questions found");
    }

    // Retrieve options for each question that are marked as answers
    for (let question of result.values) {
      const optionsSql = `SELECT option_id, content 
                          FROM Option WHERE question_id=? AND is_answer=1;`;
      const optionsResult = await this.db.query(optionsSql, [
        question.question_id,
      ]);
      question.options = optionsResult.values;
    }

    return result.values;
  }
}

export default QuestionRepository;

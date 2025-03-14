import { Scores } from "@/services/attemptQuizService";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

interface EvaluationScores {
  content: Array<number>; // Score for content
  organization: Array<number>; // Score for organization
  thesis_statement: Array<number>; // Score for thesis statement
  style_and_voice: Array<number>; // Score for style and voice
  grammar_and_mechanics: Array<number>; // Score for grammar and mechanics
  critical_thinking: Array<number>; // Score for critical thinking
}
export interface Rubric {
  rubric_id: number;
  file_path: string;
  file_name: string;
  is_used: boolean;
}
interface EssayStrength {
  essay_fb_id: number;
  content: string;
}

interface EssayImprovement {
  essay_fb_id: number;
  content: string;
}

class EssayRepository {
  private db: SQLiteDBConnection;

  constructor(db: SQLiteDBConnection) {
    this.db = db;
  }

  // Save essay answer
  async saveEssayAnswer(
    quiz_attempt_id: number,
    question_id: number,
    answer: string
  ): Promise<number> {
    const sql = `
      INSERT INTO EssayAnswer (quiz_attempt_id, question_id, answer) 
      VALUES (?, ?, ?);`;
    const res = await this.db.run(sql, [quiz_attempt_id, question_id, answer]);
    if (res.changes?.lastId) {
      return res.changes.lastId;
    }
    throw new Error("EssayRepository.saveEssayAnswer: lastId not returned");
  }

  // Save essay evaluation
  async saveEssayEvaluation(
    essay_answer_id: number,
    rubric_id: number
  ): Promise<number> {
    const sql = `
      INSERT INTO EssayEvaluation (
       essay_answer_id,
       rubric_id
      ) VALUES (?,?);`;
    const res = await this.db.run(sql, [essay_answer_id, rubric_id]);
    if (res.changes?.lastId) {
      return res.changes.lastId;
    }
    throw new Error("EssayRepository.saveEssayEvaluation: lastId not returned");
  }

  // Save essay feedback
  async saveEssayFeedback(
    feedback: string,
    essay_eval_id: number
  ): Promise<number> {
    const sql = `
      INSERT INTO EssayFeedback (feedback, essay_eval_id) 
      VALUES (?, ?);`;
    const res = await this.db.run(sql, [feedback, essay_eval_id]);

    if (res.changes?.lastId) {
      return res.changes.lastId;
    }
    throw new Error("EssayRepository.saveEssayFeedback: lastId not returned");
  }

  // Save multiple essay strengths
  async saveManyEssayStrength(essay_strengths: EssayStrength[]): Promise<void> {
    const sql = `
      INSERT INTO EssayStrength (essay_fb_id, content) 
      VALUES (?, ?);`;

    for (const strength of essay_strengths) {
      await this.db.run(sql, [strength.essay_fb_id, strength.content]);
    }
  }

  // Save multiple essay areas of improvement
  async saveManyEssayAreaOfImprovements(
    essay_improvements: EssayImprovement[]
  ): Promise<void> {
    const sql = `
      INSERT INTO EssayAreaOfImprovement (essay_fb_id, content) 
      VALUES (?, ?);`;

    for (const improvement of essay_improvements) {
      await this.db.run(sql, [improvement.essay_fb_id, improvement.content]);
    }
  }
  // Save criteria record
  async saveCriteria(
    essay_eval_id: number,
    score: number,
    max_score: number,
    criteria_name: string,
    break_down: string
  ): Promise<number> {
    const sql = `
        INSERT INTO Criteria (essay_eval_id, score, max_score, criteria_name, break_down)
        VALUES (?, ?, ?, ?, ?);`;
    const res = await this.db.run(sql, [
      essay_eval_id,
      score,
      max_score,
      criteria_name,
      break_down,
    ]);
    if (res.changes?.lastId) {
      return res.changes.lastId;
    }
    throw new Error("EssayRepository.saveCriteria: lastId not returned");
  }
  // Single insert for multiple score records
  async saveScores(essay_eval_id: number, scores: Scores[]): Promise<number[]> {
    if (scores.length === 0) return [];

    // Build a string of placeholders for each record: "(?,?,?,?,?)"
    const placeholders = scores.map(() => "(?,?,?,?,?)").join(", ");

    // Flatten the parameters for all records
    const params: (number | string)[] = [];
    for (const score of scores) {
      params.push(
        essay_eval_id,
        score.score,
        score.max,
        score.criterion,
        score.breakdown
      );
    }

    const sql = `
        INSERT INTO Criteria (essay_eval_id, score, max_score, criteria_name, break_down)
        VALUES ${placeholders};`;

    const res = await this.db.run(sql, params);
    if (res.changes && res.changes.lastId !== undefined) {
      // If the database returns the last inserted ID, and IDs are sequential,
      // we can calculate the list of inserted IDs.
      const lastId = res.changes.lastId;
      const insertedCount = scores.length;
      const firstId = lastId - insertedCount + 1;
      const ids = Array.from(
        { length: insertedCount },
        (_, index) => firstId + index
      );
      return ids;
    }
    throw new Error("EssayRepository.saveScores: lastId not returned");
  }
  // Save rubric record
  async saveRubric(filePath: string, fileName: string): Promise<number> {
    const sql = `
      INSERT INTO Rubric (file_path,file_name)
      VALUES (?,?);
    `;
    const res = await this.db.run(sql, [filePath, fileName]);
    if (res.changes?.lastId) {
      return res.changes.lastId;
    }
    throw new Error("RubricRepository.saveRubric: lastId not returned");
  }
  async getRubric(rubricId: number): Promise<Rubric> {
    try {
      const sql = `SELECT rubric_id,file_path,file_name FROM Rubric WHERE rubric_id = ?;`;
      const res = await this.db.query(sql, [rubricId]);
      if (res.values && res.values.length > 0) {
        return res.values[0];
      }
      throw new Error(`No rubric found with id ${rubricId}`);
    } catch (error) {
      throw new Error("RubricRepository.getRubric: " + error);
    }
  }

  async getRubrics(): Promise<Rubric[]> {
    try {
      const sql = `SELECT rubric_id, file_path, file_name, is_used FROM Rubric ORDER BY created_at DESC;`;
      const res = await this.db.query(sql);
      if (res.values) {
        return res.values;
      }
      return [];
    } catch (error) {
      throw new Error("RubricRepository.getRubrics: " + error);
    }
  }
  async getUsedRubrics(): Promise<Rubric | null> {
    try {
      const sql = `SELECT rubric_id,file_path,file_name FROM Rubric WHERE is_used = 1;`;
      const res = await this.db.query(sql);
      if (!res.values) {
        return null;
      }
      return res.values[0];
    } catch (error) {
      throw new Error("RubricRepository.getUsedRubrics: " + error);
    }
  }
  async updateRubricIsUsed(rubricId: number, isUsed: boolean): Promise<void> {
    try {
      const sql = `UPDATE Rubric SET is_used = ? WHERE rubric_id = ?;`;
      await this.db.run(sql, [isUsed ? 1 : 0, rubricId]);
    } catch (error) {
      throw new Error("RubricRepository.updateRubricIsUsed: " + error);
    }
  }
  async deleteRubric(rubricId: number): Promise<void> {
    try {
      const sql = `DELETE FROM Rubric WHERE rubric_id = ?;`;
      await this.db.run(sql, [rubricId]);
    } catch (error) {
      throw new Error("RubricRepository.deleteRubric: " + error);
    }
  }
}

export default EssayRepository;

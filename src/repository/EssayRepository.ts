import { SQLiteDBConnection } from "@capacitor-community/sqlite";

interface EvaluationScores {
  content: Array<number>; // Score for content
  organization: Array<number>; // Score for organization
  thesis_statement: Array<number>; // Score for thesis statement
  style_and_voice: Array<number>; // Score for style and voice
  grammar_and_mechanics: Array<number>; // Score for grammar and mechanics
  critical_thinking: Array<number>; // Score for critical thinking
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
    scores: EvaluationScores,
    essay_answer_id: number
  ): Promise<number> {
    const sql = `
      INSERT INTO EssayEvaluation (
        content, organization, thesis_statement, style_and_voice, 
        grammar_and_mechanics, critical_thinking, essay_answer_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?);`;
    const res = await this.db.run(sql, [
      scores.content[0],
      scores.organization[0],
      scores.thesis_statement[0],
      scores.style_and_voice[0],
      scores.grammar_and_mechanics[0],
      scores.critical_thinking[0],
      essay_answer_id,
    ]);
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
}

export default EssayRepository;

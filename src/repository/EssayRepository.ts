import { SQLiteDBConnection } from "@capacitor-community/sqlite";

interface EvaluationScores {
  content: number; // Score for content
  organization: number; // Score for organization
  thesis_statement: number; // Score for thesis statement
  style_and_voice: number; // Score for style and voice
  grammar_and_mechanics: number; // Score for grammar and mechanics
  critical_thinking: number; // Score for critical thinking
}

interface EssayStrength {
  essay_fb_id: string;
  content: string;
}

interface EssayImprovement {
  essay_fb_id: string;
  content: string;
}

class EssayRepository {
  private db: SQLiteDBConnection;

  constructor(db: SQLiteDBConnection) {
    this.db = db;
  }

  // Save essay answer
  async saveEssayAnswer(
    quiz_attempt_id: string,
    question_id: string,
    answer: string
  ): Promise<number> {
    const sql = `
      INSERT INTO essay_answers (quiz_attempt_id, question_id, answer) 
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
    essay_answer_id: string
  ): Promise<number> {
    const sql = `
      INSERT INTO essay_evaluations (
        content, organization, thesis_statement, style_and_voice, 
        grammar_and_mechanics, critical_thinking, essay_answer_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?);`;
    const res = await this.db.run(sql, [
      scores.content,
      scores.organization,
      scores.thesis_statement,
      scores.style_and_voice,
      scores.grammar_and_mechanics,
      scores.critical_thinking,
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
    essay_eval_id: string
  ): Promise<void> {
    const sql = `
      INSERT INTO essay_feedback (feedback, essay_eval_id) 
      VALUES (?, ?);`;
    await this.db.run(sql, [feedback, essay_eval_id]);
  }

  // Save multiple essay strengths
  async saveManyEssayStrength(essay_strengths: EssayStrength[]): Promise<void> {
    const sql = `
      INSERT INTO essay_strengths (essay_fb_id, content) 
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
      INSERT INTO essay_areas_of_improvement (essay_fb_id, content) 
      VALUES (?, ?);`;

    for (const improvement of essay_improvements) {
      await this.db.run(sql, [improvement.essay_fb_id, improvement.content]);
    }
  }
}

export default EssayRepository;

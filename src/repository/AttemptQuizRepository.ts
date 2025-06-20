import { Scores } from "@/services/attemptQuizService";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

type QuizAttemptType = {
  quiz_id: number;
  score: number;
  max_score: number;
};

type OptionAnswerType = {
  quiz_attempt_id: number;
  question_id: number;
  option_id?: string | null;
  is_correct: boolean;
};

type ShortAnswerType = {
  quiz_attempt_id: number;
  question_id: number;
  answer: string;
  is_correct: boolean;
};

export interface iAttemptQuiz {
  quiz_attempt_id: number;
  created_at: string;
  score: number;
  quiz_name: string;
  max_score: number;
  question_type: string;
  blooms_taxonomy_level: string;
  quiz_id: number;
}
export interface iEssayResults {
  rubric_id: number;
  answer: string;
  question: string;
  feedback: string;
  scores: Array<{
    criteria_name: string;
    score: string;
    max_score: number;
    break_down: number;
  }>;
  strength: Array<{
    content: string;
    strength_id: number;
  }>;
  improvements: Array<{
    area_of_improvement_id: number;
    content: string;
  }>;
}
export interface iQuizResult {
  option_answer_id?: number;
  essay_answer_id?: number;
  question: string;
  answer: string;
  is_correct: boolean;
  identification_answer_id?: number;
  real_answer?: {
    content: string;
    explanation?: string;
  };
}

class AttemptQuizRepository {
  private db: SQLiteDBConnection;

  constructor(db: SQLiteDBConnection) {
    this.db = db;
  }

  // Save quiz attempt
  async saveQuizAttempt(quiz_attempt_data: QuizAttemptType): Promise<number> {
    const { quiz_id, score, max_score } = quiz_attempt_data;
    const sql = `INSERT INTO QuizAttempt (quiz_id, score,max_score) 
                 VALUES (?, ?,?);`;
    const res = await this.db.run(sql, [quiz_id, score, max_score]);
    if (res.changes?.lastId) {
      return res.changes.lastId;
    }
    throw new Error(
      "AttemptQuizRepository.saveQuizAttempt: lastId not returned"
    );
  }

  // Save option answer
  async saveOptionAnswer(option_answer_data: OptionAnswerType): Promise<void> {
    const { quiz_attempt_id, question_id, option_id, is_correct } =
      option_answer_data;
    const sql = `INSERT INTO OptionAnswer (quiz_attempt_id, question_id, option_id, is_correct) 
                 VALUES (?, ?, ?, ?);`;
    await this.db.run(sql, [
      quiz_attempt_id,
      question_id,
      option_id ?? null,
      is_correct,
    ]);
  }

  // Save short answer
  async saveShortAnswer(short_answer_data: ShortAnswerType): Promise<number> {
    const { quiz_attempt_id, question_id, answer, is_correct } =
      short_answer_data;
    const sql = `INSERT INTO IdentificationAnswer (quiz_attempt_id, question_id, answer, is_correct) 
                 VALUES (?, ?, ?, ?);`;
    const res = await this.db.run(sql, [
      quiz_attempt_id,
      question_id,
      answer,
      is_correct,
    ]);

    if (res.changes?.lastId) {
      return res.changes?.lastId;
    }
    throw new Error(
      "AttemptQuizRepository.saveShortAnswer: lastId not returned"
    );
  }

  // Get quiz attempt by ID
  async getAttemptById(quiz_attempt_id: string) {
    const sql = `SELECT * FROM QuizAttempt WHERE quiz_attempt_id=?;`;
    const result = await this.db.query(sql, [quiz_attempt_id]);
    if (!result.values || result.values.length === 0) {
      throw new Error("No questions found");
    }
    return result.values[0];
  }

  async getManyAttempts(filters: {
    is_recent: boolean;
    limit?: string;
    onlyNotArchived?: boolean; // New filter: fetch only non-archived records
  }): Promise<iAttemptQuiz[]> {
    const { is_recent, limit, onlyNotArchived } = filters;

    const sql = `
      SELECT 
        qa.quiz_attempt_id, 
        qa.created_at, 
        qa.score, 
        q.quiz_name,
        qa.max_score,
        q.question_type,
        q.blooms_taxonomy_level,
        qa.is_archived AS attempt_archived,
        q.is_archived AS quiz_archived
      FROM 
        QuizAttempt qa
      JOIN 
        Quiz q 
        ON qa.quiz_id = q.quiz_id
      ${onlyNotArchived ? "WHERE qa.is_archived = 0 AND q.is_archived = 0" : ""}
      ORDER BY 
        qa.created_at ${is_recent ? "DESC" : "ASC"}
      ${limit ? "LIMIT " + limit : ""};
    `;

    const result = await this.db.query(sql);
    return result.values as iAttemptQuiz[];
  }

  async getAttemptQuizHistorys(filters: {
    is_recent: boolean;
    limit?: string;
    quiz_id: number;
  }): Promise<iAttemptQuiz[]> {
    const { is_recent, limit, quiz_id } = filters;
    const sql = `SELECT 
    qa.quiz_attempt_id, 
    qa.created_at, 
    qa.score,
    q.quiz_name,
    qa.max_score,
     q.question_type,
    q.blooms_taxonomy_level
FROM 
    QuizAttempt qa
JOIN 
    Quiz q 
ON 
    qa.quiz_id = q.quiz_id
WHERE 
    qa.quiz_id = ${quiz_id} 
ORDER BY 
    qa.created_at ${is_recent ? "DESC" : "ASC"} 
${limit ? "LIMIT " + limit : ""};`;

    const result = await this.db.query(sql);
    return result.values as iAttemptQuiz[];
  }
  async getAttemptQuizResults(quiz_attempt_id: number): Promise<
    iAttemptQuiz & {
      quiz_results: iQuizResult[];
    }
  > {
    const sql = `SELECT 
    qa.quiz_attempt_id, 
    qa.created_at, 
    qa.score,
    q.quiz_name,
    qa.max_score,
    q.question_type,
    q.quiz_id
FROM 
    QuizAttempt qa
JOIN 
    Quiz q 
ON 
    qa.quiz_id = q.quiz_id
WHERE 
    qa.quiz_attempt_id = ${quiz_attempt_id}`;

    const res = await this.db.query(sql);

    if (res.values?.length === 0 || !res.values) {
      throw new Error("Missing Quiz Attempt");
    }

    const quiz_attempt = res.values[0] as iAttemptQuiz & {
      question_type: string;
    };

    let quiz_res;
    switch (quiz_attempt.question_type) {
      case "true-or-false":
      case "mcq":
        const user_answer_sql_mcq = `SELECT question_id, option_answer_id, is_correct, option_id 
                                       FROM OptionAnswer 
                                       WHERE quiz_attempt_id = ${quiz_attempt.quiz_attempt_id}`;
        const user_answer_mcq = (await this.db.query(user_answer_sql_mcq))
          .values as Array<{
          question_id: number;
          option_answer_id: number;
          is_correct: number;
          option_id: number;
        }>;

        const user_ans_promise = user_answer_mcq?.map(async (user__answer) => {
          const question_sql_mcq = `SELECT question_id, content 
                                      FROM Question 
                                      WHERE question_id = ${user__answer.question_id}`;
          const options_sql_mcq = `SELECT option_id, content, is_answer, explanation 
                                     FROM Option 
                                     WHERE option_id = ${user__answer.option_id}`;

          const question = (await this.db.query(question_sql_mcq)).values;
          let options = (await this.db.query(options_sql_mcq)).values;
          if (!question || question.length === 0 || !options) {
            throw new Error("Missing Question");
          }
          const correct_answer_sql = `SELECT option_id, content, is_answer, explanation 
          FROM Option 
          WHERE question_id = ${user__answer.question_id} 
            and is_answer = 1 
          LIMIT 1`;
          const correct_answer = (await this.db.query(correct_answer_sql))
            .values;
          if (!correct_answer) {
            throw new Error("Missing Real Answer");
          }
          if (!Boolean(user__answer.is_correct)) {
            const tf_user_ans =
              correct_answer[0]?.content === "True" ? "False" : "True";
            return {
              option_answer_id: user__answer.option_answer_id,
              question: question[0].content,
              answer: options[0]?.content ?? tf_user_ans,
              is_correct: Boolean(user__answer.is_correct),
              real_answer: {
                content: correct_answer[0]?.content,
                explanation: correct_answer[0]?.explanation,
              },
            };
          } else {
            // In the correct answer case, we assume options[0] is the chosen (and correct) option.
            const tf_real_ans = correct_answer[0]?.content;
            return {
              option_answer_id: user__answer.option_answer_id,
              question: question[0].content,
              answer: options[0]?.content ?? tf_real_ans,
              is_correct: Boolean(user__answer.is_correct),
            };
          }
        });
        quiz_res = await Promise.all(user_ans_promise);
        break;

      case "short-answer":
        const user_answer_sql_short_ans = `SELECT identification_answer_id,question_id, answer,is_correct FROM IdentificationAnswer WHERE quiz_attempt_id = ${quiz_attempt.quiz_attempt_id}`;
        const user_answer_short_ans = (
          await this.db.query(user_answer_sql_short_ans)
        ).values as Array<{
          identification_answer_id: number;
          question_id: number;
          is_correct: number;
          answer: number;
        }>;
        const user_short_ans_promise = user_answer_short_ans?.map(
          async (user_answer) => {
            const question_sql = `SELECT question_id,content FROM Question WHERE question_id = ${user_answer.question_id}`;

            const question = (await this.db.query(question_sql)).values;
            if (!question || question.length === 0) {
              throw new Error("Missing Question Or Answer");
            }

            if (!Boolean(user_answer.is_correct)) {
              const correct_answer_sql = `SELECT option_id, content,is_answer,explanation FROM Option WHERE question_id = ${user_answer.question_id} and is_answer=1 LIMIT 1`;
              const correct_answer = (await this.db.query(correct_answer_sql))
                .values;
              if (!correct_answer) {
                throw new Error("Missing Real Answer");
              }
              return {
                identification_answer_id: user_answer.identification_answer_id,
                question: question[0].content,
                answer: user_answer.answer,
                is_correct: Boolean(user_answer.is_correct),
                real_answer: {
                  content: correct_answer[0]?.content,
                  explanation: correct_answer[0]?.explanation,
                },
              };
            } else {
              return {
                identification_answer_id: user_answer.identification_answer_id,
                question: question[0].content,
                answer: user_answer.answer,
                is_correct: Boolean(user_answer.is_correct),
              };
            }
          }
        );
        quiz_res = await Promise.all(user_short_ans_promise);
        break;
      case "essay":
        const essay_eval_sql = `
            SELECT 
              ea.essay_answer_id,
              ea.quiz_attempt_id,
              ea.question_id,
              ea.answer,
              ev.essay_eval_id,
              ev.rubric_id AS eval_rubric_id,
              fb.feedback,
              fb.essay_fb_id
            FROM 
              EssayAnswer AS ea
              INNER JOIN EssayEvaluation AS ev
                ON ea.essay_answer_id = ev.essay_answer_id
              INNER JOIN EssayFeedback AS fb
                ON fb.essay_eval_id = ev.essay_eval_id
            WHERE 
              ea.quiz_attempt_id = ${quiz_attempt.quiz_attempt_id};
          `;
        const essay_eval = (await this.db.query(essay_eval_sql)).values;
        if (!essay_eval) {
          throw new Error("Missing Essay Evaluation");
        }

        // Fetch evaluation criteria from the Criteria table using the essay_eval_id
        const criteria_sql = `
            SELECT 
              criteria_name,
              score,
              max_score,
              break_down
            FROM Criteria
            WHERE essay_eval_id = ${essay_eval[0].essay_eval_id};
                `;
        const criteria = (await this.db.query(criteria_sql)).values;
        if (!criteria) {
          throw new Error("Missing Criteria");
        }

        const essay_strength_sql = `
            SELECT 
              str.strength_id,
              str.content
            FROM EssayStrength AS str 
            WHERE str.essay_fb_id = ${essay_eval[0].essay_fb_id};
            `;
        const essay_strength = (await this.db.query(essay_strength_sql)).values;
        if (!essay_strength) {
          throw new Error("Missing Essay Strength");
        }

        const essay_aoi_sql = `
          SELECT 
            aio.area_of_improvement_id,
            aio.content
          FROM EssayAreaOfImprovement AS aio 
          WHERE aio.essay_fb_id = ${essay_eval[0].essay_fb_id};
`;
        const essay_aoi = (await this.db.query(essay_aoi_sql)).values;
        if (!essay_aoi) {
          throw new Error("Missing Essay Improvements");
        }

        const question_sql = `SELECT content FROM Question WHERE question_id = ${essay_eval[0].question_id}`;
        const question = (await this.db.query(question_sql)).values;
        if (!question) {
          throw new Error("Missing Question");
        }

        quiz_res = {
          rubric_id: essay_eval[0].eval_rubric_id,
          answer: essay_eval[0].answer,
          question: question[0].content,
          feedback: essay_eval[0].feedback,
          scores: criteria,
          // Replace the original "scores" object with the criteria fetched from the Criteria table.
          criteria: criteria,
          strength: essay_strength,
          improvements: essay_aoi,
        };

        break;
    }
    return {
      ...quiz_attempt,
      quiz_results:
        (quiz_res as iQuizResult[]) || (quiz_res as unknown as iEssayResults),
    };
  }
}

export default AttemptQuizRepository;

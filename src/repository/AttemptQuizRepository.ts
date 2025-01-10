import { SQLiteDBConnection } from "@capacitor-community/sqlite";

type QuizAttemptType = {
  quiz_id: number;
  score: number;
  num_questions: number;
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
  num_questions: number;
}

export interface iQuizResult {
  option_answer_id?: number;
  question: string;
  answer: string;
  is_correct: boolean;
  identification_answer_id?: number;
}

class AttemptQuizRepository {
  private db: SQLiteDBConnection;

  constructor(db: SQLiteDBConnection) {
    this.db = db;
  }

  // Save quiz attempt
  async saveQuizAttempt(quiz_attempt_data: QuizAttemptType): Promise<number> {
    const { quiz_id, score, num_questions } = quiz_attempt_data;
    const sql = `INSERT INTO QuizAttempt (quiz_id, score, num_questions) 
                 VALUES (?, ?, ?);`;
    const res = await this.db.run(sql, [quiz_id, score, num_questions]);
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

  // Get many quiz attempts
  async getManyAttempts(filters: {
    is_recent: boolean;
    limit?: string;
  }): Promise<iAttemptQuiz[]> {
    const { is_recent, limit } = filters;
    const sql = `SELECT 
          qa.quiz_attempt_id, 
          qa.created_at, 
          qa.score, 
    q.quiz_name,
    q.num_questions,
    qa.created_at

FROM 
    QuizAttempt qa
JOIN 
    Quiz q 
ON 
    qa.quiz_id = q.quiz_id
ORDER BY 
    qa.created_at ${is_recent ? "DESC" : "ASC"} ${
      limit ? "LIMIT " + limit : ""
    };`;

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
    qa.created_at, 
    q.quiz_name,
    q.num_questions
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
    qa.created_at, 
    q.quiz_name,
    q.num_questions,
    q.question_type
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
      case "mcq":
      case "true-or-false":
        const user_answer_sql_option = `SELECT question_id,option_answer_id,is_correct,option_id FROM OptionAnswer WHERE quiz_attempt_id = ${quiz_attempt.quiz_attempt_id}`;
        const user_answer_option = (await this.db.query(user_answer_sql_option))
          .values as Array<{
          question_id: number;
          option_answer_id: number;
          is_correct: number;
          option_id: number;
        }>;
        const user_ans_promise = user_answer_option?.map(async (answer) => {
          const question_sql = `SELECT question_id,content FROM Question WHERE question_id = ${answer.question_id}`;
          const options_sql = `SELECT option_id, content,is_answer,explanation FROM Option WHERE option_id=${answer.option_id}`;

          const question = (await this.db.query(question_sql)).values;
          let options;
          if (quiz_attempt.question_type === "mcq") {
            options = (await this.db.query(options_sql)).values;
          }
          if (!question || question.length === 0) {
            throw new Error("Missing Question");
          }

          return {
            option_answer_id: answer.option_answer_id,
            question: question[0].content,
            answer: options ? options[0]?.content : null,
            is_correct: Boolean(answer.is_correct),
          };
        });
        quiz_res = await Promise.all(user_ans_promise);
        break;
      case "short-answer":
        console.log(quiz_attempt);
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
          async (answer) => {
            const question_sql = `SELECT question_id,content FROM Question WHERE question_id = ${answer.question_id}`;

            const question = (await this.db.query(question_sql)).values;
            console.log(question);
            if (!question || question.length === 0) {
              throw new Error("Missing Question Or Answer");
            }

            return {
              identification_answer_id: answer.identification_answer_id,
              question: question[0].content,
              answer: answer.answer,
              is_correct: Boolean(answer.is_correct),
            };
          }
        );
        quiz_res = await Promise.all(user_short_ans_promise);
        break;
      case "essay":
    }
    return {
      ...quiz_attempt,
      quiz_results: quiz_res as iQuizResult[],
    };
  }
}

export default AttemptQuizRepository;

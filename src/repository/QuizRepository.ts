import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { Quiz } from "@/databases/models/quiz";

export interface iMCQQuestion {
  quiz_name: string;
  question_type: string;
  blooms_taxonomy_level: string;
  created_at?: string;
  num_questions: number;
  quiz_id: number;
  description?: string;
  questions: QuestionWithOptions[];
}

export interface iQuiz {
  quiz_name: string;
  question_type: string;
  blooms_taxonomy_level: string;
  created_at?: string;
  num_questions: number;
  quiz_id: number;
  description?: string;
}

export interface Option {
  content: string;
  is_answer: boolean;
  option_id?: number;
  explanation?: string | null;
}

export interface QuestionWithOptions {
  question_id: number;
  content: string;
  options: Option[];
}

interface SavedMCQQuiz {
  quiz_id: number;
  quiz_name: string;
  question_type: string;
  blooms_taxonomy_level: string;
  questions: QuestionWithOptions[];
}

type QuizData = {
  quiz_name: string;
  question_type: string;
  blooms_taxonomy_level: string;
  num_questions: number;
  note_id: number;
  description: string | null;
};

export interface iMCQQuestionGen {
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  answer: string;
}

export interface iTForShortAnswerQuestionGen {
  question: string;
  answer: boolean;
  explanation: string;
}
export interface iEssayQuestionGen {
  question: string;
}
export interface iSavedEssay {
  quiz_id: number;
  quiz_name: string;
  question_type: string;
  blooms_taxonomy_level: string;
  questions: Array<{ question_id: number; content: string }>;
}
class QuizRepository {
  private db: SQLiteDBConnection;

  constructor(db: SQLiteDBConnection) {
    this.db = db;
  }

  // Save quiz data
  async saveQuiz(quiz_data: {
    quiz_name: string;
    question_type: string;
    blooms_taxonomy_level: string;
    description: string | null;
  }): Promise<number> {
    const { quiz_name, question_type, blooms_taxonomy_level, description } =
      quiz_data;
    const sql = `INSERT INTO Quiz (quiz_name, question_type, blooms_taxonomy_level, description) 
                 VALUES (?, ?, ?, ?, ?);`;
    const res = await this.db.run(sql, [
      quiz_name,
      question_type,
      blooms_taxonomy_level,
      description,
    ]);
    if (res.changes?.lastId) {
      return res.changes.lastId;
    }
    throw new Error(`QuizRepository.saveQuiz: lastId not returned`);
  }

  // Get quiz by ID with questions
  async getQuizWithQuestions(quiz_id: string) {
    const sql = `SELECT quiz_id, quiz_name, question_type, blooms_taxonomy_level, description, created_at 
                 FROM Quiz WHERE quiz_id=?;`;
    const result = await this.db.query(sql, [quiz_id]);
    if (!result.values || result.values?.length === 0) {
      throw new Error("Quiz not found");
    }
    const quiz = result.values[0];

    // Fetch associated questions and options
    const questionsSql = `SELECT question_id, content FROM Question WHERE quiz_id=?;`;
    const questionsResult = await this.db.query(questionsSql, [quiz_id]);
    quiz.questions = questionsResult.values;

    // Optionally fetch options for each question
    for (let question of quiz.questions) {
      const optionsSql = `SELECT option_id, content, is_answer,explanation FROM Option WHERE question_id=?;`;
      const optionsResult = await this.db.query(optionsSql, [
        question.question_id,
      ]);
      question.options = optionsResult.values;
    }

    return quiz;
  }

  // Get a list of quizzes with optional filters
  async getManyQuiz(filters: {
    is_recent: boolean;
    search_key_word: string | null;
  }): Promise<iQuiz[]> {
    const { is_recent, search_key_word } = filters;
    let sql = `SELECT quiz_id, quiz_name, question_type, blooms_taxonomy_level, created_at ,num_questions
               FROM Quiz`;

    if (search_key_word) {
      sql += ` WHERE quiz_name LIKE ?`;
    }

    sql += ` ORDER BY created_at ${is_recent ? "DESC" : "ASC"} LIMIT 10;`;

    const result = await this.db.query(
      sql,
      search_key_word ? [`%${search_key_word}%`] : []
    );

    return result.values as iQuiz[];
  }

  async save_generated_mcq(
    quiz_data: QuizData,
    generated_questions: iMCQQuestionGen[]
  ): Promise<SavedMCQQuiz> {
    try {
      // Start a new transaction
      // Insert quiz data
      const quizInsertResult = await this.db.run(
        "INSERT INTO Quiz (quiz_name, question_type, blooms_taxonomy_level,num_questions,note_id,description) VALUES ( ?, ?, ?,?,?,?)",
        [
          quiz_data.quiz_name,
          quiz_data.question_type,
          quiz_data.blooms_taxonomy_level,
          quiz_data.num_questions,
          quiz_data.note_id,
          quiz_data.description ?? null,
        ]
      );
      const quiz_id = quizInsertResult.changes?.lastId;
      // Process each question
      const questionPromises = generated_questions.map(async (question) => {
        // Insert question data
        const questionInsertResult = await this.db.run(
          "INSERT INTO Question (quiz_id, content) VALUES (?, ?)",
          [Number(quiz_id), question.question]
        );
        const question_id = questionInsertResult.changes?.lastId;

        // Process options for each question
        const optionPromises = Object.entries(question.options).map(
          async ([key, value]) => {
            const is_answer =
              question.answer.trim().length === 1
                ? key.toLowerCase().trim() ===
                  question.answer.toLowerCase().trim()
                : value.toLowerCase().trim() ===
                  question.answer
                    .toLowerCase()
                    .replace(/^[a-zA-Z]+\)\s*/, "")
                    .trim();

            // Insert option data
            const savedOption = await this.db.run(
              "INSERT INTO Option (question_id, content, is_answer) VALUES (?, ?, ?)",
              [Number(question_id), value, is_answer]
            );

            return {
              is_answer,
              content: value,
              option_id: savedOption.changes?.lastId as number,
            };
          }
        );

        // Wait for all options to be inserted
        const saved_options = await Promise.all(optionPromises);

        return {
          question_id: Number(question_id),
          content: question.question,
          options: saved_options,
        };
      });

      // Wait for all questions and options to be inserted
      const questionsWithOptions = await Promise.all(questionPromises);

      // Return the result
      return {
        quiz_id: Number(quiz_id),
        quiz_name: quiz_data.quiz_name,
        question_type: quiz_data.question_type,
        blooms_taxonomy_level: quiz_data.blooms_taxonomy_level,
        questions: questionsWithOptions,
      };
    } catch (error) {
      console.log(`Error: ${error}`);
      throw error;
    }
  }

  async saved_gen_true_false_or_short_answer(
    quiz_data: QuizData,
    generated_questions: iTForShortAnswerQuestionGen[]
  ) {
    try {
      // Save quiz data
      const quizInsertResult = await this.db.run(
        "INSERT INTO Quiz (quiz_name, question_type, blooms_taxonomy_level, num_questions, note_id,description) VALUES (?, ?, ?, ?, ?, ?)",
        [
          quiz_data.quiz_name,
          quiz_data.question_type,
          quiz_data.blooms_taxonomy_level,
          quiz_data.num_questions,
          quiz_data.note_id,
          quiz_data.description ?? null,
        ]
      );
      const quiz_id = quizInsertResult.changes?.lastId;

      // Process questions
      const questionPromises = generated_questions.map(async (question) => {
        // Save question
        const questionInsertResult = await this.db.run(
          "INSERT INTO Question (quiz_id, content) VALUES (?, ?)",
          [Number(quiz_id), question.question]
        );
        const question_id = questionInsertResult.changes?.lastId;

        // Save answer
        const answerInsertResult = await this.db.run(
          "INSERT INTO Option (question_id, content, is_answer, explanation) VALUES (?, ?, ?, ?)",
          [Number(question_id), question.answer, true, question.explanation]
        );
        const option_id = answerInsertResult.changes?.lastId;

        return {
          question_id: Number(question_id),
          content: question.question,
          answer: {
            option_id: Number(option_id),
            content: question.answer,
            is_answer: true,
          },
          explanation: question.explanation,
        };
      });

      const questions_with_answer = await Promise.all(questionPromises);

      return {
        quiz_id: Number(quiz_id),
        quiz_name: quiz_data.quiz_name,
        question_type: quiz_data.question_type,
        blooms_taxonomy_level: quiz_data.blooms_taxonomy_level,
        questions: questions_with_answer,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Something Went Wrong");
    }
  }
  // Save quiz and essay questions
  async saveEssayQuestion(
    quiz_data: QuizData,
    generated_questions: iEssayQuestionGen[]
  ): Promise<iSavedEssay> {
    try {
      // Start a new transaction
      const quizInsertResult = await this.db.run(
        "INSERT INTO Quiz (quiz_name, question_type, blooms_taxonomy_level, num_questions, note_id,description) VALUES (?, ?, ?, ?, ?, ?)",
        [
          quiz_data.quiz_name,
          quiz_data.question_type,
          quiz_data.blooms_taxonomy_level,
          quiz_data.num_questions,
          quiz_data.note_id,
          quiz_data.description ?? null,
        ]
      );
      const quiz_id = quizInsertResult.changes?.lastId;

      // Process each essay question
      const questionPromises = generated_questions.map(async (question) => {
        // Insert question data
        const questionInsertResult = await this.db.run(
          "INSERT INTO Question (quiz_id, content) VALUES (?, ?)",
          [Number(quiz_id), question.question]
        );
        const question_id = questionInsertResult.changes?.lastId;

        return {
          question_id: Number(question_id),
          content: question.question,
        };
      });

      // Wait for all essay questions to be inserted
      const saved_questions = await Promise.all(questionPromises);

      // Return the result
      return {
        quiz_id: Number(quiz_id),
        quiz_name: quiz_data.quiz_name,
        question_type: quiz_data.question_type,
        blooms_taxonomy_level: quiz_data.blooms_taxonomy_level,
        questions: saved_questions,
      };
    } catch (error) {
      console.log(`Error: ${error}`);
      throw new Error("Error saving essay questions");
    }
  }
  async updateQuizDetail(
    quiz_id: number,
    quiz_name: string,
    description: string | null
  ): Promise<void> {
    try {
      const sql = `UPDATE Quiz SET quiz_name = ?, description = ? WHERE quiz_id = ?`;
      const res = await this.db.run(sql, [quiz_name, description, quiz_id]);
    } catch (error) {
      console.error("Error updating quiz details:", error);
      throw new Error("Unable to update quiz details");
    }
  }
}

export default QuizRepository;

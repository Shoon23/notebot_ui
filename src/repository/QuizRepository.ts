import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { Quiz } from "@/databases/models/quiz";
import { v4 as uuidv4 } from "uuid";

export interface iMCQQuestion {
  quiz_name: string;
  question_type: string;
  blooms_taxonomy_level: string;
  created_at?: string;

  quiz_id: number;
  description?: string;
  chain_id: string;
  num_questions: number;
  note_id: number;
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
  num_questions: number;
  chain_id: string;
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
  chain_id: string;
  num_questions: number;
}
interface iSingleShortAnswerOrTFQuestion {
  content: string;
  options: {
    content: string;
    explanation?: string;
    is_answer: boolean; // should always be true for the single option
  }[];
}
interface iSingleMCQ {
  content: String;
  options: Array<{
    content: string;
    is_answer: boolean;
  }>;
}

export interface iQuizSet {
  chain_id: string;
  quiz_id: number;
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
  async getQuizWithQuestions(quiz_id: number) {
    const sql = `SELECT quiz_id, note_id, quiz_name, question_type, blooms_taxonomy_level,num_questions, description, created_at,chain_id 
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

  async getManyQuiz(filters: {
    is_recent: boolean;
    search_key_word: string | null;
    onlyNotArchived?: boolean; // Optional filter for archived quizzes
  }): Promise<iQuiz[]> {
    const { is_recent, search_key_word, onlyNotArchived } = filters;
    let sql = `SELECT quiz_id, quiz_name, question_type, blooms_taxonomy_level, created_at, num_questions
               FROM Quiz`;
    const conditions: string[] = [];
    const params: any[] = [];

    // Add search condition if provided.
    if (search_key_word) {
      conditions.push(`quiz_name LIKE ?`);
      params.push(`%${search_key_word}%`);
    }

    // Add archive filter if requested.
    if (onlyNotArchived) {
      conditions.push(`is_archived = 0`);
    }

    // Add condition to only select the oldest quiz for each chain_id.
    conditions.push(
      `created_at = (SELECT MIN(q2.created_at) FROM Quiz q2 WHERE q2.chain_id = Quiz.chain_id)`
    );

    // Combine conditions into the SQL query.
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    // Order by created_at based on is_recent flag and limit the results.
    sql += ` ORDER BY created_at ${is_recent ? "DESC" : "ASC"} LIMIT 10;`;

    const result = await this.db.query(sql, params);
    return result.values as iQuiz[];
  }

  async save_generated_mcq(
    quiz_data: QuizData,
    generated_questions: iMCQQuestionGen[],
    chain_id: string | null
  ): Promise<SavedMCQQuiz> {
    try {
      // Start a new transaction
      // Insert quiz data

      const chainId = chain_id ?? uuidv4();
      const quizInsertResult = await this.db.run(
        "INSERT INTO Quiz (quiz_name, question_type, blooms_taxonomy_level,num_questions,note_id,description,chain_id,raw_text) VALUES (?, ?, ?, ?,?,?,?,?)",
        [
          quiz_data.quiz_name,
          quiz_data.question_type,
          quiz_data.blooms_taxonomy_level,
          quiz_data.num_questions,
          quiz_data.note_id,
          quiz_data.description ?? null,
          chainId,
          JSON.stringify(generated_questions),
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
        num_questions: questionsWithOptions.length,
        chain_id: chainId,
      };
    } catch (error) {
      console.log(`Error: ${error}`);
      throw error;
    }
  }

  async saved_gen_true_false_or_short_answer(
    quiz_data: QuizData,
    generated_questions: iTForShortAnswerQuestionGen[],
    chain_id: string | null
  ) {
    try {
      // Save quiz data
      const chainId = chain_id ?? uuidv4();
      const quizInsertResult = await this.db.run(
        "INSERT INTO Quiz (quiz_name, question_type, blooms_taxonomy_level, num_questions, note_id,description,chain_id,raw_text) VALUES (?,?, ?, ?, ?, ?, ?.?)",
        [
          quiz_data.quiz_name,
          quiz_data.question_type,
          quiz_data.blooms_taxonomy_level,
          quiz_data.num_questions,
          quiz_data.note_id,
          quiz_data.description ?? null,
          chainId,
          JSON.stringify(generated_questions),
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
        num_questions: questions_with_answer.length,
        chain_id: chainId,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Something Went Wrong");
    }
  }
  // Save quiz and essay questions
  async saveEssayQuestion(
    quiz_data: QuizData,
    generated_questions: iEssayQuestionGen[],
    chain_id: string | null
  ): Promise<iSavedEssay> {
    try {
      // Start a new transaction
      const chainId = chain_id ?? uuidv4();

      const quizInsertResult = await this.db.run(
        "INSERT INTO Quiz (quiz_name, question_type, blooms_taxonomy_level, num_questions, note_id,description,chain_id,raw_text) VALUES (?,?, ?, ?, ?, ?, ?,?)",
        [
          quiz_data.quiz_name,
          quiz_data.question_type,
          quiz_data.blooms_taxonomy_level,
          quiz_data.num_questions,
          quiz_data.note_id,
          quiz_data.description ?? null,
          chainId,
          JSON.stringify(generated_questions),
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
        num_questions: 1,
        chain_id: chainId,
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

  /**
   * Save a single MCQ question.
   * Inserts the question and its options into the database.
   */
  async saveSingleMCQQuestion(
    quiz_id: number,
    new_question: iSingleMCQ
  ): Promise<QuestionWithOptions> {
    // Update Number of Question

    const updateQuiz = await this.db.run(
      "UPDATE Quiz SET num_questions = num_questions + 1 WHERE quiz_id = ?",
      [quiz_id]
    );

    // Insert the question into the Question table.
    const questionInsertResult = await this.db.run(
      "INSERT INTO Question (quiz_id, content) VALUES (?, ?)",
      [quiz_id, new_question.content]
    );
    const question_id = questionInsertResult.changes?.lastId;
    if (!question_id) {
      throw new Error("saveSingleMCQQuestion: Failed to insert question");
    }

    // Insert each option into the Option table.
    const optionPromises = new_question.options.map(async (opt) => {
      const result = await this.db.run(
        "INSERT INTO Option (question_id, content, is_answer) VALUES (?, ?, ?)",
        [Number(question_id), opt.content, opt.is_answer]
      );
      return {
        option_id: result.changes?.lastId as number,
        content: opt.content,
        is_answer: opt.is_answer,
      } as Option;
    });

    const savedOptions = await Promise.all(optionPromises);

    return {
      question_id: Number(question_id),
      content: new_question.content as string,
      options: savedOptions,
    };
  }
  async saveSingleShortAnswerOrTFQuestion(
    quiz_id: number,
    new_question: iSingleShortAnswerOrTFQuestion
  ): Promise<QuestionWithOptions> {
    // Update Number of Question

    const updateQuiz = await this.db.run(
      "UPDATE Quiz SET num_questions = num_questions + 1 WHERE quiz_id = ?",
      [quiz_id]
    );
    // Insert the question into the Question table.
    const questionInsertResult = await this.db.run(
      "INSERT INTO Question (quiz_id, content) VALUES (?, ?)",
      [quiz_id, new_question.content]
    );
    const question_id = questionInsertResult.changes?.lastId;
    if (!question_id) {
      throw new Error(
        "saveSingleShortAnswerOrTFQuestion: Failed to insert question"
      );
    }

    // For short answer/true-false, we expect exactly one option.
    const optionData = new_question.options[0];
    const result = await this.db.run(
      "INSERT INTO Option (question_id, content, is_answer, explanation) VALUES (?, ?, ?, ?)",
      [
        Number(question_id),
        optionData.content,
        optionData.is_answer,
        optionData.explanation,
      ]
    );
    const option_id = result.changes?.lastId;
    if (!option_id) {
      throw new Error(
        "saveSingleShortAnswerOrTFQuestion: Failed to insert option"
      );
    }

    const savedOption: Option = {
      option_id: Number(option_id),
      content: optionData.content,
      is_answer: optionData.is_answer,
      explanation:
        optionData.explanation !== undefined ? optionData.explanation : "",
    };

    return {
      question_id: Number(question_id),
      content: new_question.content,
      options: [savedOption],
    };
  }

  async getQuizzesByChain(chainId: string): Promise<iQuizSet[]> {
    try {
      const query = `
  SELECT quiz_id,chain_id FROM Quiz
  WHERE chain_id = ?
  ORDER BY created_at
`;
      const result = await this.db.query(query, [chainId]);
      return result.values as iQuizSet[];
    } catch (error) {
      throw new Error("Unable to Retreive Chained Quiz");
    }
  }
  async getQuizzesByChainRawText(chainId: string): Promise<
    Array<{
      raw_text: string;
    }>
  > {
    try {
      const query = `
  SELECT raw_text FROM Quiz
  WHERE chain_id = ?
  ORDER BY created_at
`;
      const result = await this.db.query(query, [chainId]);
      return result.values as Array<{
        raw_text: string;
      }>;
    } catch (error) {
      throw new Error("Unable to Retreive Chained Quiz");
    }
  }
  async createRegeneratedQuiz(
    quizId: string,
    noteId: string,
    chainId: string,
    quizName: string
  ): Promise<void> {
    try {
      const query = `
    INSERT INTO Quiz 
      (quiz_id, note_id, chain_id,  quiz_name)
    VALUES 
      (?, ?, ?, ?))
  `;
      await this.db.run(query, [quizId, noteId, chainId, quizName]);
    } catch (error) {
      throw new Error("Unable to Saved Chained Quiz");
    }
  }
}

export default QuizRepository;

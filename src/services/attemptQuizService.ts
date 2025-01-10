import AttemptQuizRepository from "@/repository/AttemptQuizRepository";
import QuestionRepository from "@/repository/QuestionRepository";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
export interface iAttemptQuiz {
  quiz_id: number;
  attempted_answers: Array<{
    question_id: number;
    question: string | null;
    answer: {
      content: string;
      option_id?: string | null;
    };
  }>;
}
class AttemptQuizService {
  private attemptQuizRepo: AttemptQuizRepository;
  private questionRepo: QuestionRepository;
  constructor(
    attemptQuizRepo: AttemptQuizRepository,
    questionRepo: QuestionRepository
  ) {
    this.attemptQuizRepo = attemptQuizRepo;
    this.questionRepo = questionRepo;
  }

  async processMCQAnswers(answers: iAttemptQuiz) {
    const { checked_answers, score, num_questions, quiz_id } =
      await this.check_answers(answers, "option_id");
    try {
      // saving the quiz attempt
      const saved_quiz_attempt = await this.attemptQuizRepo.saveQuizAttempt({
        quiz_id,
        score,
        num_questions,
      });
      // Saving the answers
      const answers_promises = checked_answers.map(async (user_answer) => {
        await this.attemptQuizRepo.saveOptionAnswer({
          is_correct: user_answer.is_correct,
          option_id: user_answer.option_id as string,
          question_id: user_answer.question_id,
          quiz_attempt_id: saved_quiz_attempt,
        });
        return user_answer;
      });
      const saved_answers = await Promise.all(answers_promises);
      return {
        num_questions,
        quiz_id,
        score,
        quiz_attempt_id: saved_quiz_attempt,
        results: saved_answers,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async processTrueFalseAnswers(answers: iAttemptQuiz) {
    const { checked_answers, score, num_questions, quiz_id } =
      await this.check_answers(answers, "content");
    try {
      // Save Quiz Atttempt
      const saved_quiz_attempt = await this.attemptQuizRepo.saveQuizAttempt({
        quiz_id,
        score,
        num_questions,
      });
      // Save the Answers
      const answers_promises = checked_answers.map(async (user_answer) => {
        const saved_answers = await this.attemptQuizRepo.saveOptionAnswer({
          is_correct: user_answer.is_correct,
          question_id: user_answer.question_id,
          quiz_attempt_id: saved_quiz_attempt,
        });
        return user_answer;
      });
      const saved_answers = await Promise.all(answers_promises);
      return {
        num_questions,
        quiz_id,
        score,
        quiz_attempt_id: saved_quiz_attempt,
        results: saved_answers,
      };
    } catch (error) {
      throw error;
    }
  }
  async processShortAnswer(answers: iAttemptQuiz) {
    const { checked_answers, score, num_questions, quiz_id } =
      await this.check_answers(answers, "content");

    try {
      // Save Quiz Atttempt
      const saved_quiz_attempt = await this.attemptQuizRepo.saveQuizAttempt({
        quiz_id,
        score,
        num_questions,
      });
      // Save the Answers
      const answers_promises = checked_answers.map(async (user_answer) => {
        const saved_answers = await this.attemptQuizRepo.saveShortAnswer({
          answer: user_answer.content,
          is_correct: user_answer.is_correct,
          question_id: user_answer.question_id,
          quiz_attempt_id: saved_quiz_attempt,
        });
        return user_answer;
      });
      const saved_answers = await Promise.all(answers_promises);

      return {
        score,
        num_questions,
        quiz_id,
        quiz_attempt_id: saved_quiz_attempt,
        results: saved_answers,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  private check_answers = async (
    answers: iAttemptQuiz,
    compare_by: "content" | "option_id"
  ) => {
    const { quiz_id, attempted_answers } = answers;

    // Fetching the correct answers
    const correct_answers = await this.questionRepo.getQuestionsWithAnswer(
      quiz_id
    );

    // Validate quiz length
    if (attempted_answers.length !== correct_answers.length) {
      throw new Error("Quiz length does not match");
    }
    // Normalize the correct answers
    const correct_answers_map = this.answers_to_map(correct_answers);
    console.log("quiz service", correct_answers_map);
    let score = 0;
    // Check each attempted answer
    const checked_answers = attempted_answers.map((user_answer) => {
      const correct_value =
        compare_by === "content"
          ? correct_answers_map
              .get(user_answer.question_id)
              ?.content?.toLowerCase()
          : correct_answers_map.get(user_answer.question_id)?.option_id;

      // Validate the presence of a correct answer
      if (!correct_value) {
        throw new Error("Question Missing");
      }

      // Compare the user's answer with the correct one
      const user_value =
        compare_by === "content"
          ? user_answer.answer.content.toLowerCase()
          : user_answer.answer.option_id;

      const is_correct = correct_value === user_value;

      if (is_correct) {
        score += 1;
      }

      return {
        question_id: user_answer.question_id,
        option_id: user_answer.answer.option_id,
        content: user_answer.answer.content,
        is_correct,
      };
    });

    return {
      score,
      checked_answers,
      num_questions: correct_answers.length,
      quiz_id,
    };
  };
  private answers_to_map = (correct_answers: any[]) => {
    const correct_answers_map = new Map<
      number,
      { option_id: number | null; content: string | null }
    >();

    correct_answers.forEach((question) => {
      const option_id = question.options[0].option_id;
      const content = question.options[0].content;
      if (option_id) {
        correct_answers_map.set(question.question_id, {
          content,
          option_id,
        });
      }
    });

    return correct_answers_map;
  };
}

export default AttemptQuizService;

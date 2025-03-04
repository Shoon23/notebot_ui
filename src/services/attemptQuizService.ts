import AttemptQuizRepository from "@/repository/AttemptQuizRepository";
import EssayRepository from "@/repository/EssayRepository";
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
export interface AttemptEssayType {
  scores: Scores[];
  feedbacks: Feedbacks;
}

export interface Scores {
  criterion: string;
  score: number;
  max: number;
  breakdown: string;
}
export interface Feedbacks {
  feedback: string;
  strength: string[];
  areas_of_improvement: string[];
}

// Define the structure for each item in the array
export interface EssayEvaluation {}

class AttemptQuizService {
  private attemptQuizRepo: AttemptQuizRepository;
  private questionRepo: QuestionRepository;
  private essayRepo: EssayRepository;
  constructor(
    attemptQuizRepo: AttemptQuizRepository,
    questionRepo: QuestionRepository,
    essayRepo: EssayRepository
  ) {
    this.attemptQuizRepo = attemptQuizRepo;
    this.questionRepo = questionRepo;
    this.essayRepo = essayRepo;
  }

  async processMCQAnswers(answers: iAttemptQuiz) {
    const { checked_answers, score, quiz_id, max_score } =
      await this.check_answers(answers, "option_id");
    try {
      // saving the quiz attempt
      const saved_quiz_attempt = await this.attemptQuizRepo.saveQuizAttempt({
        quiz_id,
        score,
        max_score,
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
    const { checked_answers, score, quiz_id, max_score } =
      await this.check_answers(answers, "content");

    console.log(answers);
    console.log(checked_answers);
    try {
      // Save Quiz Atttempt
      const saved_quiz_attempt = await this.attemptQuizRepo.saveQuizAttempt({
        quiz_id,
        score,
        max_score,
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
    const { checked_answers, score, quiz_id, max_score } =
      await this.check_answers(answers, "content");

    try {
      // Save Quiz Atttempt
      const saved_quiz_attempt = await this.attemptQuizRepo.saveQuizAttempt({
        quiz_id,
        score,
        max_score,
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
        quiz_id,
        quiz_attempt_id: saved_quiz_attempt,
        results: saved_answers,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async processEssayAnswer(
    answers: AttemptEssayType & {
      answer: string;
      quiz_id: number;
      question_id: number;
      rubric_id: number;
    }
  ) {
    const { feedbacks, scores, quiz_id, answer, question_id, rubric_id } =
      answers;

    try {
      // Calculate total essay score
      const { totalMax, totalScore } = this.calculateTotalEssayScore(scores);
      // Save Quiz Attempt
      const quiz_attempt_id = await this.attemptQuizRepo.saveQuizAttempt({
        quiz_id,
        score: totalScore,
        max_score: totalMax,
      });
      // Save Essay Answer
      const essay_answer_id = await this.essayRepo.saveEssayAnswer(
        quiz_attempt_id,
        question_id,
        answer
      );

      // Save Essay Evaluation
      const essay_eval_id = await this.essayRepo.saveEssayEvaluation(
        essay_answer_id,
        rubric_id
      );

      //Save Essay Scores
      const essay_scores_id = await this.essayRepo.saveScores(
        essay_eval_id,
        scores
      );
      // Save Feedback
      const { areas_of_improvement, feedback, strength } = feedbacks;
      const essay_fb_id = await this.essayRepo.saveEssayFeedback(
        feedback,
        essay_eval_id
      );
      // Map strengths and save
      const transformed_strength = this.mapStringsToObjects(
        strength,
        essay_fb_id
      );
      const saved_strength = await this.essayRepo.saveManyEssayStrength(
        transformed_strength
      );

      // Map areas of improvement and save
      const transformed_improvements = this.mapStringsToObjects(
        areas_of_improvement,
        essay_fb_id
      );
      const saved_improvement =
        await this.essayRepo.saveManyEssayAreaOfImprovements(
          transformed_improvements
        );
      return {
        quiz_id,
        quiz_attempt_id,
        results: {
          criteria: scores,
          score: totalScore,
          maxScore: totalMax,
          feedback,
          strength,
          areas_of_improvement,
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private calculateTotalEssayScore = (
    scores: Scores[]
  ): { totalScore: number; totalMax: number } => {
    return scores.reduce(
      (acc, current) => ({
        totalScore: acc.totalScore + current.score,
        totalMax: acc.totalMax + current.max,
      }),
      { totalScore: 0, totalMax: 0 }
    );
  };

  private mapStringsToObjects = (
    strings: string[],
    essay_fb_id: number
  ): { essay_fb_id: number; content: string }[] => {
    return strings.map((content) => ({
      essay_fb_id,
      content,
    }));
  };

  private check_answers = async (
    answers: iAttemptQuiz,
    compare_by: "content" | "option_id"
  ) => {
    const { quiz_id, attempted_answers } = answers;

    // Fetching the correct answers
    const correct_answers = await this.questionRepo.getQuestionsWithAnswer(
      quiz_id
    );
    // Normalize the correct answers
    const correct_answers_map = this.answers_to_map(correct_answers);
    let score = 0;
    // Check each attempted answer
    const checked_answers = attempted_answers.map((user_answer) => {
      const correct_value =
        compare_by === "content"
          ? correct_answers_map
              .get(user_answer.question_id)
              ?.content?.toLowerCase()
              .trim()
          : correct_answers_map.get(user_answer.question_id)?.option_id;

      // Validate the presence of a correct answer
      if (!correct_value) {
        throw new Error("Question Missing");
      }

      // Compare the user's answer with the correct one
      const user_value =
        compare_by === "content"
          ? user_answer.answer.content.toLowerCase().trim()
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
      max_score: checked_answers.length,
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

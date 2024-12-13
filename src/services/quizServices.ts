import { iFormQuizGeneration } from "@/types/quiz-generation";
import authAxiosInstance from "../lib/authAxiosInstance";
import { iQuiz } from "@/types/quiz";
import { iQuizDetails } from "@/types/quiz";

async function getQuizzes(userId: string): Promise<iQuiz[]> {
  const response = await authAxiosInstance.get(
    `/quizzes/${userId}?is_recent=true`
  );

  return response.data;
}

async function getQuiz(quizId: string): Promise<iQuizDetails> {
  const response = await authAxiosInstance.get(
    `/quiz/${quizId}?is_recent=true`
  );
  console.log(response.data);
  return response.data;
}

async function generateQuiz(
  quiz_data: iFormQuizGeneration & { user_id: string }
) {
  const { question_type, ...other } = quiz_data;
  const response = await authAxiosInstance.post(`/generate-questions`, other);
  console.log(response);
  return response.data;
}

export default {
  getQuizzes,
  generateQuiz,
  getQuiz,
};

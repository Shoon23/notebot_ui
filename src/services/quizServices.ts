import { iFormQuizGeneration } from "@/types/quiz-generation";
import authAxiosInstance from "../lib/authAxiosInstance";

async function getQuizzes(userId: string) {
  const response = await authAxiosInstance.get(
    `/quizzes/${userId}?is_recent=true`
  );

  return response.data;
}

async function getQuiz(quizId: string) {
  const response = await authAxiosInstance.get(
    `/quiz/${quizId}?is_recent=true`
  );
  console.log(response);
  return response.data;
}

async function generateQuiz(
  quiz_data: iFormQuizGeneration & { user_id: string }
) {
  const { question_type, ...other } = quiz_data;
  const response = await authAxiosInstance.post(
    `/generate-questions/${question_type}`,
    other
  );
  console.log(response);
  return response.data;
}

export default {
  getQuizzes,
  generateQuiz,
  getQuiz,
};

import { iQuizAttempt } from "@/types/quiz";
import authAxiosInstance from "../lib/authAxiosInstance";

async function submitQuizAttempt(
  answerData: iQuizAttempt,
  quiz_type: "mcq" | "true-or-false"
) {
  const res = await authAxiosInstance.post(
    `/attempt-quiz/submit/${quiz_type}`,
    answerData
  );

  console.log(res);

  return res.data;
}

export default {
  submitQuizAttempt,
};

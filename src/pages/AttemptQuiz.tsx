import React, { useEffect, useState } from "react";
import AttemptCard from "../components/AttemptCard";
import QuestionCard from "../components/MultipleChoiceCard";
import { useParams } from "react-router-dom";
import quizServices from "@/services/quizServices";
import AnswerQuestionCard from "@/components/AnswerQuestionCard";
import { iAttemptedAnswer, iQuizAttempt, iQuizDetails } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import attemptQuizServices from "@/services/attemptQuizServices";
import useUserSession from "@/hooks/useUserSession";

const AttemptQuiz: React.FC = () => {
  const { quizId } = useParams<any>();
  const [answers, setAnswers] = useState<iAttemptedAnswer[]>([]);
  const [quizData, setQuizData] = useState<iQuizDetails>({
    blooms_taxonomy_level: "",
    difficulty: "",
    question_type: "",
    quiz_id: "",
    quiz_name: "",
    question: [],
  });

  const { user_id } = useUserSession();
  useEffect(() => {
    const fetchQuiz = async () => {
      const data = await quizServices.getQuiz(quizId as string);
      setQuizData(data);
    };
    fetchQuiz();
  }, []);

  const handleSelectAnswer = (
    value: string,
    question_id: string,
    option_id: string
  ) => {
    const answer = {
      content: value,
      option_id: option_id,
    };
    setAnswers((prevAnswers) => {
      // Check if an entry for the question_id already exists
      const existingIndex = prevAnswers.findIndex(
        (entry) => entry.question_id === question_id
      );

      if (existingIndex !== -1) {
        // Update the existing answer
        return prevAnswers.map((entry, index) =>
          index === existingIndex
            ? { ...entry, answer: { ...entry.answer, ...answer } }
            : entry
        );
      } else {
        // Add a new entry
        return [...prevAnswers, { question_id, answer }];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (quizData.question.length !== answers.length) {
      console.log("answer them all");
      return;
    }

    try {
      const answerData = {
        user_id,
        quiz_id: quizId,
        attempted_answers: answers,
      };
      await attemptQuizServices.submitQuizAttempt(
        answerData,
        quizData.question_type as any
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="h-[93vh] p-3 bg-neutral border-none text-neutral-content ">
      {/* <h2>Score:50</h2> */}
      <div className="flex flex-col  h-[85vh] overflow-y-scroll">
        <form onSubmit={handleSubmit}>
          {quizData.question.map((q: any) => {
            return (
              <AnswerQuestionCard
                onValueChange={handleSelectAnswer}
                key={q.question_id}
                question={q}
                options={q.options}
              />
            );
          })}

          <Button
            type="submit"
            className="bg-yellow-500 mb-3 hover:bg-yellow-500 w-full  text-white"
          >
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
};

export default AttemptQuiz;

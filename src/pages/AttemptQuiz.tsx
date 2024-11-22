import React, { useEffect, useState } from "react";
import AttemptCard from "../components/AttemptCard";
import QuestionCard from "../components/QuestionCard";
import { useParams } from "react-router-dom";
import quizServices from "@/services/quizServices";
import AnswerQuestionCard from "@/components/AnswerQuestionCard";

const AttemptQuiz: React.FC = () => {
  const { quizId } = useParams<any>();

  const [questions, setQuestions] = useState<any>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      const data = await quizServices.getQuiz(quizId as string);
      setQuestions(data.question);
    };
    fetchQuiz();
  }, []);

  return (
    <section className="h-[93vh] p-3 bg-neutral border-none text-neutral-content ">
      {/* <h2>Score:50</h2> */}
      <div className="flex flex-col  h-[85vh] overflow-y-scroll">
        {questions.map((q: any) => {
          return (
            <AnswerQuestionCard
              key={q.question_id}
              question={q.content}
              options={q.options}
            />
          );
        })}
      </div>
    </section>
  );
};

export default AttemptQuiz;

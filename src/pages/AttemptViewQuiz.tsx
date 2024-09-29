import React from "react";
import AttemptCard from "../components/AttemptCard";
import QuestionCard from "../components/QuestionCard";

const AttemptViewQuiz: React.FC = () => {
  return (
    <section className="h-[93vh] p-3 bg-neutral border-none text-neutral-content ">
      <h2>Score:50</h2>
      <div className="flex flex-col  h-[85vh] overflow-y-scroll">
        <QuestionCard />
        <QuestionCard />
        <QuestionCard />
        <QuestionCard />
        <QuestionCard />
      </div>
    </section>
  );
};

export default AttemptViewQuiz;

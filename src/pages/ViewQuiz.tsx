import React from "react";
import AttemptCard from "../components/AttemptCard";

const ViewQuiz: React.FC = () => {
  return (
    <section className="px-3 flex flex-col bg-neutral text-neutral-content h-[87vh] ">
      <div className="flex flex-col mb-3">
        <h1 className="mb-1">Notes</h1>
        <div className="card bg-neutral text-neutral-content w-96">
          <div className="card-body items-center text-center">
            <p>*Summarization</p>
          </div>
        </div>
      </div>

      <div className="flex mb-3">
        <button className="mb-2 mr-1 btn flex-1 btn-warning ">Take Quiz</button>
        <button className="btn flex-1 ml-1 btn-info">Study Mode</button>
      </div>

      <div className="mb-3 flex p-1 gap-1 w-full h-14 rounded-lg bg-base-content">
        <button className="text-white flex-1 btn bg-base-content border-none">
          Questions
        </button>
        <button className="text-black flex-1 btn btn-accent border-none">
          Attempts
        </button>
      </div>

      <div className="flex flex-col  h-[55vh] overflow-y-scroll">
        <AttemptCard />
      </div>
    </section>
  );
};

export default ViewQuiz;

import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";
import React from "react";

const Quiz: React.FC = () => {
  return (
    <section className="flex px-3 gap-3 flex-col h-screen overflow-y-scroll">
      <label className="input input-bordered flex items-center gap-2">
        <input type="text" className="grow" placeholder="Search" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      <button className="btn btn-warning">Generate Quiz</button>

      <div
        className="flex p-1 gap-1 
"
      >
        <button className="btn flex-1 bg-base-300">Quizzes</button>
        <button className="btn flex-1  bg-base-100">Attempted</button>
      </div>
      <div className="flex flex-col">
        <div className="btn btn-neutral h-16 flex flex-row justify-between text-neutral-content w-96">
          <h2 className="card-title">Lorem</h2>
          <h2 className="card-title">5/10</h2>
        </div>
      </div>
    </section>
  );
};

export default Quiz;

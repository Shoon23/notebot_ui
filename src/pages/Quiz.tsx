import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";
import React from "react";
import SearchInput from "../components/SearchInput";

const Quiz: React.FC = () => {
  return (
    <section className="flex px-3 flex-col h-screen overflow-y-scroll bg-neutral py-3">
      <SearchInput />
      <button className="mb-3 btn btn-warning">Generate Quiz</button>
      <div className="mb-3 flex p-1 gap-1 w-full h-14 rounded-lg bg-base-content">
        <button className="text-black flex-1 btn btn-accent border-none">
          Quizzes
        </button>
        <button className="text-white flex-1 btn bg-base-content border-none">
          Attempts
        </button>
      </div>
      <div className="flex flex-col">
        <div className="btn btn-neutral bg-base-content h-16 flex flex-row justify-between text-neutral-content ">
          <h2 className="card-title">Lorem</h2>
          <h2 className="card-title">5/10</h2>
        </div>
      </div>
    </section>
  );
};

export default Quiz;

import React from "react";

const ViewQuiz = () => {
  return (
    <section className="px-3 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h1>Notes</h1>
        <div className="card bg-neutral text-neutral-content w-96">
          <div className="card-body items-center text-center">
            <p>*Summarization</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 ">
        <button className="btn flex-1 btn-warning ">Take Quiz</button>
        <button className="btn flex-1 btn-info">Study Mode</button>
      </div>
      <div className="flex gap-2 mt-5">
        <button className="btn flex-1 btn-active btn-outline">Questions</button>
        <button className="btn flex-1 btn-outline">Attempts</button>
      </div>
      <div className="flex flex-col">
        <div className="card bg-neutral text-neutral-content w-96">
          <div className="card-body">
            <h2 className="font-bold">
              1. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Temporibus quas corrupti tenetur saepe harum repudiandae et
            </h2>
            <p>a. We are using cookies for no reason.</p>
            <p className=" bg-green-300 text-black p-2">
              b. We are using cookies for no reason.
            </p>
            <p>c. We are using cookies for no reason.</p>
            <p>d. We are using cookies for no reason.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewQuiz;

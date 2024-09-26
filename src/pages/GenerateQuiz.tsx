import React from "react";
import Input from "../components/Input";

const GenerateQuiz = () => {
  return (
    <section className="px-3">
      <form className="space-y-3">
        <Input type="text" placeholder="Quiz Name" />
        <select className="select select-bordered w-full">
          <option disabled selected>
            Notes
          </option>
        </select>
        <select className="select select-bordered w-full">
          <option disabled selected>
            Difficulty
          </option>
        </select>{" "}
        <select className="select select-bordered w-full">
          <option disabled selected>
            Question Type
          </option>
        </select>
        <select className="select select-bordered w-full">
          <option disabled selected>
            BLOOMS Level
          </option>
        </select>
        <button className="btn btn-warning w-full">Generate</button>
      </form>
    </section>
  );
};

export default GenerateQuiz;

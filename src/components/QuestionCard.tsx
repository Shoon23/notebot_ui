import React from "react";

const QuestionCard = () => {
  return (
    <div className="card bg-base-content text-neutral-content w-full mb-3">
      <div className="card-body">
        <h2 className="font-bold ">
          1. Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
          quas corrupti tenetur saepe harum repudiandae et
        </h2>
        <p>a. We are using cookies for no reason.</p>
        <p className=" bg-green-300 text-black p-2">
          b. We are using cookies for no reason.
        </p>
        <p>c. We are using cookies for no reason.</p>
        <p>d. We are using cookies for no reason.</p>
      </div>
    </div>
  );
};

export default QuestionCard;

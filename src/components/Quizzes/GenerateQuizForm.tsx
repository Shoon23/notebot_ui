import {
  IonButton,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import React from "react";
import "./generate-form.css";
import SelectOption from "../SelectOption/SelectOption";
import { fileTray, colorWand } from "ionicons/icons";
import ChooseNoteModal from "./ChooseNoteModal";

const GenerateQuizForm = () => {
  const quizType = [
    { value: "mcq", label: "Multiple Choice" },
    { value: "true-or-false", label: "True/False" },
    { value: "short-answer", label: "Short Answer" },
    { value: "essay", label: "Essay" },
  ];

  const bloomsLevel = [
    { value: "evaluating", label: "Evaluating" },
    { value: "remembering", label: "Remembering" },
    { value: "understanding", label: "Understanding" },
    { value: "applying", label: "Applying" },
    { value: "analyzing", label: "Analyzing" },
  ];
  const difficultyLevels = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  const numbers = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "15", label: "15" },
  ];

  return (
    <form
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: "80px",
          marginBottom: "12px",
        }}
      >
        <p
          style={{
            marginBottom: "5px",
          }}
        >
          Quiz Name
        </p>

        <input
          type="text"
          className="input-box"
          placeholder="Enter Quiz Name"
        />
      </div>

      <SelectOption label="Quiz Type" options={quizType} />
      <SelectOption label="Blooms Level" options={bloomsLevel} />
      <SelectOption label="Difficulty" options={difficultyLevels} />
      <SelectOption label="Number Of Question" options={numbers} />

      <ChooseNoteModal />
      <div
        style={{
          marginTop: "15px",
        }}
      >
        <div
          style={{
            marginBottom: "5px",
          }}
        >
          Desciption
        </div>
        <textarea
          rows={10}
          placeholder="Enter description here..."
          className="quiz-description-input"
        />
      </div>

      <button type="button" className="quiz-gen-generate-btn">
        Generate
        <IonIcon icon={colorWand}></IonIcon>
      </button>
    </form>
  );
};

export default GenerateQuizForm;

import { QuestionWithOptions } from "@/repository/QuizRepository";
import { hexToRgb } from "@/utils";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonIcon,
  IonCardContent,
} from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import React, { useState } from "react";
import TextAreaInput from "../GenerateQuiz/TextAreaInput";
import Rubrics from "../Rubrics/Rubrics";
import { Rubric } from "@/repository/EssayRepository";

interface QuestionCardEssayProps {
  question_answer: QuestionWithOptions;
  idx: number;
  handleOnChangeEssayAnswer: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  answer: string;
  totalWord: number;
  usedRubric: Rubric | null;
  setUsedRubric: React.Dispatch<React.SetStateAction<Rubric | null>>;
}
const QuestionCardEssay: React.FC<QuestionCardEssayProps> = ({
  question_answer,
  idx,
  handleOnChangeEssayAnswer,
  answer,
  totalWord,
  setUsedRubric,
  usedRubric,
}) => {
  const tempoColor = "#47926B";
  const shadowColors = hexToRgb(tempoColor);

  const cardsStyles = {
    flex: "0 0 auto",
    marginBottom: "10px",
    width: "98%", // Minimum width for the cards,
    minHeight: "150px", // Optional: Set a minimum height if needed
    borderRadius: "1.5rem",
    boxShadow: `${shadowColors[0]} 0px 0px 0px 4px, ${shadowColors[1]} 0px 4px 6px -2px, ${shadowColors[2]} 0px 1px 0px inset`,
  };
  return (
    <>
      <Rubrics usedRubric={usedRubric} setUsedRubric={setUsedRubric} />

      <IonCard style={cardsStyles}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              height: "100%",
            }}
          >
            <IonCardHeader
              style={{
                padding: "10px",
              }}
            >
              <IonCardTitle
                style={{
                  fontSize: "1rem", // Scaled for mobile readability
                  fontWeight: "bolder",
                }}
              >
                {idx + 1}. {question_answer.content}
              </IonCardTitle>
            </IonCardHeader>
          </div>
          <IonCardContent
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
              }}
            >
              Minimum Word: <span>100</span>
            </div>
            <div
              style={{
                fontWeight: "bold",
              }}
            >
              Maximum Word: <span style={{}}>650</span>
            </div>
            <br />
            <div className="">
              Total Word: <span>{totalWord}</span>
            </div>
            <TextAreaInput
              value={answer}
              handleOnChangeDescription={handleOnChangeEssayAnswer}
              rows={15}
              placeHolder={"Enter Answer Here"}
              label={"Answer"}
            />
          </IonCardContent>
        </div>
      </IonCard>
    </>
  );
};

export default QuestionCardEssay;

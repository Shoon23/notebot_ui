import React, { useEffect, useRef, useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCheckbox,
  IonIcon,
  IonButton,
  IonContent,
  IonPopover,
} from "@ionic/react";
import { iMCQQuestion, QuestionWithOptions } from "@/repository/QuizRepository";
import { capitlizedFirstLetter, hexToRgb } from "@/utils";
import "../../styles/quiz.css";
import { ellipsisVertical } from "ionicons/icons";
import MoreOptions from "./MoreOptions";

interface QuestionCardProps {
  question_answer: QuestionWithOptions;
  idx: number;
  onSelectionChange: (
    question: QuestionWithOptions,
    isChecked: boolean
  ) => void;
  isCheckBox: boolean;
  isSelected: boolean; // Controlled prop
  question_type: string;
  isSelectQuestion: boolean;
  setQuiz: React.Dispatch<React.SetStateAction<iMCQQuestion>>;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question_answer,
  idx,
  onSelectionChange,
  isCheckBox,
  isSelected,
  question_type,
  isSelectQuestion,
  setQuiz,
}) => {
  const tempoColor = "#47926B";
  const shadowColors = hexToRgb(tempoColor);

  // We no longer need a local state for checked;
  // instead, use the passed `selected` prop.
  const cardsStyles = {
    flex: "0 0 auto",
    marginBottom: "10px",
    width: "93%",
    minHeight: "150px",
    borderRadius: "1.5rem",
    boxShadow:
      isSelected &&
      `${shadowColors[0]} 0px 0px 0px 4px, ${shadowColors[1]} 0px 4px 6px -2px, ${shadowColors[2]} 0px 1px 0px inset`,
    display: "flex",
  };
  // When the card is clicked, toggle the parent's state.
  const handleCardClick = () => {
    if (!isCheckBox) return;
    onSelectionChange(question_answer, !isSelected);
  };

  return (
    <IonCard style={cardsStyles} type="button" onClick={handleCardClick}>
      {isCheckBox && (
        <IonCheckbox
          style={{
            alignSelf: "center",
            margin: "5px",
          }}
          checked={isSelected}
          onIonChange={(e) =>
            onSelectionChange(question_answer, e.detail.checked)
          }
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
          <IonCardHeader
            style={{
              flex: 1, // Allow this element to take all remaining space
              padding: "10px",
              paddingRight: "0",
            }}
          >
            <IonCardTitle style={{ fontSize: "1rem", fontWeight: "bolder" }}>
              {idx + 1}. {question_answer.content}
            </IonCardTitle>
          </IonCardHeader>
          {/* Pop Over */}
          {!isSelectQuestion && (
            <MoreOptions
              setQuiz={setQuiz}
              question_answer={question_answer}
              question_type={question_type}
            />
          )}
        </div>
        {question_answer.options && (
          <IonCardContent style={{ display: "flex", flexDirection: "column" }}>
            {question_answer.options.map((option, idx) => {
              if (option.is_answer) {
                return (
                  <div key={option.option_id}>
                    <div
                      style={{
                        fontSize: ".9rem",
                        fontWeight: "bold",
                        color: option.is_answer ? "green" : "black",
                        backgroundColor: option.is_answer
                          ? "#e8f5e9"
                          : "transparent",
                        padding: option.is_answer ? "5px" : "0",
                        borderRadius: option.is_answer ? "0.5rem" : "0",
                      }}
                    >
                      {capitlizedFirstLetter(option.content)}
                    </div>
                    <br />
                    {option.explanation && (
                      <>
                        <p>Explanation:</p>
                        <span
                          style={{
                            fontSize: ".9rem",
                            fontWeight: "bold",
                            color: option.is_answer ? "green" : "black",
                            padding: option.is_answer ? "5px" : "0",
                            borderRadius: option.is_answer ? "0.5rem" : "0",
                          }}
                        >
                          {option.explanation}
                        </span>
                      </>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </IonCardContent>
        )}
      </div>
    </IonCard>
  );
};

export default QuestionCard;

import React, { useEffect } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCheckbox,
} from "@ionic/react";
import { QuestionWithOptions } from "@/repository/QuizRepository";
import { hexToRgb } from "@/utils";
import "../../styles/quiz.css";

interface QuestionCardProps {
  question_answer: QuestionWithOptions;
  idx: number;
  onSelectionChange: (
    question: QuestionWithOptions,
    isChecked: boolean
  ) => void;
  isCheckBox: boolean;
  selected: boolean; // Controlled prop
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question_answer,
  idx,
  onSelectionChange,
  isCheckBox,
  selected,
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
      selected &&
      `${shadowColors[0]} 0px 0px 0px 4px, ${shadowColors[1]} 0px 4px 6px -2px, ${shadowColors[2]} 0px 1px 0px inset`,
    display: "flex",
  };

  // When the card is clicked, toggle the parent's state.
  const handleCardClick = () => {
    if (!isCheckBox) return;
    onSelectionChange(question_answer, !selected);
  };

  return (
    <IonCard style={cardsStyles} type="button" onClick={handleCardClick}>
      {isCheckBox && (
        <IonCheckbox
          style={{
            alignSelf: "center",
            margin: "5px",
          }}
          // Use the controlled prop for checked state
          checked={selected}
          onIonChange={(e) =>
            onSelectionChange(question_answer, e.detail.checked)
          }
          // Prevent the checkbox's own click from triggering the card click event
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: "100%" }}>
          <IonCardHeader style={{ padding: "10px" }}>
            <IonCardTitle style={{ fontSize: "1rem", fontWeight: "bolder" }}>
              {idx + 1}. {question_answer.content}
            </IonCardTitle>
          </IonCardHeader>
        </div>
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
                    {option.content}
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
      </div>
    </IonCard>
  );
};

export default QuestionCard;

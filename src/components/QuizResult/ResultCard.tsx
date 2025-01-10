import { iQuizResult } from "@/repository/AttemptQuizRepository";
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
import React from "react";

interface ResultCardProps {
  question_answer: iQuizResult;
  idx: number;
}
const ResultCard: React.FC<ResultCardProps> = ({ question_answer, idx }) => {
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
              {idx + 1}. {question_answer.question}
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
              fontSize: ".9rem", // Scaled for mobile readability
              fontWeight: "bold",
              color: question_answer.is_correct ? "green" : "red", // Highlight correct answer
              backgroundColor: question_answer.is_correct
                ? "#e8f5e9"
                : "#f8d7dat", // Light green background for correct answer
              padding: "5px",
              borderRadius: "0.5rem", // Rounded corners for correct answer
            }}
            key={idx}
          >
            {question_answer?.answer ||
              String(question_answer.is_correct).charAt(0).toUpperCase() +
                String(question_answer.is_correct).slice(1)}
          </div>
          <br />
          {/* {option.explanation && (
                    <>
                      <p>Explanation:</p>
                      <span
                        style={{
                          fontSize: ".9rem", // Scaled for mobile readability
                          fontWeight: "bold",
                          color: option.is_answer ? "green" : "black", // Highlight correct answer
                          padding: option.is_answer ? "5px" : "0", // Add padding for better visibility
                          borderRadius: option.is_answer ? "0.5rem" : "0", // Rounded corners for correct answer
                        }}
                      >
                        {option.explanation}
                      </span>
                    </>
                  )} */}
        </IonCardContent>
      </div>
    </IonCard>
  );
};

export default ResultCard;

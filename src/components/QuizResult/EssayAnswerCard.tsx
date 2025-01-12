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
  question: string;
  answer: string;
}
const EssayAnswerCard: React.FC<ResultCardProps> = ({ question, answer }) => {
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
              {1}. {question}
            </IonCardTitle>
          </IonCardHeader>
        </div>
        <IonCardContent
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p>Answer:</p>

          <span
            style={{
              fontSize: ".9rem", // Scaled for mobile readability
              fontWeight: "bold",
              //   color: "green",
              //   backgroundColor: question_answer.is_correct
              //     ? "#e8f5e9"
              //     : "#f8d7dat", // Light green background for correct answer
              padding: "5px",
              borderRadius: "0.5rem", // Rounded corners for correct answer
            }}
          >
            {answer}
          </span>
          <br />
        </IonCardContent>
      </div>
    </IonCard>
  );
};

export default EssayAnswerCard;

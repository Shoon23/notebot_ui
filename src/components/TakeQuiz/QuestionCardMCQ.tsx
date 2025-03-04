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
  IonCheckbox,
  IonRadioGroup,
  IonRadio,
} from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import React from "react";
import "./style.css";
interface QuestionCardProps {
  question_answer: QuestionWithOptions;
  idx: number;
  handleSelectAnswer: (answer: any, question_type: string) => void;
}
const QuestionCardMCQ: React.FC<QuestionCardProps> = ({
  question_answer,
  idx,
  handleSelectAnswer,
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
  const compareWith = (
    o1: {
      content: string;
      question_id: number;
      question: string;
      option_id: string;
    },
    o2: {
      content: string;
      question_id: number;
      question: string;
      option_id: string;
    }
  ) => {
    return o1.option_id === o2.option_id;
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
          <IonRadioGroup
            compareWith={compareWith}
            onIonChange={(event) => {
              handleSelectAnswer(event.detail.value, "mcq");
            }}
          >
            {question_answer.options.map((option, idx) => {
              return (
                <IonRadio
                  key={option.option_id}
                  labelPlacement="end"
                  justify="start"
                  style={{
                    width: "100%",
                  }}
                  value={{
                    content: option.content,
                    question_id: question_answer.question_id,
                    option_id: option.option_id,
                    question: question_answer.content,
                  }}
                >
                  <div
                    style={{
                      fontSize: ".9rem", // Scaled for mobile readability
                      fontWeight: "bold",
                      wordBreak: "break-word", // Ensures text breaks at the container edge
                      whiteSpace: "normal", // Allows wrapping to the next line
                      marginBottom: "8px",
                    }}
                  >
                    {option.content}
                  </div>
                </IonRadio>
              );
            })}
          </IonRadioGroup>
        </IonCardContent>
      </div>
    </IonCard>
  );
};

export default QuestionCardMCQ;

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
  IonInput,
} from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import React from "react";
import "./style.css";
interface QuestionShortAnswerProps {
  question_answer: QuestionWithOptions;
  idx: number;
  handleOnChangeAnswer: (answer: any) => void;
  lastShortAnswerRef: React.MutableRefObject<{
    content: string;
    question: string;
    question_id: number;
  }>;
  value: String;
}
const QuestionShortAnswer: React.FC<QuestionShortAnswerProps> = ({
  question_answer,
  idx,
  handleOnChangeAnswer,
  lastShortAnswerRef,
  value,
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
        <IonInput
          value={value as string}
          onIonChange={(e) => {
            const newValue = e.detail.value; // Use detail.value for IonInput
            lastShortAnswerRef.current = {
              content: newValue as string,
              question: question_answer.content,
              question_id: question_answer.question_id,
            };

            handleOnChangeAnswer({
              content: newValue,
              question: question_answer.content,
              question_id: question_answer.question_id,
            });
          }}
          color={"tertiary"}
          style={{
            width: "90%",
            alignSelf: "center",
            marginTop: "5px",
            marginBottom: "5px",
            heigth: "90%",
          }}
          type="text"
          fill="solid"
          helperText="Enter a Answer Here"
        ></IonInput>
      </div>
    </IonCard>
  );
};

export default QuestionShortAnswer;

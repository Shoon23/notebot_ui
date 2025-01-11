import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import { formatDistance, formatDistanceToNow, parseISO } from "date-fns";

import { caretForwardOutline } from "ionicons/icons";
import { iAttemptQuiz } from "@/repository/AttemptQuizRepository";
import { formatDate } from "@/utils/date-utils";
import { iMCQQuestion } from "@/repository/QuizRepository";
import { capitlizedFirstLetter } from "@/utils";

interface QuizDetailCardProps {
  data: iMCQQuestion;
  shadowColor: string;
}
const questionTypes = {
  mcq: "Multiple Choice",
  "short-answer": "Short Answer",
  "true-or-false": "True or False",
  essay: "Essay",
};
const QuizDetailCard: React.FC<QuizDetailCardProps> = ({
  data,
  shadowColor,
}) => {
  const cardsStyles = {
    marginBottom: "20px",
    flex: "0 0 auto",
    width: "95%", // Minimum width for the cards,
    minHeight: "130px",
    border: "2px solid black",
    borderRadius: "1.5rem",
    boxShadow: `10px 10px 0px ${shadowColor}`, // Dynamic shadow color,
  };

  return (
    <IonCard style={cardsStyles}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // Ensures elements are spaced out vertically
          height: "100%",
          flexGrow: 1,
        }}
      >
        <div
          style={{
            marginLeft: 15,
            height: "100%",
          }}
        >
          <IonCardHeader
            style={
              {
                // paddingBottom: "10px",
              }
            }
          >
            <IonCardTitle
              style={{
                fontSize: "1.2rem", // Scaled for mobile readability
                fontWeight: "bold",
              }}
            >
              {data.quiz_name}
            </IonCardTitle>
            <IonCardSubtitle
              style={{
                fontSize: "0.9rem",
                color: "gray",
                marginTop: 5,
              }}
            >
              <div
                style={{
                  marginBottom: 4,
                }}
              >
                Blooms Level:{" "}
                {capitlizedFirstLetter(data.blooms_taxonomy_level)}
              </div>
              <div
                style={{
                  marginBottom: 4,
                }}
              >
                Quiz Type:{" "}
                {
                  questionTypes[
                    data.question_type as keyof typeof questionTypes
                  ]
                }
              </div>
              <div
                style={{
                  marginBottom: 4,
                }}
              >
                Difficulty: {capitlizedFirstLetter(data.difficulty)}
              </div>
            </IonCardSubtitle>
          </IonCardHeader>
        </div>
      </div>
    </IonCard>
  );
};

export default QuizDetailCard;

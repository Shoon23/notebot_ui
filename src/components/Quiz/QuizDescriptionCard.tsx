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

interface QuizDescriptionCardProps {
  description: string;
  shadowColor: string;
}
const QuizDescriptionCard: React.FC<QuizDescriptionCardProps> = ({
  description,
  shadowColor,
}) => {
  const cardsStyles = {
    flex: "0 0 auto",
    width: "95%", // Minimum width for the cards,
    minHeight: "130px",
    border: "2px solid black",
    borderRadius: "1.5rem",
    boxShadow: `10px 10px 0px ${shadowColor}`, // Dynamic shadow color,
    marginBottom: "20px",
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
                fontSize: "1rem", // Scaled for mobile readability
                fontWeight: "bold",
              }}
            >
              Description:
            </IonCardTitle>
            <IonCardSubtitle
              style={{
                fontSize: "0.9rem",
                color: "gray",
                marginTop: 5,
              }}
            >
              {description}
            </IonCardSubtitle>
          </IonCardHeader>
        </div>
      </div>
    </IonCard>
  );
};

export default QuizDescriptionCard;

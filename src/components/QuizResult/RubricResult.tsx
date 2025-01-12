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
import { capitlizedFirstLetter } from "@/utils";
const colors = [
  "#ECC56A",
  "#47926B",
  "#44819E",
  "#AC4830",
  "gray",
  "#D8A7C7",
  "#D98F56",
  "#7E5F92",
  "#8F7CC4",
  "#9E7C5E",
];

interface RubricResultProps {
  data: {
    content: number;
    critical_thinking: number;
    grammar_and_mechanics: number;
    organization: number;
    style_and_voice: number;
    thesis_statement: number;
  };
}

const RubricResult: React.FC<RubricResultProps> = ({ data }) => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  const shadowColor = colors[randomIndex];
  const cardsStyles = {
    flex: "0 0 auto",
    width: "95%", // Minimum width for the cards,
    minHeight: "130px",
    border: "2px solid black",
    borderRadius: "1.5rem",
    boxShadow: `10px 10px 0px ${shadowColor}`, // Dynamic shadow color,
    marginTop: "5px",
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
              Rubric Breakdown
            </IonCardTitle>
            <IonCardSubtitle
              style={{
                fontSize: "0.9rem",
                color: "gray",
                marginTop: 5,
              }}
            >
              {}
              {Object.entries(data).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    marginBottom: 2,
                  }}
                >
                  {`${capitlizedFirstLetter(key)}: ${value}/4`}
                </div>
              ))}
            </IonCardSubtitle>
          </IonCardHeader>
        </div>
      </div>
    </IonCard>
  );
};

export default RubricResult;

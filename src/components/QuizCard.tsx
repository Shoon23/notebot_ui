import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from "@ionic/react";

import { caretForwardOutline } from "ionicons/icons";
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

interface QuizCardProps {
  width?: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ width }) => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  const shadowColor = colors[randomIndex];

  const cardsStyles = {
    flex: "0 0 auto",
    width: width || "300px", // Minimum width for the cards,
    height: "130px",
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
          flexGrow: 1,
        }}
      >
        <div
          style={{
            marginLeft: 15,
          }}
        >
          <IonCardHeader>
            <IonCardTitle
              style={{
                fontSize: "1.2rem", // Scaled for mobile readability
                fontWeight: "bold",
              }}
            >
              Math - Algebra
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
                  marginBottom: 2,
                }}
              >
                Number of Questions: 20
              </div>
              <div
                style={{
                  marginBottom: 2,
                }}
              >
                Bloom's Level: Application
              </div>
              <div>Question Type: Multiple Choice</div>
            </IonCardSubtitle>
          </IonCardHeader>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 60,
          }}
        >
          <IonButton
            style={{
              height: "100%",
              width: 60,
            }}
            fill="clear"
            color={"dark"}
          >
            <IonIcon
              slot="icon-only"
              icon={caretForwardOutline}
              style={{
                fontSize: "35px", // Adjust the icon size
                cursor: "pointer",
              }}
            />
          </IonButton>
        </div>
      </div>
    </IonCard>
  );
};

export default QuizCard;

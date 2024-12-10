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
const colors = ["#ECC56A", "#47926B", "#44819E", "#AC4830", "gray"];

interface QuizCardProps {
  index: number;
}

const QuizCard: React.FC<QuizCardProps> = ({ index }) => {
  const shadowColor = colors[index % colors.length];

  const cardsStyles = {
    flex: "0 0 auto",
    width: "300px", // Minimum width for the cards,
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
          <IonCardHeader
            style={{
              paddingBottom: "10px",
            }}
          >
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
                marginTop: 1,
              }}
            >
              <div>Completed: 2 days</div>
              Score: 18/20
            </IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <p
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
              }}
            >
              Key points on derivatives...
            </p>
          </IonCardContent>
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

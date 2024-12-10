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

import { caretForwardOutline } from "ionicons/icons";
const colors = ["gray", "#47926B", "#ECC56A", "#AC4830", "#44819E"];

interface QuizCardProps {
  index: number;
}

const NoteCard: React.FC<QuizCardProps> = ({ index }) => {
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
          height: "100%",
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
              }}
            >
              Last View: 2 days
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p
              style={{
                fontSize: "0.85rem",
                wordWrap: "break-word",
                fontWeight: "600",
                overflowWrap: "break-word",
              }}
            >
              Key points on deriva...
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

export default NoteCard;

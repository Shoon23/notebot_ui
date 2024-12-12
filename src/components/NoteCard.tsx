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
const colors = [
  "gray",
  "#47926B",
  "#ECC56A",
  "#AC4830",
  "#44819E",
  "#D8A7C7",
  "#D98F56",
  "#7E5F92",
  "#8F7CC4",
  "#9E7C5E",
];

interface QuizCardProps {
  width?: string;
}

const NoteCard: React.FC<QuizCardProps> = ({ width }) => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  const shadowColor = colors[randomIndex];

  const cardsStyles = {
    flex: "0 0 auto",
    width: width || "300px",
    height: "150px",
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
                marginBottom: 0,
              }}
            >
              Math - Algebra
            </IonCardTitle>
            <IonCardSubtitle
              style={{
                marginTop: 0,
                fontSize: "0.9rem",
                color: "gray",
              }}
            >
              Last Viewed: 2 days
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p
              style={{
                width: "100%",
                fontSize: "0.85rem",
                fontWeight: "600",
                wordWrap: "break-word", // Ensures long words break correctly
                overflowWrap: "break-word", // Ensures proper breaking in newer standards
                whiteSpace: "normal", // Prevents text from staying on a single line
                lineBreak: "anywhere", // Allows breaking at any point for long words
              }}
            >
              Key points on derivatives is this and this and this this this
              sdjakjdksjk...
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

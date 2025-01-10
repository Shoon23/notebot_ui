import { IonCard, IonCardContent, IonIcon } from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import React, { useState } from "react";
import "../../theme/animation.css";
interface MoreButtonProps {
  color: string;
  handleMoreButton: React.MouseEventHandler<HTMLIonCardElement>; // Corrected event type
}

const MoreButton: React.FC<MoreButtonProps> = ({ color, handleMoreButton }) => {
  return (
    <IonCard
      onClick={handleMoreButton}
      button={true}
      style={{
        flex: "0 0 auto",
        height: "90px",
        border: "2px solid black",
        borderRadius: "1.5rem",
        boxShadow: `10px 10px 0px ${color}`, // Dynamic shadow color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "360px",
      }}
    >
      <IonCardContent
        style={{
          marginBottom: "5%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        More
        <IonIcon
          slot="end"
          style={{
            fontSize: "30px",
          }}
          icon={caretForwardOutline}
        ></IonIcon>
      </IonCardContent>
    </IonCard>
  );
};

export default MoreButton;

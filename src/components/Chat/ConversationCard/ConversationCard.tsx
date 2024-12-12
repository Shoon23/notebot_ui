import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonIcon,
  IonAvatar,
} from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import React from "react";
import "./style.css";
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
const ConversationCard = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  const shadowColor = colors[randomIndex];

  const cardsStyles = {
    flex: "0 0 auto",
    width: "370px", // Minimum width for the cards,
    height: "120px",
    border: `2px solid black`,
    borderRadius: "1.5rem",
    marginBottom: 18,
    "--shadow-color": shadowColor,
  };
  const customStyles = {};
  return (
    <div style={cardsStyles} className="conversation-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // Ensures elements are spaced out vertically
          height: "100%",
          flexGrow: 1,
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <div
          style={{
            // marginLeft: 15,
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              flex: 1,
            }}
          >
            <IonAvatar>
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
          </div>

          <IonCardHeader
            style={{
              width: "365px",
            }}
          >
            <IonCardTitle
              style={{
                fontSize: "1.25rem", // Scaled for mobile readability
                fontWeight: "bold",
              }}
            >
              Chat - 1
            </IonCardTitle>
            <IonCardSubtitle
              style={{
                fontSize: "0.9rem",
                color: "gray",
                marginBottom: 5,
              }}
            >
              <div style={{}}>mwa mwa mwa </div>
            </IonCardSubtitle>
          </IonCardHeader>
          <div>Yesterday</div>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;

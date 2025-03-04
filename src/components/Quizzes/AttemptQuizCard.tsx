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
import { truncateText } from "@/utils/text-utils";
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

interface AttemptQuizCardProps {
  data: iAttemptQuiz;
}

const AttemptQuizCard: React.FC<AttemptQuizCardProps> = ({ data }) => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  const shadowColor = colors[randomIndex];
  const router = useIonRouter();
  const cardsStyles = {
    flex: "0 0 auto",
    width: "95%",
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
            <IonCardSubtitle>{formatDate(data.created_at)}</IonCardSubtitle>
            <IonCardTitle
              style={{
                fontSize: "1.2rem", // Scaled for mobile readability
                fontWeight: "bold",
                marginTop: 3,
              }}
            >
              {truncateText(data.quiz_name, 20, 20)}
            </IonCardTitle>
            <IonCardSubtitle
              style={{
                fontSize: "0.9rem",
                color: "gray",
                marginTop: 3,
              }}
            >
              {data.question_type !== "essay" && (
                <div
                  style={{
                    marginBottom: 2,
                  }}
                >
                  Score: {data.score}/{data.max_score}
                </div>
              )}
              <div
                style={{
                  marginBottom: 2,
                }}
              >
                Question Type: {capitlizedFirstLetter(data.question_type)}
              </div>
              Blooms Level: {capitlizedFirstLetter(data.blooms_taxonomy_level)}
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
            onClick={() => {
              console.log(data.quiz_attempt_id);
              router.push(`/quiz-result/${data.quiz_attempt_id}`);
            }}
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

export default AttemptQuizCard;

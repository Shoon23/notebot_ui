import React, { useEffect, useState } from "react";
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
import { Scores } from "@/services/attemptQuizService";
import RubricCard from "../Rubrics/RubricCard";
import { Rubric } from "@/repository/EssayRepository";
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
  scores: Array<{
    criteria_name: string;
    score: string;
    max_score: number;
    break_down: number;
  }>;
}

const RubricResult: React.FC<RubricResultProps> = ({ scores }) => {
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

  useEffect(() => {}, []);
  return (
    <IonCard style={cardsStyles}>
      {/* <RubricCard
        usedRubrics={null}
        rubric={null}
        setRubrics={function (value: React.SetStateAction<Rubric[]>): void {
          throw new Error("Function not implemented.");
        }}
        setRubric={function (value: React.SetStateAction<Rubric | null>): void {
          throw new Error("Function not implemented.");
        }}
        rubrics={[]}
        isSingle={true}
      /> */}
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
              {scores.map((score, idx) => {
                return (
                  <div key={idx}>
                    <div
                      style={{
                        marginBottom: 2,
                        fontWeight: "bolder",
                        color: "black",
                      }}
                    >
                      {`${capitlizedFirstLetter(score.criteria_name)}: ${
                        score.score
                      }/${score.max_score}`}
                    </div>
                    <p
                      style={{
                        marginLeft: 5,
                        padding: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {score.break_down}
                    </p>
                  </div>
                );
              })}
            </IonCardSubtitle>
          </IonCardHeader>
        </div>
      </div>
    </IonCard>
  );
};

export default RubricResult;

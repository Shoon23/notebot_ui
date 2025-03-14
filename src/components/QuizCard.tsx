import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCheckbox,
  IonIcon,
  useIonRouter,
} from "@ionic/react";

import { caretForwardOutline } from "ionicons/icons";
import { iQuiz } from "@/repository/QuizRepository";
import { capitlizedFirstLetter } from "@/utils";
import { useHistory } from "react-router-dom";
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

interface QuizCardProps {
  width?: string;
  data: iQuiz;
  redirectQuiz: (quiz_id: number) => Promise<void>;
  isCheckBox?: boolean;
  isSelected?: boolean;
  handleSelectArchive: (quiz: iQuiz, isChecked: boolean) => void;
}
const questionTypes = {
  mcq: "Multiple Choice",
  "short-answer": "Short Answer",
  "true-or-false": "True or False",
  essay: "Essay",
};
const QuizCard: React.FC<QuizCardProps> = ({
  isCheckBox,
  width,
  data,
  redirectQuiz,
  isSelected,
  handleSelectArchive,
}) => {
  const [shadowColor, setShadowColor] = useState("");
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const shadowColor = colors[randomIndex];
    setShadowColor(shadowColor);
  }, []);

  const cardsStyles = {
    flex: "0 0 auto",
    width: width || "95%", // Minimum width for the cards,
    minHeight: "130px",
    border: "2px solid black",
    borderRadius: "1.5rem",
    boxShadow: `10px 10px 0px ${shadowColor}`, // Dynamic shadow color,
    display: "flex",
  };

  const handleCardClick = () => {
    if (!isCheckBox && isSelected === undefined) return;
    handleSelectArchive(data, !isSelected);
  };
  return (
    <IonCard style={cardsStyles} type="button" onClick={handleCardClick}>
      {isCheckBox && (
        <IonCheckbox
          style={{
            alignSelf: "center",
            margin: "5px",
          }}
          checked={isSelected}
          onIonChange={(e) => handleSelectArchive(data, e.detail.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      )}

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
              {truncateText(data.quiz_name, 20, 20)}
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
                Number of Questions: {data.num_questions}
              </div>
              <div
                style={{
                  marginBottom: 2,
                }}
              >
                Bloom's Level:
                {capitlizedFirstLetter(data.blooms_taxonomy_level)}
              </div>
              <div>
                Question Type:{" "}
                {capitlizedFirstLetter(
                  questionTypes[
                    data.question_type as keyof typeof questionTypes
                  ]
                )}
              </div>
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
            onClick={() => {
              redirectQuiz(data.quiz_id);
            }}
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

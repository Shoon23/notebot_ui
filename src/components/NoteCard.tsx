import React, { useState } from "react";
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
import { Note } from "@/databases/models/note";
import { formatDate } from "@/utils/date-utils";
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
  data: Note;
  isCheckBox: boolean;
  handleSelectArchive: (question: Note, isChecked: boolean) => void;
  isSelected: boolean;
  handleSelectNote: (note_data: { note_id: number; note_name: string }) => void;
}

const NoteCard: React.FC<QuizCardProps> = ({
  data,
  handleSelectNote,
  isCheckBox,
  isSelected,
  handleSelectArchive,
}) => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  const shadowColor = colors[randomIndex];
  const cardsStyles = {
    flex: "0 0 auto",
    width: "90%",
    height: "150px",
    border: "2px solid black",
    borderRadius: "1.5rem",
    boxShadow: `10px 10px 0px ${shadowColor}`, // Dynamic shadow color,
    display: "flex",
  };

  // When the card is clicked, toggle the parent's state.
  const handleCardClick = () => {
    if (!isCheckBox) return;
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
          flexGrow: 1,
          height: "100%",
        }}
      >
        <div
          style={{
            marginLeft: 10,
            width: "80%",
          }}
        >
          <IonCardHeader
            style={{
              paddingBottom: "5px",
              paddingRight: 0,
            }}
          >
            <span>
              {!data.is_archived
                ? ` Last Viewed:
              ${formatDate(data.last_viewed_at as string)}`
                : `Archived At: ${formatDate(data.archived_at as string)}`}
            </span>
            <IonCardTitle
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: 0,
                width: "80%",
              }}
            >
              {(data.note_name?.length as number) > 20
                ? data.note_name?.slice(0, 15) + "..." // Truncate to 30 characters and add ellipsis
                : data.note_name}
            </IonCardTitle>
            <IonCardSubtitle
              style={{
                marginTop: 0,
                fontSize: "0.9rem",
                color: "gray",
              }}
            ></IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent
            style={{
              marginTop: 0,
              paddingRight: 0,
              width: "100%",
            }}
          >
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
              {(data.content_text?.length as number) > 119
                ? data.content_text?.slice(0, 119) + "..." // Truncate to 30 characters and add ellipsis
                : data.content_text}
            </p>
          </IonCardContent>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "20%",
          }}
        >
          <IonButton
            style={{
              height: "100%",
              width: "20%",
            }}
            fill="clear"
            color={"dark"}
            onClick={() => {
              handleSelectNote({
                note_id: Number(data.note_id),
                note_name: data.note_name,
              });
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

export default NoteCard;

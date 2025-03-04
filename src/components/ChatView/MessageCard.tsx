import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonIcon,
  IonAvatar,
  useIonRouter,
} from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import React from "react";
import {
  iConversationWithNote,
  iMessage,
} from "@/repository/ConversationRepository";
import { formatDate } from "@/utils/date-utils";
import ReactMarkdown from "react-markdown";

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

interface MessageCardProps {
  data: iMessage;
  shadowColors: {
    personColor: string;
    botColor: string;
  };
}

const MessageCard: React.FC<MessageCardProps> = ({ data, shadowColors }) => {
  const router = useIonRouter();

  const cardsStyles = {
    flex: "0 0 auto",
    width: "auto", // Allow the width to adjust to the content
    minWidth: "60%", // Minimum width for the cards
    maxWidth: "95%", // Ensure it doesn't exceed the container width
    height: "auto", // Allow the height to adjust based on content
    border: `2px solid black`,
    borderRadius: "1.5rem",
    marginBottom: 18,
    boxShadow:
      data.sender_type === "BOT"
        ? `5px 5px 0px ${shadowColors.botColor}`
        : `5px 5px 0px ${shadowColors.personColor}`, // Dynamic shadow color
    padding: "10px", // Add some padding for better layout
    boxSizing: "border-box" as "border-box", // Include padding and border in element's total width/height
    alignSelf: data.sender_type === "BOT" ? "start" : "end",
  };

  return (
    <div style={cardsStyles}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "auto", // Let the content determine the height
          flexDirection: "column", // Stack the items vertically
          alignItems: "flex-start", // Align items to the left
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <IonCardSubtitle
            style={{
              fontSize: "0.9rem",
              color: "gray",
              marginBottom: 5,
              overflowWrap: "break-word", // Ensures the content breaks long words
            }}
          >
            <ReactMarkdown>{data.message_content}</ReactMarkdown>
          </IonCardSubtitle>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;

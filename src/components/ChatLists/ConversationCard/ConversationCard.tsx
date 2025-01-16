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
import "./style.css";
import { iConversationWithNote } from "@/repository/ConversationRepository";
import { formatDate } from "@/utils/date-utils";
import useStorageService from "@/hooks/useStorageService";
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

interface ConversationCardProps {
  data: iConversationWithNote;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ data }) => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  const shadowColor = colors[randomIndex];
  const router = useIonRouter();
  const storageServ = useStorageService();
  const cardsStyles = {
    flex: "0 0 auto",
    width: "95%", // Minimum width for the cards,
    height: "120px",
    border: `2px solid black`,
    borderRadius: "1.5rem",
    marginBottom: 18,
    "--shadow-color": shadowColor,
  };
  const customStyles = {};
  return (
    <div
      style={cardsStyles}
      className="conversation-card"
      onClick={async () => {
        await storageServ.conversationRepo.updateLastViewedAt(
          data.conversation_id
        );
        router.push(`/chat/${data.conversation_id}`, "forward");
      }}
    >
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
          {/* <div
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
          </div> */}

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
              {data.note_name}
            </IonCardTitle>
            <IonCardSubtitle
              style={{
                fontSize: "0.9rem",
                color: "gray",
                marginBottom: 5,
              }}
            >
              <div style={{}}>*last message</div>
            </IonCardSubtitle>
          </IonCardHeader>
          <div
            style={{
              flex: 1,
              whiteSpace: "nowrap", // Prevents wrapping
              textOverflow: "ellipsis", // Adds ellipsis if the text overflows
              fontSize: "0.9rem",
            }}
          >
            {formatDate(data.last_viewed_at)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;

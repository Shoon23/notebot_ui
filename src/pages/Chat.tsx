import SearchInput from "@/components/SearchInput/SearchInput";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import "../styles/chat.css";
import "../theme/animation.css";

import ConversationCard from "@/components/Chat/ConversationCard/ConversationCard";
const Chat = () => {
  return (
    <IonPage>
      <IonContent>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>Chat</IonTitle>
          </IonToolbar>
        </IonHeader>
        <section className="ion-padding">
          <SearchInput />
          <div
            style={{
              height: "650px",
              width: "100%",
              marginTop: "20px",
              overflow: "scroll",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {[...Array(10)].map((num, index) => {
              return <ConversationCard key={index} />;
            })}
            <br />
            <br />
            <br />
          </div>

          <IonFab
            className="generate-btn-container-chat animated-button"
            style={{
              position: "fixed",
              bottom: "100px",
              right: "20px",
              zIndex: "5px",
            }}
            slot="fixed"
            horizontal="end"
          >
            <IonIcon
              icon={addOutline}
              color="light"
              style={{
                fontSize: "24px",
              }}
            ></IonIcon>
          </IonFab>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Chat;

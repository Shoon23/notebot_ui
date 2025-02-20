import SearchInput from "@/components/SearchInput/SearchInput";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { addOutline, add } from "ionicons/icons";
import "../styles/chat.css";
import "../theme/animation.css";

import ConversationCard from "@/components/ChatLists/ConversationCard/ConversationCard";
import ChooseNoteModal from "@/components/ChooseNoteModal";
import NewChatModal from "@/components/ChatLists/NewChatButton";
import { useState } from "react";
import { iConversationWithNote } from "@/repository/ConversationRepository";
import useStorageService from "@/hooks/useStorageService";

const ChatLists = () => {
  const [conversations, setConversations] = useState<iConversationWithNote[]>(
    []
  );
  const storageServ = useStorageService();
  useIonViewWillEnter(() => {
    const fetchConversation = async () => {
      const conversations =
        await storageServ.conversationRepo.getConversationsWithNoteName({
          onlyNotArchived: true,
        });
      setConversations(conversations);
    };
    fetchConversation();
  }, []);
  return (
    <IonPage>
      <IonContent>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>Chat</IonTitle>
          </IonToolbar>
        </IonHeader>
        <section className="ion-padding">
          {/* <SearchInput /> */}
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
            {conversations.map((convo) => {
              return (
                <ConversationCard key={convo.conversation_id} data={convo} />
              );
            })}
            <br />
            <br />
            <br />
          </div>
          <NewChatModal />
        </section>
      </IonContent>
    </IonPage>
  );
};

export default ChatLists;

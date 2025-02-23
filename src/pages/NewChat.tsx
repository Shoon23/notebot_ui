import CreateChatButton from "@/components/ChatLists/CreateChatButton";
import ChooseNoteModal from "@/components/ChooseNoteModal";
import Input from "@/components/GenerateQuiz/Input";
import Header from "@/components/Header";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
} from "@ionic/react";
import React, { useState } from "react";

const NewChat = () => {
  const [chatForm, setChatForm] = useState<{
    chat_name: string;
    note_id: number;
  }>({
    chat_name: "",
    note_id: 0,
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatForm((prev) => ({
      ...prev,
      chat_name: e.target.value,
    }));
  };
  const [selectedNote, setSelectedNote] = useState<{
    note_name: string;
    note_content: string;
  }>({
    note_name: "",
    note_content: "",
  });

  return (
    <IonPage>
      <IonContent>
        <Header
          backRoute="/chats"
          nameComponent={
            <h1
              style={{
                alignSelf: "center",
                marginTop: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              New Chat
            </h1>
          }
        />
        <section className="ion-padding">
          <form action="">
            <Input
              value={chatForm.chat_name}
              handleOnChangeName={handleOnChange}
              placeHolder={"Enter Chat Name"}
              label={"Chat Name"}
            />
            <ChooseNoteModal
              setForms={setChatForm}
              setSelectedNote={setSelectedNote}
              selectedNote={selectedNote}
            ></ChooseNoteModal>
            <CreateChatButton chatForm={chatForm} />
          </form>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default NewChat;

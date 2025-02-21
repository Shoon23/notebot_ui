import {
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import NoteList from "../Note/NoteList/NoteList";
import { addOutline, add } from "ionicons/icons";
import Input from "../GenerateQuiz/Input";
import CreateChatButton from "./CreateChatButton";
import ChooseNoteModal from "../ChooseNoteModal";
import { Note } from "@/databases/models/note";
import useStorageService from "@/hooks/useStorageService";

const NewChatModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useIonRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const storageServ = useStorageService();

  useIonViewWillEnter(() => {
    const fethNotes = async () => {
      const notes = await storageServ.noteRepo.getListOfNotes({
        onlyWithContent: true,
        onlyWithoutConversation: true,
        onlyNotArchived: true,
      });
      setNotes(notes);
    };
    fethNotes();
  }, []);
  const handleSelectNote = async (note_data: {
    note_id: number;
    note_name: string;
  }) => {
    const id = await storageServ.conversationRepo.addConversation(
      note_data.note_id
    );

    router.push(`/chat/${id}`);
    setIsOpen(false);
  };
  return (
    <>
      <IonFab
        onClick={() => {
          // router.push("/new-chat", "forward");
          setIsOpen(true);
        }}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "20px",
          zIndex: "5px",
        }}
        slot="fixed"
        horizontal="end"
      >
        <IonFabButton className="generate-btn-container-note animated-button">
          <IonIcon
            icon={add}
            color="light"
            style={{
              fontSize: "24px",
            }}
          ></IonIcon>
        </IonFabButton>
      </IonFab>
      <IonModal
        isOpen={isOpen}
        initialBreakpoint={0.89}
        onWillDismiss={() => {
          setIsOpen(false);
        }}
        breakpoints={[0.89, 1]}
      >
        <IonContent className="ion-padding">
          <IonHeader class="ion-no-border">
            <IonToolbar>
              <IonTitle>Notes</IonTitle>
              <IonButtons slot="end">
                <IonButton color={"danger"} onClick={() => setIsOpen(false)}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <NoteList
            isShowAdd={false}
            buttonPosBottom="120px"
            notes={notes}
            handleSelectNote={handleSelectNote}
            isCheckBox={false}
            selectedNotes={[]}
            setSelectedNotes={function (
              value: React.SetStateAction<Note[]>
            ): void {
              throw new Error("Function not implemented.");
            }}
          />
        </IonContent>
      </IonModal>
    </>
  );
};

export default NewChatModal;

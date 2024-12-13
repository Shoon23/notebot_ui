import {
  IonButton,
  IonModal,
  IonContent,
  IonIcon,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import "./generate-form.css";
import { fileTray } from "ionicons/icons";
import NoteCard from "../NoteCard";
import NoteList from "../Note/NoteList/NoteList";
const ChooseNoteModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="quiz-gen-choose-note-btn"
      >
        Choose Note
        <IonIcon icon={fileTray}></IonIcon>
      </button>

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
          <NoteList buttonPosBottom="120px" />
        </IonContent>
      </IonModal>
    </>
  );
};

export default ChooseNoteModal;

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
import { fileTray } from "ionicons/icons";
import NoteCard from "./NoteCard";
import NoteList from "./Note/NoteList/NoteList";

interface CHooseNoteModalProps {
  children: React.ReactNode; // Use children prop
}

const ChooseNoteModal: React.FC<CHooseNoteModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const childrenWithOnClick = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement, {
        onClick: () => {
          setIsOpen(true);
        },
      })
    : children;
  return (
    <>
      {childrenWithOnClick}
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

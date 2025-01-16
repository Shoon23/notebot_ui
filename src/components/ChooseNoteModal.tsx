import {
  IonButton,
  IonModal,
  IonContent,
  IonIcon,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
  useIonLoading,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { fileTray } from "ionicons/icons";
import NoteCard from "./NoteCard";
import NoteList from "./Note/NoteList/NoteList";
import useStorageService from "@/hooks/useStorageService";
import { Note } from "@/databases/models/note";
import "../components/GenerateQuiz/generate-form.css";

interface CHooseNoteModalProps {
  // children: React.ReactNode; // Use children prop
  setForms: React.Dispatch<React.SetStateAction<any>>;
  setSelectedNote: React.Dispatch<
    React.SetStateAction<{
      note_name: string;
      note_content: string;
    }>
  >;
  selectedNote: {
    note_name: string;
    note_content: string;
  };
}

const ChooseNoteModal: React.FC<CHooseNoteModalProps> = ({
  // children,
  setForms,
  setSelectedNote,
  selectedNote,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const storageServ = useStorageService();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fethNotes = async () => {
      const notes = await storageServ.noteRepo.getListOfNotes({
        onlyWithContent: true,
      });
      setNotes(notes);
    };
    fethNotes();
  }, []);

  const handleSelectNote = async (note_data: {
    note_id: number;
    note_name: string;
  }) => {
    setForms((prev: any) => ({ ...prev, note_id: note_data.note_id }));

    const note = await storageServ.noteRepo.getNoteById(
      Number(note_data.note_id)
    );
    setSelectedNote({
      note_name: note_data.note_name,
      note_content: note.content_text,
    });
    setIsOpen(false);
  };
  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        type="button"
        className="quiz-gen-choose-note-btn"
      >
        {!selectedNote.note_name ? "Choose Note" : selectedNote.note_name}
        <IonIcon icon={fileTray}></IonIcon>
      </button>
      {/* {childrenWithOnClick} */}
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
          />
        </IonContent>
      </IonModal>
    </div>
  );
};

export default ChooseNoteModal;

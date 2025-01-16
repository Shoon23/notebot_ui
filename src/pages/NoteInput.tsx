import {
  IonAlert,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import "../styles/note-input.css";
import { chevronBack, colorWand, trashBin } from "ionicons/icons";
import useStorageService from "@/hooks/useStorageService";
import { iNote } from "@/repository/NoteRepository";

interface NoteInputProp
  extends RouteComponentProps<{
    id: string;
  }> {}
const NoteInput: React.FC<NoteInputProp> = ({ match }) => {
  const storageServ = useStorageService();
  const router = useIonRouter();
  const [note, setNote] = useState<iNote>({
    content_pdf_url: "",
    content_text: "",
    note_name: "",
    note_id: 0,
  });

  useIonViewWillEnter(() => {
    const id = Number(match.params.id); // Capture it here
    const fetchNote = async () => {
      const note = await storageServ.noteRepo.getNoteById(id);
      await storageServ.noteRepo.updateLastViewed(id);
      setNote({ ...note, note_id: id });
    };
    fetchNote();
  }, []);

  const handleOnChangeName = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value;

      setNote((prev) => ({
        ...prev,
        note_name: value,
      }));

      storageServ.noteRepo.updateNoteContent({
        note_name: value,
        note_id: Number(match.params.id),
        content_text: note.content_text,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnNoteContent = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    try {
      const value = e.target.value;
      setNote((prev) => ({
        ...prev,
        content_text: value,
      }));
      storageServ.noteRepo.updateNoteContent({
        content_text: value,
        note_id: parseInt(match.params.id, 10),
        note_name: note.note_name,
      });
    } catch (error: unknown) {
      console.log(error);
    }
  };
  return (
    <IonPage>
      <IonContent>
        <header className="notes-header">
          <button
            className="back-btn"
            onClick={() => {
              router.goBack();
            }}
          >
            <IonIcon
              icon={chevronBack}
              style={{
                fontSize: "30px",
              }}
            ></IonIcon>
            <span
              style={{
                fontSize: "20px",
              }}
            >
              Back
            </span>
          </button>

          <button id="alert-del-note" className="del-note-btn">
            <IonIcon
              icon={trashBin}
              style={{
                fontSize: "30px",
              }}
            ></IonIcon>
          </button>
          <IonAlert
            className="custom-alert"
            header="Do you want to delete this note?"
            trigger="alert-del-note"
            buttons={[
              {
                text: "Cancel",
                role: "cancel",
              },
              {
                cssClass: "alert-button-confirm",

                text: "Yes",
                role: "confirm",
                handler: async () => {
                  await storageServ.noteRepo.deleteNote(note.note_id);
                  router.push("/notes");
                },
              },
            ]}
            onDidDismiss={({ detail }) =>
              console.log(`Dismissed with role: ${detail.role}`)
            }
          ></IonAlert>
          {/* 
          <button className="gen-btn">
            <IonIcon
              icon={colorWand}
              style={{
                fontSize: "30px",
              }}
            ></IonIcon>
          </button> */}
        </header>
        <section
          style={{
            height: "94%",
          }}
        >
          <div className="note-name-container">
            <input
              onChange={handleOnChangeName}
              className="note-name-input"
              type="text"
              placeholder="Enter Note Name..."
              value={note.note_name}
            />
          </div>
          <textarea
            className="note-input"
            placeholder="Enter Here...."
            value={note.content_text}
            onChange={handleOnNoteContent}
          />
        </section>
      </IonContent>
    </IonPage>
  );
};

export default NoteInput;

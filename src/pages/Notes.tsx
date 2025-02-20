import NoteCard from "@/components/NoteCard";
import AttemptQuizCard from "@/components/Quizzes/AttemptQuizCard";
import QuizCard from "@/components/Quizzes/AttemptQuizCard";
import SearchInput from "@/components/SearchInput/SearchInput";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonHeader,
  IonIcon,
  IonLabel,
  IonModal,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  archive,
  caretDown,
  caretUp,
  chevronDown,
  createOutline,
  fileTray,
} from "ionicons/icons";
import { useContext, useEffect, useState } from "react";
import NoteList from "@/components/Note/NoteList/NoteList";
import { StorageServiceContext } from "@/App";
import { Note } from "@/databases/models/note";
import ArchiveList from "@/components/Note/ArchiveList";

const Notes = () => {
  const router = useIonRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [archives, setArchives] = useState<Note[]>([]);
  const storageServ = useContext(StorageServiceContext);

  useIonViewWillEnter(() => {
    const fetchNote = async () => {
      const noteList = await storageServ.noteRepo.getListOfNotes({
        onlyNotArchived: true,
      });
      setNotes(noteList);
    };

    const fetchArchive = async () => {
      const archiveList = await storageServ.noteRepo.getListOfNotes({
        onlyNotArchived: false,
      });

      setArchives(archiveList);
    };
    fetchNote();
    fetchArchive();
  }, []);

  const handleSelectNote = async (note_data: {
    note_id: number;
    note_name: string;
  }) => {
    router.push(`/note/${note_data.note_id}`);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isShowNote, setIShowNote] = useState(true);

  return (
    <IonPage>
      {/* Header */}
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle
            onClick={() => setIsOpen(true)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "1.6rem" }}>
              {isShowNote ? "Notes" : "Archives"}
            </span>
            <IonIcon
              style={{ marginLeft: "5px" }}
              icon={!isOpen ? caretDown : caretUp}
            />
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Main Content */}
      <IonContent>
        <section className="ion-padding">
          {isShowNote ? (
            <NoteList
              isShowAdd={true}
              notes={notes}
              handleSelectNote={handleSelectNote}
            />
          ) : (
            <ArchiveList
              notes={archives}
              handleSelectNote={function (note_data: {
                note_id: number;
                note_name: string;
              }): void {
                throw new Error("Function not implemented.");
              }}
            />
          )}
        </section>
      </IonContent>

      {/* Modal */}
      <IonModal
        isOpen={isOpen}
        initialBreakpoint={0.5}
        breakpoints={[0.5]}
        onWillDismiss={() => setIsOpen(false)}
      >
        <IonContent className="ion-padding">
          <IonHeader className="ion-no-border">
            <IonToolbar>
              <IonTitle>Notes</IonTitle>
              <IonButtons slot="end">
                <IonButton color="danger" onClick={() => setIsOpen(false)}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonButton
            expand="block"
            color="primary"
            fill="clear"
            onClick={() => {
              setIShowNote(true);
              setIsOpen(false);
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "start",
                justifyContent: "start",
                fontSize: "1.2rem",
                gap: 10,
              }}
            >
              <IonIcon slot="start" icon={fileTray} />
              Notes
            </div>
          </IonButton>
          <IonButton
            expand="block"
            color="danger"
            fill="clear"
            onClick={() => {
              setIShowNote(false);

              setIsOpen(false);
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "start",
                justifyContent: "start",
                fontSize: "1.2rem",
                gap: 10,
              }}
            >
              <IonIcon slot="start" icon={archive} />
              Archive
            </div>
          </IonButton>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Notes;

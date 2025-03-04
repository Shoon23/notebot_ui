import NoteCard from "@/components/NoteCard";
import AttemptQuizCard from "@/components/Quizzes/AttemptQuizCard";
import QuizCard from "@/components/Quizzes/AttemptQuizCard";
import SearchInput from "@/components/SearchInput/SearchInput";
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  archive,
  caretDown,
  caretUp,
  checkmarkDone,
  close,
  fileTray,
  archiveOutline,
} from "ionicons/icons";
import { SetStateAction, useContext, useEffect, useRef, useState } from "react";
import NoteList from "@/components/Note/NoteList/NoteList";
import { StorageServiceContext } from "@/App";
import { Note } from "@/databases/models/note";
import ArchiveList from "@/components/Note/ArchiveList";
import "../styles/note.css";
const Notes = () => {
  const router = useIonRouter();
  const [archives, setArchives] = useState<Note[]>([]);
  const storageServ = useContext(StorageServiceContext);
  const [notes, setNotes] = useState<Note[]>([]);
  const isInitComplete = useRef(false);

  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);
  const fetchArchive = async () => {
    const archiveList = await storageServ.noteRepo.getListOfNotes({
      onlyNotArchived: false,
    });
    setArchives(archiveList);
  };

  useIonViewWillEnter(() => {
    const initSubscription = storageServ.isInitCompleted.subscribe((value) => {
      isInitComplete.current = value;
      if (isInitComplete.current === true) {
        const fetchNote = async () => {
          const noteList = await storageServ.noteRepo.getListOfNotes({
            onlyNotArchived: true,
          });
          setNotes(noteList);
        };

        fetchNote();
        fetchArchive();
      }
    });

    return () => {
      initSubscription.unsubscribe();
    };
  }, [storageServ]);
  const handleSelectNote = async (note_data: {
    note_id: number;
    note_name: string;
  }) => {
    router.push(`/note/${note_data.note_id}`);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isShowNote, setIShowNote] = useState(true);
  const [isSelect, setIsSelect] = useState(false);
  const [isShowDelAlert, setIsShowDelAlert] = useState(false);
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
          <div
            slot="end"
            style={{
              marginRight: "8px",
            }}
          >
            {isSelect && (
              <>
                <button
                  disabled={selectedNotes.length === 0}
                  style={{
                    marginRight: "3px",
                  }}
                  className="del-note-btn"
                  onClick={() => {
                    setIsShowDelAlert(true);
                  }}
                >
                  <IonIcon icon={archiveOutline} style={{ fontSize: "30px" }} />
                </button>
                <IonAlert
                  isOpen={isShowDelAlert}
                  header="Do you want to ARCHIVE all this note?"
                  buttons={[
                    { text: "Cancel", role: "cancel" },
                    {
                      cssClass: "alert-button-confirm",
                      text: "Yes",
                      role: "confirm",
                      handler: async () => {
                        await storageServ.noteRepo.archiveRecordsManyNotes(
                          selectedNotes
                        );
                        setNotes((prevNotes) =>
                          prevNotes.filter(
                            (note) =>
                              !selectedNotes.some(
                                (selected) => selected.note_id === note.note_id
                              )
                          )
                        );
                        setIsSelect(false);

                        fetchArchive();
                        setSelectedNotes([]);
                      },
                    },
                  ]}
                  onDidDismiss={() => {
                    setIsShowDelAlert(false);

                    setIsSelect(false);
                  }}
                ></IonAlert>
              </>
            )}

            {isShowNote && (
              <button
                disabled={notes.length === 0}
                className="multi-sel-note-btn"
                onClick={() => {
                  setIsSelect(!isSelect);
                }}
              >
                <IonIcon
                  icon={!isSelect ? checkmarkDone : close}
                  style={{ fontSize: "30px" }}
                />
              </button>
            )}
          </div>

          {/* <IonButton></IonButton> */}
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
              isCheckBox={isSelect}
              selectedNotes={selectedNotes}
              setSelectedNotes={setSelectedNotes}
            />
          ) : (
            <ArchiveList
              notes={archives}
              handleSelectNote={function (note_data: {
                note_id: number;
                note_name: string;
              }): void {
                router.push(`/note-archive/${note_data.note_id}`);
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

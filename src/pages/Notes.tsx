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
import { useContext, useRef, useState } from "react";
import NoteList from "@/components/Note/NoteList/NoteList";
import { StorageServiceContext } from "@/App";
import { Note } from "@/databases/models/note";
import ArchiveList from "@/components/Note/ArchiveList";
import "../styles/note.css";
import StorageService from "@/services/storageService";
import { Directory, Filesystem } from "@capacitor/filesystem";
import pdfUrl from "../assets/default-rubrics.pdf";
async function saveDefaultRubricFile(storageServ: StorageService) {
  try {
    const rubrics = await storageServ.essayRepo.getRubrics();

    if (rubrics.length === 0) {
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch PDF file");
      }
      const blob = await response.blob();
      const fileName = "DefaultRubric.pdf";
      const base64Data = (await convertBlobToBase64(blob)) as string;
      const folderName = "Rubrics";
      const targetPath = `${folderName}/${fileName}`;
      await Filesystem.writeFile({
        path: targetPath,
        data: base64Data,
        directory: Directory.Data, // You can change this as needed
      });
      const rubricId = await storageServ.essayRepo.saveRubric(
        targetPath,
        fileName
      );
      await storageServ.essayRepo.updateRubricIsUsed(rubricId, true);
    }
  } catch (error) {
    console.log(error);
  }
}
const convertBlobToBase64 = (
  blob: Blob
): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
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
          saveDefaultRubricFile(storageServ);
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

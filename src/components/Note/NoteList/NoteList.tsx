import NoteCard from "@/components/NoteCard";
import SearchInput from "@/components/SearchInput/SearchInput";
import {
  IonAlert,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import {
  colorPalette,
  createOutline,
  globe,
  addCircle,
  cloudUpload,
} from "ionicons/icons";
import React, { useContext, useRef, useState } from "react";
import "./style.css";
import { Note } from "@/databases/models/note";
import StorageService from "@/services/storageService";
import useStorageService from "@/hooks/useStorageService";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { validateAndGetFileNote } from "@/utils/pick-file-utils";

interface NoteListProps {
  buttonPosBottom?: string;
  notes: Note[];
  handleSelectNote: (note_data: { note_id: number; note_name: string }) => void;
  isShowAdd: boolean;
  isCheckBox: boolean;
  selectedNotes: Note[];
  setSelectedNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

const NoteList: React.FC<NoteListProps> = ({
  buttonPosBottom,
  notes,
  handleSelectNote,
  isShowAdd,
  isCheckBox,
  selectedNotes,
  setSelectedNotes,
}) => {
  // Create a reference for the file input
  const storageServ = useStorageService();
  const router = useIonRouter();
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const pickAndSaveFile = async () => {
    try {
      const { files: pickedFiles } = await FilePicker.pickFiles({
        types: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        readData: true,
      });
      console.log(pickedFiles);

      const file = validateAndGetFileNote(pickedFiles);
      console.log("Validated file:", file);

      // If validation passes, move the file to the final location.
      const folderName = "Notes";
      const targetPath = `${folderName}/${file.name}`;

      // Write the file to the final (persistent) location in Directory.Data
      await Filesystem.writeFile({
        path: targetPath,
        data: file.data as string,
        directory: Directory.Data,
      });

      // Save the note record
      const noteId = await storageServ.noteRepo.saveNote({
        content_text: null,
        note_name: file.name,
        content_pdf_url: targetPath,
      });

      router.push(`/note/${noteId}`);
    } catch (error) {
      // If an error occurs, delete the temporary file (if it exists)

      console.error(error);
      setErrorMsg(((error as any).message as string) || "Something Went Wrong");
      setIsError(true);
    }
  };

  const handleAddNote = async () => {
    try {
      const noteId = await storageServ.noteRepo.saveNote({
        note_name: "untitled",
        content_pdf_url: null,
        content_text: null,
      });

      router.push(`/note/${noteId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectArchive = (question: Note, isChecked: boolean) => {
    setSelectedNotes((prev) => {
      // If checked, add the question; if unchecked, remove it.
      if (isChecked) {
        return [...prev, question];
      } else {
        return prev.filter((q) => q.note_id !== question.note_id);
      }
    });
  };
  return (
    <>
      {/* <SearchInput /> */}

      {notes.length !== 0 ? (
        <div
          style={{
            height: "650px",
            width: "100%",
            marginTop: "20px",
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
            scrollBehavior: "smooth", // Optional: for smooth scrolling
            alignItems: "center",
          }}
        >
          {notes.map((data, index) => {
            const isSelected = selectedNotes.some(
              (q) => q.note_id === data.note_id
            );

            return (
              <NoteCard
                isCheckBox={isCheckBox}
                key={index}
                data={data}
                handleSelectNote={handleSelectNote}
                handleSelectArchive={handleSelectArchive}
                isSelected={isSelected}
              />
            );
          })}
          <br />
          <br />
          <br />
        </div>
      ) : (
        <div
          style={{
            display: "flex",

            whiteSpace: "nowrap",
            scrollBehavior: "smooth", // Optional: for smooth scrolling
            flexDirection: "column",
            height: "650px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          No Notes
        </div>
      )}
      {isShowAdd && (
        <IonFab
          style={{
            position: "fixed",
            bottom: buttonPosBottom || "100px",
            right: "20px",
            zIndex: "5px",
          }}
          slot="fixed"
          horizontal="end"
        >
          <IonFabButton className="generate-btn-container-note animated-button">
            <IonIcon
              icon={createOutline}
              color="light"
              style={{
                fontSize: "24px",
              }}
            ></IonIcon>
          </IonFabButton>

          <IonFabList side="top">
            <IonFabButton
              style={{ zIndex: 1000 }}
              className="mini-btn animated-button"
              onClick={pickAndSaveFile}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IonIcon
                  color="light"
                  style={{
                    fontSize: "24px",
                  }}
                  icon={cloudUpload}
                ></IonIcon>
                <div>File</div>
              </div>
            </IonFabButton>
            <IonFabButton
              style={{ zIndex: 1000 }}
              className="mini-btn animated-button"
              onClick={handleAddNote}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IonIcon
                  color="light"
                  style={{
                    fontSize: "24px",
                  }}
                  icon={addCircle}
                ></IonIcon>

                <div>New</div>
              </div>
            </IonFabButton>
          </IonFabList>
        </IonFab>
      )}
      <IonAlert
        isOpen={isError}
        header={errorMsg}
        buttons={[{ text: "Okay", role: "cancel" }]}
        onDidDismiss={() => setIsError(false)}
      ></IonAlert>
    </>
  );
};

export default NoteList;

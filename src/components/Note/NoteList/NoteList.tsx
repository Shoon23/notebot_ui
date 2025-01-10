import NoteCard from "@/components/NoteCard";
import SearchInput from "@/components/SearchInput/SearchInput";
import {
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
import React, { useContext, useRef } from "react";
import "./style.css";
import { Note } from "@/databases/models/note";
import StorageService from "@/services/storageService";
import useStorageService from "@/hooks/useStorageService";
interface NoteListProps {
  buttonPosBottom?: string;
  notes: Note[];
  handleSelectNote: (note_data: { note_id: number; note_name: string }) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  buttonPosBottom,
  notes,
  handleSelectNote,
}) => {
  // Create a reference for the file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const storageServ = useStorageService();
  const router = useIonRouter();

  // Handle button click to trigger file input
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file change event (e.g., when a user selects a file)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Selected file:", files[0].name);
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
  return (
    <>
      <SearchInput />

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
            return (
              <NoteCard
                key={index}
                width="360px"
                data={data}
                handleSelectNote={handleSelectNote}
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
          {/* <IonFabButton
            style={{ zIndex: 1000 }}
            className="mini-btn animated-button"
            onClick={handleButtonClick}
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
          </IonFabButton> */}
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
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </IonFabList>
      </IonFab>
    </>
  );
};

export default NoteList;

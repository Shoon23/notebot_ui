import NoteCard from "@/components/NoteCard";
import SearchInput from "@/components/SearchInput/SearchInput";
import { IonFab, IonFabButton, IonFabList, IonIcon } from "@ionic/react";
import {
  colorPalette,
  createOutline,
  globe,
  addCircle,
  cloudUpload,
} from "ionicons/icons";
import React, { useRef } from "react";
import "./style.css";
interface NoteListProps {
  buttonPosBottom?: string;
}

const NoteList: React.FC<NoteListProps> = ({ buttonPosBottom }) => {
  // Create a reference for the file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle button click to trigger file input
  const handleButtonClick = () => {
    console.log("clicked");
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
  return (
    <>
      <SearchInput />
      <div
        style={{
          height: "650px",
          width: "100%",
          marginTop: "20px",
          overflow: "scroll",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {[...Array(10)].map((num, index) => {
          return <NoteCard key={index} width="360px" />;
        })}
        <br />
        <br />
        <br />
      </div>

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
          </IonFabButton>
          <IonFabButton
            style={{ zIndex: 1000 }}
            className="mini-btn animated-button"
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

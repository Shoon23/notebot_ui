import NoteCard from "@/components/NoteCard";
import SearchInput from "@/components/SearchInput/SearchInput";
import { IonFab, IonIcon } from "@ionic/react";
import { createOutline } from "ionicons/icons";
import React from "react";

interface NoteListProps {
  buttonPosBottom?: string;
}

const NoteList: React.FC<NoteListProps> = ({ buttonPosBottom }) => {
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
        className="generate-btn-container-note animated-button"
      >
        <IonIcon
          icon={createOutline}
          color="light"
          style={{
            fontSize: "24px",
          }}
        ></IonIcon>
      </IonFab>
    </>
  );
};

export default NoteList;

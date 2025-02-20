import NoteCard from "@/components/NoteCard";

import React from "react";
import { Note } from "@/databases/models/note";
import useStorageService from "@/hooks/useStorageService";

interface NoteListProps {
  notes: Note[];
  handleSelectNote: (note_data: { note_id: number; note_name: string }) => void;
}

const ArchiveList: React.FC<NoteListProps> = ({ notes, handleSelectNote }) => {
  // Create a reference for the file input
  const storageServ = useStorageService();

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
            return (
              <NoteCard
                key={index}
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
          No Archives
        </div>
      )}
    </>
  );
};

export default ArchiveList;

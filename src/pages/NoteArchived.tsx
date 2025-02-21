// Define the expected type for the patched function
interface PromiseWithResolvers<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

// Patch Promise.withResolvers if it's not already defined
if (typeof Promise.withResolvers !== "function") {
  Promise.withResolvers = function <T>(): PromiseWithResolvers<T> {
    let _resolve!: (value: T | PromiseLike<T>) => void;
    let _reject!: (reason?: any) => void;
    const promise: Promise<T> = new Promise<T>((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    return { promise, resolve: _resolve, reject: _reject };
  };
}

import {
  IonAlert,
  IonBackButton,
  IonButton,
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
import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import "../styles/note-input.css";
import {
  archive,
  chevronBack,
  colorWand,
  refresh,
  refreshCircle,
  refreshCircleOutline,
  text,
  trashBin,
} from "ionicons/icons";
import useStorageService from "@/hooks/useStorageService";
import { iNote } from "@/repository/NoteRepository";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "../styles/test.css";
import mammoth from "mammoth";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface NoteArchivedProp extends RouteComponentProps<{ id: string }> {}

const NoteArchived: React.FC<NoteArchivedProp> = ({ match }) => {
  const storageServ = useStorageService();
  const router = useIonRouter();

  const [note, setNote] = useState<iNote>({
    content_pdf_url: "",
    content_text: "",
    note_name: "",
    note_id: 0,
  });

  const [fileData, setFileData] = useState<{
    blob: Blob | null;
    type: "pdf" | "docx" | null;
  }>({ blob: null, type: null });

  const [numPages, setNumPages] = useState(0);
  const docxContainerRef = useRef<HTMLDivElement>(null);
  const [isShowDelete, setIsShowDelete] = useState(false);
  // Utility: Convert a Base64 string to an ArrayBuffer
  const base64ToArrayBuffer = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Utility: Extract file extension from a filename string
  const getFileExtension = (filename: string): string =>
    filename.lastIndexOf(".") !== -1
      ? filename.slice(filename.lastIndexOf(".") + 1)
      : "";

  useIonViewWillEnter(() => {
    const id = Number(match.params.id);

    console.log(id);
    const fetchNote = async () => {
      try {
        // Fetch the note and update the last viewed time.
        const fetchedNote = await storageServ.noteRepo.getNoteById(id);
        setNote({
          ...fetchedNote,
          note_id: id,
        });

        if (fetchedNote.content_pdf_url) {
          // Read file data from the filesystem
          const readResult = await Filesystem.readFile({
            path: fetchedNote.content_pdf_url,
            directory: Directory.Data,
          });

          // Determine the file extension and MIME type
          const fileExtension = getFileExtension(
            fetchedNote.note_name
          ).toLowerCase();
          const mimeType =
            fileExtension === "pdf"
              ? "application/pdf"
              : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

          // Create a Blob from the base64 data
          const blob = new Blob(
            [base64ToArrayBuffer(readResult.data as string)],
            {
              type: mimeType,
            }
          );

          // Update file data state
          setFileData({
            blob,
            type:
              fileExtension === "pdf"
                ? "pdf"
                : fileExtension === "docx"
                ? "docx"
                : null,
          });

          // If the file is a DOCX, convert it to HTML using Mammoth
          if (fileExtension === "docx") {
            try {
              const arrayBuffer = await new Response(blob).arrayBuffer();
              const result = await mammoth.convertToHtml(
                { arrayBuffer },
                {
                  includeDefaultStyleMap: true,
                  styleMap: [
                    "p[style-name='Heading1'] => h1:fresh",
                    "p[style-name='Heading2'] => h2:fresh",
                    "p[style-name='Heading3'] => h3:fresh",
                    "p[style-name='Normal'] => p",
                    "table => div.table-container > table",
                    "p[style-name='List Paragraph'] => li",
                  ],
                }
              );

              if (docxContainerRef.current) {
                // Set the converted HTML content
                docxContainerRef.current.innerHTML = result.value;
                // Optionally add extra styling to tables
                docxContainerRef.current
                  .querySelectorAll("table")
                  .forEach((table) => {
                    table.classList.add("table", "table-bordered");
                  });
              }

              // Log conversion warnings, if any.
              result.messages.forEach((message) => {
                console.warn(message);
              });
            } catch (conversionError) {
              console.error("Error converting DOCX:", conversionError);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    fetchNote();
  });

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <IonPage>
      <IonContent>
        <div
          style={{
            backgroundColor: "#ac4830",
            color: "white",
            padding: "10px",
            fontSize: "1.3rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          Archive
          <IonIcon icon={archive} style={{}}></IonIcon>
        </div>

        <header className="notes-header">
          <button className="back-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBack} style={{ fontSize: "30px" }} />
            <span style={{ fontSize: "20px" }}>Back</span>
          </button>

          <button
            className="refresh-note-btn"
            onClick={() => {
              setIsShowDelete(true);
            }}
          >
            <IonIcon icon={refresh} style={{ fontSize: "30px" }} />
          </button>
          <IonAlert
            isOpen={isShowDelete}
            header="Do you want to RESTORE this note?"
            buttons={[
              { text: "Cancel", role: "cancel" },
              {
                cssClass: "alert-button-confirm",
                text: "Yes",
                role: "confirm",
                handler: async () => {
                  await storageServ.noteRepo.unarchiveRecordsByNoteId(
                    note.note_id
                  );
                  router.push("/notes");
                },
              },
            ]}
            onDidDismiss={() => setIsShowDelete(false)}
          ></IonAlert>
        </header>
        <section style={{ height: "94%" }}>
          <div className="note-name-container">
            <input
              disabled={!!note.content_pdf_url}
              //   onChange={handleOnChangeName}
              readOnly
              className="note-name-input"
              type="text"
              placeholder="Enter Note Name..."
              value={note.note_name}
            />
          </div>
          {note.content_pdf_url ? (
            <>
              {/* PDF Renderer */}
              {fileData.type === "pdf" && fileData.blob && (
                <Document file={fileData.blob} onLoadSuccess={onLoadSuccess}>
                  {[...Array(numPages)].map((_, index) => (
                    <Page key={index} pageNumber={index + 1} scale={0.75} />
                  ))}
                </Document>
              )}

              {/* DOCX Renderer */}
              {fileData.type === "docx" && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    className="docx-container"
                    style={{
                      transform: "scale(0.5)",
                      transformOrigin: "top center",
                    }}
                  >
                    <div ref={docxContainerRef} className="docx-content" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <textarea
              readOnly
              className="note-input"
              placeholder="Enter Here...."
              value={note.content_text}
            />
          )}
        </section>
      </IonContent>
    </IonPage>
  );
};

export default NoteArchived;

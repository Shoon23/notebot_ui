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
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import "../styles/note-input.css";
import { add, archive, chevronBack, remove } from "ionicons/icons";
import useStorageService from "@/hooks/useStorageService";
import { iNote } from "@/repository/NoteRepository";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "../styles/test.css";
import mammoth from "mammoth";
import LazyPage from "@/components/LazyPage";

// Utility: Convert a Base64 string to an ArrayBuffer
export const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const getFileExtension = (filename: string): string =>
  filename.lastIndexOf(".") !== -1
    ? filename.slice(filename.lastIndexOf(".") + 1)
    : "";

interface NoteInputProp extends RouteComponentProps<{ id: string }> {}

const NoteInput: React.FC<NoteInputProp> = ({ match }) => {
  const storageServ = useStorageService();
  const router = useIonRouter();
  const [scale, setScale] = useState(0.5);
  const [defaultScale, setDefaultScale] = useState(1.0);

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
  const viewerRef = useRef<HTMLDivElement>(null);

  const [numPages, setNumPages] = useState(0);
  const docxContainerRef = useRef<HTMLDivElement>(null);
  // Ref for the container that will handle pinch gestures
  const [isShowDelete, setIsShowDelete] = useState(false);

  const [pdfDocument, setPdfDocument] = useState<any>(null);

  useIonViewWillEnter(() => {
    const id = Number(match.params.id);

    const fetchNote = async () => {
      try {
        // Fetch the note and update the last viewed time.
        const fetchedNote = await storageServ.noteRepo.getNoteById(id);
        await storageServ.noteRepo.updateLastViewed(id);
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

  // Zoom control buttons for non-touch adjustments
  const handleZoomIn = () =>
    setScale((prev) => parseFloat((prev + 0.1).toFixed(4)));

  const handleZoomOut = () =>
    setScale((prev) =>
      parseFloat(Math.max(prev - 0.1, defaultScale).toFixed(4))
    );

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
      console.error("Error updating note name:", error);
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
    } catch (error) {
      console.error("Error updating note content:", error);
    }
  };

  // Updated onLoadSuccess to capture the PDF document instance
  const onLoadSuccess = (pdf: any) => {
    setPdfDocument(pdf);
    setNumPages(pdf.numPages);
    pdf.getPage(1).then((page: any) => {
      const viewport = page.getViewport({ scale: 1 }); // natural dimensions
      if (viewerRef.current) {
        const containerWidth = viewerRef.current.clientWidth;
        const newScale = containerWidth / viewport.width;
        const roundedScale = parseFloat(newScale.toFixed(4));
        setDefaultScale(roundedScale);
        setScale(roundedScale);
      }
    });
  };

  console.log(scale);
  // Cleanup the PDF document when the component unmounts
  useEffect(() => {
    return () => {
      if (pdfDocument) {
        pdfDocument.destroy();
        setPdfDocument(null);
      }
    };
  }, [pdfDocument]);

  return (
    <IonPage>
      <IonContent>
        <header className="notes-header">
          <button className="back-btn" onClick={() => router.goBack()}>
            <IonIcon icon={chevronBack} style={{ fontSize: "30px" }} />
            <span style={{ fontSize: "20px" }}>Back</span>
          </button>

          <button
            className="del-note-btn"
            onClick={() => {
              setIsShowDelete(true);
            }}
          >
            <IonIcon icon={archive} style={{ fontSize: "30px" }} />
          </button>
          <IonAlert
            isOpen={isShowDelete}
            header="Do you want to ARCHIVE this note?"
            buttons={[
              { text: "Cancel", role: "cancel" },
              {
                cssClass: "alert-button-confirm",
                text: "Yes",
                role: "confirm",
                handler: async () => {
                  await storageServ.noteRepo.archiveRecordsByNoteId(
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
            {note.content_pdf_url ? (
              <div className="note-name-input">{note.note_name}</div>
            ) : (
              <div>
                <input
                  onChange={handleOnChangeName}
                  className="note-name-input"
                  type="text"
                  placeholder="Enter Note Name..."
                  value={note.note_name}
                />
              </div>
            )}
          </div>
          {note.content_pdf_url ? (
            <>
              {/* Zoom Controls */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <IonButton
                  onClick={handleZoomOut}
                  disabled={scale <= defaultScale}
                >
                  <IonIcon icon={remove} />
                </IonButton>
                <IonButton onClick={handleZoomIn}>
                  <IonIcon icon={add} />
                </IonButton>
              </div>
              {/* Viewer Container with pinch-to-zoom support */}
              <div
                ref={viewerRef}
                style={{
                  overflowX: "scroll",
                }}
              >
                {/* PDF Renderer */}
                {fileData.type === "pdf" && fileData.blob && (
                  <Document file={fileData.blob} onLoadSuccess={onLoadSuccess}>
                    {[...Array(numPages)].map((_, index) => (
                      <LazyPage
                        key={index}
                        pageNumber={index + 1}
                        scale={scale}
                      />
                    ))}
                  </Document>
                )}

                {/* DOCX Renderer */}
                {fileData.type === "docx" && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div
                      className="docx-container"
                      style={{
                        transform: `scale(${scale})`,
                        transformOrigin: "top center",
                      }}
                    >
                      <div ref={docxContainerRef} className="docx-content" />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <textarea
              className="note-input"
              placeholder="Enter Here...."
              value={note.content_text}
              onChange={handleOnNoteContent}
            />
          )}
        </section>
      </IonContent>
    </IonPage>
  );
};

export default NoteInput;

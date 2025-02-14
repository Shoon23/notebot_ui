import {
  IonPage,
  IonContent,
  IonButton,
  IonAlert,
  IonIcon,
} from "@ionic/react";
import { useState, useRef, useEffect } from "react";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "../styles/test.css";
import { chevronBack, trashBin } from "ionicons/icons";
import mammoth from "mammoth"; // Import Mammoth
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Test = () => {
  const [fileData, setFileData] = useState<{
    blob: Blob | null;
    type: "pdf" | "docx" | null;
  }>({ blob: null, type: null });

  const [numPages, setNumPages] = useState(0);
  const docxContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const convertDocxToHtml = async () => {
      if (!fileData.blob || fileData.type !== "docx") return;

      try {
        const arrayBuffer = await new Response(fileData.blob).arrayBuffer();

        // Convert DOCX to HTML while including the default style map
        // and adding custom mappings for headings, tables, lists, etc.
        const result = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            includeDefaultStyleMap: true,
            styleMap: [
              // Map DOCX headings to HTML headings
              "p[style-name='Heading1'] => h1:fresh",
              "p[style-name='Heading2'] => h2:fresh",
              "p[style-name='Heading3'] => h3:fresh",
              // Ensure normal paragraphs are rendered correctly
              "p[style-name='Normal'] => p",
              // Map tables – wrapping them in a div for responsive styling
              "table => div.table-container > table",
              // Map list items (if needed)
              "p[style-name='List Paragraph'] => li",
            ],
          }
        );

        if (docxContainerRef.current) {
          // Set the converted HTML into the container
          docxContainerRef.current.innerHTML = result.value;

          // Optionally, add extra classes for additional CSS styling
          docxContainerRef.current
            .querySelectorAll("table")
            .forEach((table) => {
              table.classList.add("table", "table-bordered");
            });
        }

        // Log any conversion warnings from Mammoth
        result.messages.forEach((message) => {
          console.warn(message);
        });
      } catch (error) {
        console.error("Error converting DOCX:", error);
      }
    };

    convertDocxToHtml();
  }, [fileData]);

  const pickAndSaveFile = async () => {
    try {
      const { files: pickedFiles } = await FilePicker.pickFiles({
        types: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        readData: true,
      });

      if (pickedFiles.length > 0) {
        const file = pickedFiles[0];
        const targetPath = `${Directory.Documents}/${file.name}`;

        // Save file locally
        await Filesystem.writeFile({
          path: targetPath,
          data: file.data as any,
          directory: Directory.Documents,
        });

        // Read file as Uint8Array
        const readResult = await Filesystem.readFile({
          path: targetPath,
          directory: Directory.Documents,
        });

        const blob = new Blob(
          [base64ToArrayBuffer(readResult.data as string)],
          {
            type: file.mimeType,
          }
        );

        setFileData({
          blob,
          type: file.mimeType?.includes("pdf") ? "pdf" : "docx",
        });
      }
    } catch (error) {
      console.error("File pick/save error:", error);
    }
  };

  // Utility function to convert base64 string to ArrayBuffer
  const base64ToArrayBuffer = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <IonPage>
      <IonContent>
        <header className="notes-header">
          <button className="back-btn">
            <IonIcon
              icon={chevronBack}
              style={{
                fontSize: "30px",
              }}
            ></IonIcon>
            <span
              style={{
                fontSize: "20px",
              }}
            >
              Back
            </span>
          </button>

          <button id="alert-del-note" className="del-note-btn">
            <IonIcon
              icon={trashBin}
              style={{
                fontSize: "30px",
              }}
            ></IonIcon>
          </button>
          <IonAlert
            className="custom-alert"
            header="Do you want to delete this note?"
            trigger="alert-del-note"
            buttons={[
              {
                text: "Cancel",
                role: "cancel",
              },
              {
                cssClass: "alert-button-confirm",
                text: "Yes",
                role: "confirm",
              },
            ]}
            onDidDismiss={({ detail }) =>
              console.log(`Dismissed with role: ${detail.role}`)
            }
          ></IonAlert>
        </header>
        <IonButton onClick={pickAndSaveFile}>Select Document</IonButton>

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
              style={{ transform: "scale(0.5)", transformOrigin: "top center" }}
            >
              <div ref={docxContainerRef} className="docx-content"></div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Test;

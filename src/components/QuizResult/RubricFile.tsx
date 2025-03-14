import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  add,
  checkmark,
  eyeOutline,
  remove,
  scale,
  trashBin,
  trashBinOutline,
} from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import "../Rubrics/rubric-card.css";
import { Rubric } from "@/repository/EssayRepository";
import useStorageService from "@/hooks/useStorageService";
import { pdfjs, Document, Page } from "react-pdf";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { base64ToArrayBuffer } from "@/pages/NoteInput";
import { truncateText } from "@/utils/text-utils";
import LazyPage from "../LazyPage";

interface RubricCardProps {
  rubric: Rubric | null;
}

const RubricFile: React.FC<RubricCardProps> = ({ rubric }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const storageServ = useStorageService();
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [fileData, setFileData] = useState<Blob | null>(null);
  const [scale, setScale] = useState(0.5);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [defaultScale, setDefaultScale] = useState(1);

  // Clean up PDF document when modal closes
  useEffect(() => {
    if (!isOpen && pdfDocument) {
      pdfDocument.destroy();
      setPdfDocument(null);
      setFileData(null);
      setNumPages(0);
    }
  }, [isOpen, pdfDocument]);

  const [numPages, setNumPages] = useState(0);

  const handleViewRubric = async () => {
    setIsOpen(!isOpen);
    const readResult = await Filesystem.readFile({
      path: rubric?.file_path as string,
      directory: Directory.Data,
    });
    // Create a Blob from the base64 data
    const blob = new Blob([base64ToArrayBuffer(readResult.data as string)], {
      type: "application/pdf",
    });

    setFileData(blob);
  };

  const onLoadSuccess = (pdf: any) => {
    setPdfDocument(pdf);
    setNumPages(pdf.numPages);
    pdf.getPage(1).then((page: any) => {
      const viewport = page.getViewport({ scale: 1 }); // natural dimensions
      if (viewerRef.current) {
        const containerWidth = viewerRef.current.clientWidth;
        const newScale = containerWidth / viewport.width;
        setDefaultScale(newScale);
        setScale(newScale);
      }
    });
  };
  // Zoom control buttons for non-touch adjustments
  const handleZoomIn = () => setScale((prev) => prev + 0.1);
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.1));

  return (
    <>
      <button
        className="rubric-card-btn"
        onClick={handleViewRubric}
        type="button"
        style={{
          width: "100%",
          fontSize: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "5px",
          height: "50px",
          padding: 10,
          marginBottom: "20px",
        }}
      >
        <div
          className=""
          style={{
            textAlign: "left", // This ensures the text starts at the left edge
            display: "flex",
            color: "black",
            height: "100%",
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          {rubric?.file_name && truncateText(rubric?.file_name, 15, 20)}
        </div>
      </button>
      <IonModal
        // initialBreakpoint={0.8}
        // breakpoints={[0.8]}
        isOpen={isOpen}
        onWillDismiss={() => setIsOpen(false)}
      >
        <IonContent className="ion-padding">
          <IonHeader className="ion-no-border">
            <IonToolbar>
              <IonButtons>
                <IonButton color="danger" onClick={() => setIsOpen(false)}>
                  Close
                </IonButton>
              </IonButtons>
              <IonTitle slot="end">Rubrics</IonTitle>
            </IonToolbar>
          </IonHeader>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <IonButton
              onClick={handleZoomOut}
              disabled={defaultScale === scale}
            >
              <IonIcon icon={remove} />
            </IonButton>
            <IonButton onClick={handleZoomIn}>
              <IonIcon icon={add} />
            </IonButton>
          </div>
          {isOpen && (
            <div
              ref={viewerRef}
              style={{
                overflowX: "scroll",
              }}
            >
              <Document file={fileData} onLoadSuccess={onLoadSuccess}>
                {[...Array(numPages)].map((_, index) => (
                  <LazyPage key={index} pageNumber={index + 1} scale={scale} />
                ))}
              </Document>
            </div>
          )}
        </IonContent>
      </IonModal>
    </>
  );
};

export default RubricFile;

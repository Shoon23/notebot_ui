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
  checkmark,
  eyeOutline,
  trashBin,
  trashBinOutline,
} from "ionicons/icons";
import React, { useState } from "react";
import "./rubric-card.css";
import { Rubric } from "@/repository/EssayRepository";
import useStorageService from "@/hooks/useStorageService";
import { pdfjs, Document, Page } from "react-pdf";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { base64ToArrayBuffer } from "@/pages/NoteInput";
import { truncateText } from "@/utils/text-utils";

interface RubricCardProps {
  usedRubrics: Rubric | null;
  rubric: Rubric | null;
  setRubrics: React.Dispatch<React.SetStateAction<Rubric[]>>;
  setRubric: React.Dispatch<React.SetStateAction<Rubric | null>>;
  rubrics: Rubric[];
  isSingle?: boolean;
  noDelete?: boolean;
}

const RubricCard: React.FC<RubricCardProps> = ({
  rubric,
  usedRubrics,
  rubrics,
  setRubric,
  setRubrics,
  isSingle = false,
  noDelete = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const storageServ = useStorageService();

  const [fileData, setFileData] = useState<Blob | null>(null);
  const handleUseRubric = async (e: any) => {
    e.stopPropagation();

    try {
      const oldUsedRubric = usedRubrics;

      if (oldUsedRubric) {
        await storageServ.essayRepo.updateRubricIsUsed(
          oldUsedRubric.rubric_id,
          false
        );
      }

      await storageServ.essayRepo.updateRubricIsUsed(
        rubric?.rubric_id as number,
        true
      );

      setRubric(rubric);

      setRubrics((prevRubrics) => {
        // Remove the new used rubric from the list
        let updatedList = prevRubrics.filter(
          (item) => item.rubric_id !== rubric?.rubric_id
        );

        // If there was an old used rubric, add it back into the list
        if (oldUsedRubric) {
          updatedList = [...updatedList, oldUsedRubric];
        }

        return updatedList;
      });
    } catch (error) {
      console.error(error);
    }
  };
  const [numPages, setNumPages] = useState(0);

  const handleDeleteRubric = async (e: any) => {
    try {
      await storageServ.essayRepo.deleteRubric(rubric?.rubric_id as number);

      setRubrics((prevRubrics) =>
        prevRubrics.filter((item) => item.rubric_id !== rubric?.rubric_id)
      );

      if (usedRubrics && usedRubrics.rubric_id === rubric?.rubric_id) {
        setRubric(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
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
          marginBottom: "20px",
          height: "104px",
          padding: 10,
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!isSingle && (
            <IonButton
              style={{
                padding: "0px",
              }}
              fill="clear"
              color={"success"}
              onClick={handleUseRubric}
            >
              <IonIcon icon={checkmark}></IonIcon>
            </IonButton>
          )}

          {/* <IonButton fill="clear" onClick={() => setIsOpen(!isOpen)}>
            <IonIcon icon={eyeOutline}></IonIcon>
          </IonButton> */}
          {noDelete !== true && (
            <IonButton
              fill="clear"
              color={"danger"}
              onClick={(e) => {
                e.stopPropagation();
                setIsDelete(true);
              }}
            >
              <IonIcon icon={trashBinOutline}></IonIcon>
            </IonButton>
          )}
        </div>
      </button>
      <IonAlert
        isOpen={isDelete}
        header="Do you want to DELETE this rubrics?"
        buttons={[
          { text: "Cancel", role: "cancel" },
          {
            cssClass: "alert-button-confirm",
            text: "Yes",
            role: "confirm",
            handler: handleDeleteRubric,
          },
        ]}
        onDidDismiss={() => setIsDelete(false)}
      ></IonAlert>
      <IonModal
        initialBreakpoint={0.8}
        breakpoints={[0.8]}
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

          {isOpen && (
            <Document file={fileData} onLoadSuccess={onLoadSuccess}>
              {[...Array(numPages)].map((_, index) => (
                <Page key={index} pageNumber={index + 1} scale={0.45} />
              ))}
            </Document>
          )}
        </IonContent>
      </IonModal>
    </>
  );
};

export default RubricCard;

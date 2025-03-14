import {
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonAlert,
  useIonViewWillEnter,
} from "@ionic/react";
import { fileTray, archive } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import RubricCard from "./RubricCard";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import useStorageService from "@/hooks/useStorageService";
import { Rubric } from "@/repository/EssayRepository";
import { validateAndGetFileRubrics } from "@/utils/pick-file-utils";
import { fireEvent } from "@testing-library/react";

interface RubricsProps {
  usedRubric: Rubric | null;
  setUsedRubric: React.Dispatch<React.SetStateAction<Rubric | null>>;
}

const Rubrics: React.FC<RubricsProps> = ({ setUsedRubric, usedRubric }) => {
  const [isOpenRubric, setisOpenRubric] = useState(false);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const storageServ = useStorageService();
  useEffect(() => {
    const getUsedRubrics = async () => {
      const rubrics = await storageServ.essayRepo.getRubrics();
      const usedRubricItem = rubrics.find((rubric) => rubric.is_used);
      const availableRubrics = rubrics.filter((rubric) => !rubric.is_used);

      setUsedRubric(usedRubricItem || null);
      setRubrics(availableRubrics);
    };
    getUsedRubrics();
  }, [usedRubric]);
  const pickAndSaveFile = async () => {
    try {
      const { files: pickedFiles } = await FilePicker.pickFiles({
        types: ["application/pdf"],
        readData: true,
      });
      const file = validateAndGetFileRubrics(pickedFiles);
      // Define a subfolder name within the app's data directory
      const folderName = "Rubrics";

      // Create the target path using the folder name and file name.
      const targetPath = `${folderName}/${file.name}`;

      // Save the file locally with proper base64 encoding
      await Filesystem.writeFile({
        path: targetPath,
        data: file.data as string, // Ensure file.data is a valid Base64 string
        directory: Directory.Data,
      });

      const rubricId = await storageServ.essayRepo.saveRubric(
        targetPath,
        file.name
      );

      setRubrics((prev) => [
        {
          file_name: file.name,
          file_path: targetPath,
          rubric_id: rubricId,
          is_used: false,
        },
        ...prev,
      ]);
    } catch (error) {
      setErrorMsg((error as any).message as string);
      setIsError(true);
    }
  };

  const handleOpenRurbic = async () => {
    try {
      setisOpenRubric(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button className="rubric-btn" type="button" onClick={handleOpenRurbic}>
        Rubrics
      </button>

      <IonModal
        isOpen={isOpenRubric}
        onWillDismiss={() => setisOpenRubric(false)}
      >
        <IonContent className="ion-padding">
          <IonHeader className="ion-no-border">
            <IonToolbar>
              <IonButtons>
                <IonButton
                  color="danger"
                  onClick={() => setisOpenRubric(false)}
                >
                  Close
                </IonButton>
              </IonButtons>
              <IonTitle slot="end">Rubrics</IonTitle>
            </IonToolbar>
          </IonHeader>
          <div className="" style={{}}>
            <div
              style={{
                fontSize: "1rem",
                marginBottom: "5px",
                color: "#47926b",
              }}
            >
              IN USE
            </div>

            {usedRubric ? (
              <RubricCard
                usedRubrics={usedRubric}
                rubric={usedRubric}
                setRubrics={setRubrics}
                setRubric={setUsedRubric}
                rubrics={rubrics}
                isSingle={true}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  // fontSize: "1.2rem",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No Rubrics In Used
              </div>
            )}
          </div>
          <div
            style={{
              marginTop: "10px",
              fontSize: "1rem",
              marginBottom: "5px",
            }}
          >
            RUBRICS
          </div>

          {rubrics.length !== 0 ? (
            <div
              className=""
              style={{
                height: "60%",
                overflowY: "scroll",
              }}
            >
              {rubrics.map((rubric) => {
                return (
                  <RubricCard
                    key={rubric.rubric_id}
                    usedRubrics={usedRubric}
                    rubric={rubric}
                    setRubrics={setRubrics}
                    setRubric={setUsedRubric}
                    rubrics={rubrics}
                  />
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "60%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              No Rubrics
            </div>
          )}

          <button
            className="add-rubric-btn"
            style={{
              marginTop: "5px",
            }}
            onClick={pickAndSaveFile}
          >
            Add
          </button>
        </IonContent>
      </IonModal>
      <IonAlert
        isOpen={isError}
        header={errorMsg}
        buttons={[{ text: "Okay", role: "cancel" }]}
        onDidDismiss={() => setIsError(false)}
      ></IonAlert>
    </>
  );
};

export default Rubrics;

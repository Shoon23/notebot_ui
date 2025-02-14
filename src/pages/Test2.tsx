import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
} from "@ionic/react";

const AndroidDocumentViewer: React.FC = () => {
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileType(file.type);
      const reader = new FileReader();
      reader.onload = (e) => {
        // For binary documents, this will be a data URL (e.g., "data:application/pdf;base64,...")
        setFileData(e.target?.result as string);
      };
      reader.onerror = (e) => {
        console.error("Error reading file:", e);
      };
      // Use readAsDataURL to get a base64-encoded representation
      reader.readAsDataURL(file);

      console.log(reader);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Android Document Viewer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>Choose Document</IonLabel>
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={onFileChange}
          />
        </IonItem>

        {fileData && (
          <>
            {fileType === "application/pdf" ? (
              // For PDFs, try displaying in an iframe (note: Android WebView may not support inline PDF viewing)
              <iframe
                src={fileData}
                title="Document Preview"
                width="100%"
                height="600px"
                style={{ border: "none" }}
              ></iframe>
            ) : fileType.startsWith("text/") ? (
              // For text files, display the text (you might use readAsText instead if preferred)
              <pre style={{ whiteSpace: "pre-wrap" }}>{fileData}</pre>
            ) : (
              <p>File loaded. Use a suitable viewer for this file type.</p>
            )}
          </>
        )}

        <IonButton
          expand="full"
          onClick={() => console.log("Ready to upload or process file")}
        >
          Next Step
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AndroidDocumentViewer;

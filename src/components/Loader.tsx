import React from "react";
import { IonButton, useIonLoading } from "@ionic/react";

interface LoaderProps {
  text: string;
}

const Loader: React.FC<LoaderProps> = ({ text }) => {
  const [present, dismiss] = useIonLoading();

  return (
    <IonButton
      onClick={() => {
        present({
          message: text,
          duration: 3000,
        });
      }}
    >
      Show Loading
    </IonButton>
  );
};

export default Loader;

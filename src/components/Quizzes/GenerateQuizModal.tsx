import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { sparklesOutline } from "ionicons/icons";
import React, { useRef } from "react";
import GenerateQuizForm from "./GenerateQuizForm";

const GenerateQuizModal = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  function confirm() {
    modal.current?.dismiss(input.current?.value, "confirm");
  }

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === "confirm") {
    }
  }

  //   user_id: z.string(),
  //   quiz_name: z.string(),
  //   note_id: z.string(),
  //   blooms_taxonomy_level: z.enum([
  // "evaluating",
  // "remembering",
  // "understanding",
  // "applying",
  // "analyzing",
  //     "create",
  //   ]),
  //   difficulty: z.enum(["easy", "medium", "hard"]),
  //   num_questions: z.number().min(1).max(15),
  //   description: z.string().optional(),
  return (
    <>
      <IonFab
        id="open-modal"
        style={{
          position: "fixed",
          bottom: "100px",
          right: "20px",
          zIndex: "5px",
        }}
        slot="fixed"
        horizontal="end"
        className="generate-btn-container animated-button"
      >
        <IonIcon
          icon={sparklesOutline}
          color="light"
          style={{
            fontSize: "24px",
          }}
        ></IonIcon>
      </IonFab>
      <IonModal
        ref={modal}
        trigger="open-modal"
        onWillDismiss={(ev) => onWillDismiss(ev)}
      >
        <IonContent className="ion-padding">
          <IonHeader className="ion-no-border">
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton
                  color="danger"
                  onClick={() => modal.current?.dismiss()}
                >
                  Cancel
                </IonButton>
              </IonButtons>
              <IonTitle
                slot="end"
                style={{
                  textAlign: "center",
                }}
              >
                Generate Quiz
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          <GenerateQuizForm />
        </IonContent>
      </IonModal>
    </>
  );
};

export default GenerateQuizModal;

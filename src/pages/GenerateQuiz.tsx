import GenerateQuizForm from "@/components/GenerateQuiz/GenerateQuizForm";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import React from "react";

const GenerateQuiz = () => {
  const router = useIonRouter();
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                color="danger"
                onClick={() =>
                  router.push("/quizzes/generated_quiz", "back", "pop")
                }
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
    </IonPage>
  );
};

export default GenerateQuiz;

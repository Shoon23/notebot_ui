import AttemptQuizCard from "@/components/Quizzes/AttemptQuizCard";
import QuizCard from "@/components/QuizCard";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import QuestionCard from "@/components/Quiz/QuestionCard";
interface QuizProp
  extends RouteComponentProps<{
    id: string;
  }> {}
const Quiz: React.FC<QuizProp> = ({ match }) => {
  console.log(match.params.id);
  return (
    <IonPage
      style={{
        height: "100%",
        overflow: "hidden",
      }}
    >
      <IonContent>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>Quiz Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <section
          className="ion-padding"
          style={{
            height: "80%",
          }}
        >
          <IonSegment
            mode="ios"
            style={{
              marginTop: "20px",
              height: "40px",
              boxShadow: "8px 8px 0px #ECC56A",
              border: "1.5px solid black",
            }}
            value="questions"
          >
            <IonSegmentButton value="questions" contentId="questions">
              <IonLabel>Questions</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="history" contentId="history">
              <IonLabel>History</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          <IonSegmentView>
            <IonSegmentContent
              id="questions"
              style={{
                height: "100%",
                width: "100%",
                marginTop: "20px",
                overflow: "scroll",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {[...Array(10)].map((num, index) => {
                return <QuestionCard key={index} />;
              })}
            </IonSegmentContent>
            <IonSegmentContent
              id="history"
              style={{
                height: "630px",
                width: "100%",
                marginTop: "20px",
                overflow: "scroll",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* {[...Array(10)].map((num, index) => {
                return <QuizCard key={index} width="360px" />;
              })} */}
            </IonSegmentContent>
          </IonSegmentView>

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <IonButton color={"tertiary"}>Take</IonButton>
          </div>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Quiz;

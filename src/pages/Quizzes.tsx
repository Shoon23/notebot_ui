import React, { useEffect, useState } from "react";
import quizServices from "@/services/quizServices";
import useUserSession from "@/hooks/useUserSession";
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonSegmentContent,
  IonSegmentView,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { iQuiz } from "@/types/quiz";
import { IonSearchbar } from "@ionic/react";
import { sparklesOutline, search } from "ionicons/icons";
import "../styles/quiz.css";
import "../theme/animation.css";
import QuizCard from "@/components/QuizCard";
import AttemptQuizCard from "@/components/Quizzes/AttemptQuizCard";
import SearchInput from "@/components/SearchInput/SearchInput";
import GenerateQuizModal from "@/components/Quizzes/GenerateQuizModal";

const Quizzes: React.FC = () => {
  const user = useUserSession();
  const [quiz, setQuiz] = useState<iQuiz[]>([]);
  const router = useIonRouter();
  // useEffect(() => {
  //   const fetchQuizzes = async () => {
  //     try {
  //       const res = await quizServices.getQuizzes(user.user_id as any);

  //       setQuiz(res);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchQuizzes();
  // }, []);
  return (
    <IonPage>
      <IonContent>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>Quiz</IonTitle>
          </IonToolbar>
        </IonHeader>
        <section className="ion-padding">
          {/* input */}
          <SearchInput />
          <IonSegment
            mode="ios"
            style={{
              marginTop: "20px",
              height: "40px",
              boxShadow: "8px 8px 0px #87ceeb",
              border: "1.5px solid black",
            }}
            value="generated_quiz"
          >
            <IonSegmentButton value="generated_quiz" contentId="generated_quiz">
              <IonLabel>Genrated Quiz</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="attempted_quiz" contentId="attempted_quiz">
              <IonLabel>Attempted Quiz</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          <IonSegmentView>
            <IonSegmentContent
              id="generated_quiz"
              style={{
                height: "600px",
                width: "100%",
                marginTop: "20px",
                overflow: "scroll",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {[...Array(10)].map((num, index) => {
                return <AttemptQuizCard key={index} width="360px" />;
              })}
              <br />
              <br />
            </IonSegmentContent>
            <IonSegmentContent
              id="attempted_quiz"
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
              {[...Array(10)].map((num, index) => {
                return <QuizCard key={index} width="360px" />;
              })}
              <br />
              <br />
            </IonSegmentContent>
          </IonSegmentView>

          <GenerateQuizModal />
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Quizzes;

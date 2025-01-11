import React, { useContext, useEffect, useRef, useState } from "react";
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
  useIonViewWillEnter,
} from "@ionic/react";
import { IonSearchbar } from "@ionic/react";
import { sparklesOutline, search, colorWand } from "ionicons/icons";
import "../styles/quiz.css";
import "../theme/animation.css";
import SearchInput from "@/components/SearchInput/SearchInput";
import GenerateQuizModal from "@/components/Quizzes/GenerateQuizModal";
import QuizCard from "@/components/QuizCard";
import AttemptQuizCard from "@/components/Quizzes/AttemptQuizCard";
import { StorageServiceContext } from "@/App";
import { iAttemptQuiz } from "@/repository/AttemptQuizRepository";
import { iQuiz } from "@/repository/QuizRepository";
import { RouteComponentProps } from "react-router-dom";

interface QuizzesProps
  extends RouteComponentProps<{
    window: string;
  }> {}

const Quizzes: React.FC<QuizzesProps> = ({ match }) => {
  const [attemptedQuiz, setAttemptedQuiz] = useState<iAttemptQuiz[]>([]);
  const [quiz, setQuiz] = useState<iQuiz[]>([]);
  const router = useIonRouter();
  const storageServ = useContext(StorageServiceContext);
  const [window, setWindow] = useState("generated_quiz");
  const isInitComplete = useRef(false);

  useIonViewWillEnter(() => {
    const initSubscription = storageServ.isInitCompleted.subscribe((value) => {
      isInitComplete.current = value;
      if (isInitComplete.current === true) {
        const fetchQuizAttempts = async () => {
          const quizAttemptList =
            await storageServ.attemptQuizRepo.getManyAttempts({
              is_recent: true,
            });
          setAttemptedQuiz(quizAttemptList);
        };
        const fetchQuiz = async () => {
          const quizList = await storageServ.quizRepo.getManyQuiz({
            is_recent: true,
            search_key_word: null,
          });
          setQuiz(quizList);
        };

        if (match.params.window) {
          setWindow(match.params.window);
        }

        fetchQuizAttempts();
        fetchQuiz();
      }
    });
    return () => {
      initSubscription.unsubscribe();
    };
  }, [storageServ]);

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
          {/* <SearchInput /> */}
          <IonSegment
            onIonChange={(e) => setWindow(e.detail.value as string)}
            mode="ios"
            style={{
              marginTop: "20px",
              height: "40px",
              boxShadow: "8px 8px 0px #87ceeb",
              border: "1.5px solid black",
            }}
            value={window}
          >
            <IonSegmentButton value="generated_quiz" contentId="generated_quiz">
              <IonLabel>Genrated Quiz</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="attempted_quiz" contentId="attempted_quiz">
              <IonLabel>Attempted Quiz</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          <div>
            {window === "generated_quiz" ? (
              <div
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
                {quiz.length !== 0 ? (
                  quiz.map((data, index) => (
                    <QuizCard key={index} width="360px" data={data} />
                  ))
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "630px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    No Quiz
                  </div>
                )}
              </div>
            ) : (
              <div
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
                {attemptedQuiz.length !== 0 ? (
                  attemptedQuiz.map((data) => (
                    <AttemptQuizCard
                      key={data.quiz_attempt_id}
                      width="360px"
                      data={data}
                    />
                  ))
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "630px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    No Attempted Quiz
                  </div>
                )}
              </div>
            )}
          </div>
          <IonFab
            style={{
              position: "fixed",
              bottom: "100px",
              right: "20px",
              zIndex: "5px",
            }}
            slot="fixed"
            horizontal="end"
            className="generate-btn-container animated-button"
            onClick={() => {
              router.push("/generate-quiz");
            }}
          >
            <IonIcon
              icon={colorWand}
              color="light"
              style={{
                fontSize: "24px",
              }}
            ></IonIcon>
          </IonFab>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Quizzes;

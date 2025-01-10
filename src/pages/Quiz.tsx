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
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import QuestionCard from "@/components/Quiz/QuestionCard";
import AttemptQuizCard from "@/components/Quizzes/AttemptQuizCard";
import useStorageService from "@/hooks/useStorageService";
import { iMCQQuestion, iQuiz } from "@/repository/QuizRepository";
import { iAttemptQuiz } from "@/repository/AttemptQuizRepository";
import Header from "@/components/Header";
interface QuizProp
  extends RouteComponentProps<{
    id: string;
  }> {}
const Quiz: React.FC<QuizProp> = ({ match }) => {
  const [quiz, setQuiz] = useState<iMCQQuestion>({
    quiz_name: "",
    question_type: "",
    blooms_taxonomy_level: "",
    difficultys: "",
    num_questions: 0,
    quiz_id: 0,
    questions: [],
  });
  const storageServ = useStorageService();
  const [attemptedQuiz, setAttemptedQuiz] = useState<iAttemptQuiz[]>([]);

  const router = useIonRouter();
  useIonViewWillEnter(() => {
    const fetchQuizData = async () => {
      try {
        const quiz_data = await storageServ.quizRepo.getQuizWithQuestions(
          match.params.id
        );
        fetchQuizAttemptHistory(quiz_data.quiz_id);
        setQuiz(quiz_data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchQuizAttemptHistory = async (quiz_id: number) => {
      try {
        const quizAttempt =
          await storageServ.attemptQuizRepo.getAttemptQuizHistorys({
            is_recent: true,
            quiz_id: quiz_id,
          });

        setAttemptedQuiz(quizAttempt);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuizData();
  }, []);
  return (
    <IonPage
      style={{
        height: "100%",
        overflow: "hidden",
      }}
    >
      <IonContent>
        <Header backRoute={"/quizzes/generated_quiz"} name="Quiz Details" />

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
                overflowY: "scroll",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {quiz.questions.map((question_answer, index) => {
                return (
                  <QuestionCard
                    key={question_answer.question_id}
                    question_answer={question_answer}
                    idx={index}
                  />
                );
              })}
            </IonSegmentContent>
            <IonSegmentContent id="history">
              {attemptedQuiz.length !== 0 ? (
                <div
                  style={{
                    height: "630px",
                    width: "100%",
                    marginTop: "20px",
                    overflowY: "scroll",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {attemptedQuiz.map((data, index) => {
                    return (
                      <AttemptQuizCard
                        key={data.quiz_attempt_id}
                        width="360px"
                        data={data}
                      />
                    );
                  })}
                </div>
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
                  No History
                </div>
              )}
            </IonSegmentContent>
          </IonSegmentView>

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <IonButton
              color={"tertiary"}
              onClick={() => {
                router.push(`/take-quiz/${String(quiz.quiz_id)}`);
              }}
            >
              Take
            </IonButton>
          </div>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Quiz;

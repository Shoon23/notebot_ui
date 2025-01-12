import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
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
import QuizDetailCard from "@/components/Quiz/QuizDetailCard";
import QuizDescriptionCard from "@/components/Quiz/QuizDescriptionCard";
import { createOutline } from "ionicons/icons";
import "../styles/quiz.css";
import EditQuizModal from "@/components/Quiz/EditQuizModal";
interface QuizProp
  extends RouteComponentProps<{
    id: string;
  }> {}
const Quiz: React.FC<QuizProp> = ({ match }) => {
  const [quiz, setQuiz] = useState<iMCQQuestion>({
    quiz_name: "",
    question_type: "",
    blooms_taxonomy_level: "",
    difficulty: "",
    description: "",
    num_questions: 0,
    quiz_id: 0,
    questions: [],
  });
  const storageServ = useStorageService();
  const [attemptedQuiz, setAttemptedQuiz] = useState<iAttemptQuiz[]>([]);
  const [window, setWindow] = useState("questions");
  const [isEdit, setIsEdit] = useState(false);

  const [shadowColor, setShadowColor] = useState("");
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
    setShadowColor(getShadowColors());
  }, []);

  return (
    <IonPage
      style={{
        overflow: "hidden",
      }}
    >
      <IonContent>
        {/* backBtnText */}
        <Header
          backRoute={"/quizzes/generated_quiz"}
          nameComponent={
            <h1
              style={{
                alignSelf: "center",
                marginTop: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Quiz Details
              <button
                className="edit-btn"
                style={{
                  marginLeft: "10px",
                }}
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                <IonIcon
                  slot="icon-only"
                  icon={createOutline}
                  style={{
                    fontSize: "30px",
                  }}
                ></IonIcon>
              </button>
            </h1>
          }
        />
        <EditQuizModal
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          quiz_name={quiz.quiz_name}
          description={quiz.description}
          setQuiz={setQuiz}
          quiz_id={quiz.quiz_id}
        />
        <section className="ion-padding">
          <QuizDetailCard data={quiz} shadowColor={shadowColor} />
          {quiz.description && (
            <QuizDescriptionCard
              shadowColor={shadowColor}
              description={quiz.description}
            />
          )}
          <IonSegment
            mode="ios"
            style={{
              height: "40px",
              boxShadow: "8px 8px 0px #ECC56A",
              border: "1.5px solid black",
              marginBottom: "3px",
            }}
            value={window}
            onIonChange={(e) => setWindow(e.detail.value as string)} // Set the state for the active segment
          >
            <IonSegmentButton value="questions">
              <IonLabel>Questions</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="history">
              <IonLabel>History</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          <div>
            {window === "questions" ? (
              <div
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
                {quiz.questions.map((question_answer, index) => (
                  <QuestionCard
                    key={question_answer.question_id}
                    question_answer={question_answer}
                    idx={index}
                  />
                ))}
              </div>
            ) : (
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
                {attemptedQuiz.length !== 0 ? (
                  attemptedQuiz.map((data, index) => (
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
                    No History
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end", // Align horizontally to the right
              alignItems: "flex-end", // Align vertically to the bottom
              height: "100%", // Make sure the parent container has full height
              marginTop: "5px",
              marginBottom: "5px",
            }}
          >
            <IonButton
              expand="full"
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

export const getShadowColors = () => {
  const colors = [
    "#ECC56A",
    "#47926B",
    "#44819E",
    "#AC4830",
    "gray",
    "#D8A7C7",
    "#D98F56",
    "#7E5F92",
    "#8F7CC4",
    "#9E7C5E",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  const shadowColor = colors[randomIndex];

  return shadowColor;
};

export default Quiz;

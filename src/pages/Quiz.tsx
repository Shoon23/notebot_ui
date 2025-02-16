import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import QuestionCard from "@/components/Quiz/QuestionCard";
import AttemptQuizCard from "@/components/Quizzes/AttemptQuizCard";
import useStorageService from "@/hooks/useStorageService";
import {
  iMCQQuestion,
  iQuiz,
  QuestionWithOptions,
} from "@/repository/QuizRepository";
import { iAttemptQuiz } from "@/repository/AttemptQuizRepository";
import Header from "@/components/Header";
import QuizDetailCard from "@/components/Quiz/QuizDetailCard";
import QuizDescriptionCard from "@/components/Quiz/QuizDescriptionCard";
import { closeOutline, colorFill, createOutline } from "ionicons/icons";
import "../styles/quiz.css";
import EditQuizModal from "@/components/Quiz/EditQuizModal";
interface QuizProp
  extends RouteComponentProps<{
    id: string;
  }> {}
import { useHistory } from "react-router-dom";
import { differenceInSeconds } from "date-fns";
import QuizQuickActions from "@/components/Quiz/QuizQuickActions";

const Quiz: React.FC<QuizProp> = ({ match }) => {
  const [quiz, setQuiz] = useState<iMCQQuestion>({
    quiz_name: "",
    question_type: "",
    blooms_taxonomy_level: "",
    description: "",
    num_questions: 0,
    quiz_id: 0,
    questions: [],
  });
  const storageServ = useStorageService();
  const [attemptedQuiz, setAttemptedQuiz] = useState<iAttemptQuiz[]>([]);
  const [window, setWindow] = useState("questions");
  const [isEdit, setIsEdit] = useState(false);

  const [shadowColorDetail, setshadowColorDetail] = useState("");
  const [shadowColorActions, setshadowColorActions] = useState("");
  const [isSelectQuestion, setIsSelectQuestion] = useState(false);
  const history = useHistory();
  // State to store selected questions (or any info you need)
  const [selectedQuestions, setSelectedQuestions] = useState<
    QuestionWithOptions[]
  >([]);

  // Callback when a question card toggles its selection
  const handleSelectionChange = (
    question: QuestionWithOptions,
    isChecked: boolean
  ) => {
    setSelectedQuestions((prev) => {
      // If checked, add the question; if unchecked, remove it
      if (isChecked) {
        return [...prev, question];
      } else {
        return prev.filter((q) => q.question_id !== question.question_id); // assuming each question has a unique id
      }
    });
  };
  useIonViewWillEnter(() => {
    // setSelectedQuestions([]);
    // setIsSelectQuestion(false);

    const fetchQuizData = async () => {
      try {
        const quiz_data = await storageServ.quizRepo.getQuizWithQuestions(
          match.params.id
        );
        if (quiz_data.question_type === "essay") {
          setSelectedQuestions(quiz_data.questions);
        }

        console.log(quiz_data);
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
    setshadowColorDetail(getShadowColors());
    setshadowColorActions(getShadowColors());
  });

  // useIonViewWillLeave(() => {
  //   setSelectedQuestions([]);
  //   setIsSelectQuestion(false);
  // });
  console.log(quiz);
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
          <QuizDetailCard data={quiz} shadowColor={shadowColorDetail} />
          {quiz.description && (
            <QuizDescriptionCard
              shadowColor={shadowColorDetail}
              description={quiz.description}
            />
          )}
          <QuizQuickActions
            setQuiz={setQuiz}
            quiz_id={quiz.quiz_id}
            question_type={quiz.question_type}
          />

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
                {quiz.questions.map((question_answer, index) => {
                  // Determine if this question is selected by checking the parent's selectedQuestions state.
                  const isSelected = selectedQuestions.some(
                    (q) => q.question_id === question_answer.question_id
                  );
                  return (
                    <QuestionCard
                      key={question_answer.question_id}
                      question_answer={question_answer}
                      question_type={quiz.question_type}
                      idx={index}
                      isCheckBox={
                        quiz.question_type !== "essay" && isSelectQuestion
                      }
                      isSelectQuestion={isSelectQuestion}
                      setQuiz={setQuiz}
                      onSelectionChange={handleSelectionChange}
                      selected={isSelected} // Pass the controlled value
                    />
                  );
                })}
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
                    <AttemptQuizCard key={data.quiz_attempt_id} data={data} />
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
        </section>
      </IonContent>

      <IonFab
        style={{
          position: "fixed",
          bottom: "60px",
          right: "20px",
          zIndex: "5px",
        }}
        slot="fixed"
        horizontal="end"
      >
        <IonFabButton
          className="take-quiz-btn-container animated-button"
          disabled={isSelectQuestion && selectedQuestions.length === 0}
        >
          Start Quiz
        </IonFabButton>

        {!isSelectQuestion ? (
          <IonFabList
            side="top"
            style={{
              width: "100%",
            }}
          >
            <IonFabButton
              style={{ zIndex: 1000 }}
              className="mini-btn animated-button"
              onClick={() => {
                history.push(`/take-quiz/${quiz.quiz_id}`, {
                  quiz: quiz,
                });
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div>All</div>
              </div>
            </IonFabButton>

            {quiz.question_type !== "essay" && (
              <IonFabButton
                style={{ zIndex: 1000 }}
                className="mini-btn animated-button"
                onClick={() => setIsSelectQuestion(!isSelectQuestion)}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div>Select</div>
                </div>
              </IonFabButton>
            )}
          </IonFabList>
        ) : (
          <IonFabList
            side="top"
            style={{
              width: "100%",
            }}
          >
            <IonFabButton
              style={{ zIndex: 1000 }}
              className="cancel-mini-btn animated-button"
              onClick={() => {
                setIsSelectQuestion(false);
                setSelectedQuestions([]);
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IonIcon
                  icon={closeOutline}
                  style={{
                    fontSize: "24px",
                    color: "#ac4830",
                  }}
                ></IonIcon>
                <div style={{}}>Cancel</div>
              </div>
            </IonFabButton>
            <IonFabButton
              style={{ zIndex: 1000 }}
              className="mini-btn animated-button"
              onClick={() => {
                history.push(`/take-quiz/${quiz.quiz_id}`, {
                  quiz: { ...quiz, questions: selectedQuestions },
                });
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div>Start</div>
              </div>
            </IonFabButton>
          </IonFabList>
        )}
      </IonFab>
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

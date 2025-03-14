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
  IonButtons,
  IonModal,
  IonAlert,
} from "@ionic/react";
import { IonSearchbar } from "@ionic/react";
import {
  sparklesOutline,
  search,
  close,
  colorWand,
  caretDown,
  caretUp,
  archive,
  fileTray,
  archiveOutline,
  checkmarkDone,
} from "ionicons/icons";
import "../styles/quiz.css";
import "../theme/animation.css";
import SearchInput from "@/components/SearchInput/SearchInput";
import QuizCard from "@/components/QuizCard";
import AttemptQuizCard from "@/components/Quizzes/AttemptQuizCard";
import { StorageServiceContext } from "@/App";
import { iAttemptQuiz } from "@/repository/AttemptQuizRepository";
import { iQuiz } from "@/repository/QuizRepository";
import { RouteComponentProps, useHistory } from "react-router-dom";
import QuizArhives from "@/components/Quizzes/QuizArhives";

interface QuizzesProps
  extends RouteComponentProps<{
    window: string;
  }> {}

const Quizzes: React.FC<QuizzesProps> = ({ match }) => {
  const [attemptedQuiz, setAttemptedQuiz] = useState<iAttemptQuiz[]>([]);
  const history = useHistory();

  const [quiz, setQuiz] = useState<iQuiz[]>([]);
  const router = useIonRouter();
  const storageServ = useContext(StorageServiceContext);
  const [window, setWindow] = useState("generated_quiz");
  const [isShowQuiz, setIsShowQuiz] = useState(true);
  const isInitComplete = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectQuiz, setIsSelectQuiz] = useState(false);
  const [isShowDelAlertQuizzes, setIsShowDelAlertQuizzes] = useState(false);
  const [arhives, setArhives] = useState<iQuiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<iQuiz[]>([]);

  const fetchArchive = async () => {
    const arhivesData = await storageServ.quizRepo.getManyQuiz({
      onlyArchived: true,
      search_key_word: null,
      is_recent: false,
    });

    setArhives(arhivesData);
  };
  const fetchQuizAttempts = async () => {
    const quizAttemptList = await storageServ.attemptQuizRepo.getManyAttempts({
      is_recent: true,
      onlyNotArchived: true,
    });
    setAttemptedQuiz(quizAttemptList);
  };
  useIonViewWillEnter(() => {
    const initSubscription = storageServ.isInitCompleted.subscribe((value) => {
      isInitComplete.current = value;
      if (isInitComplete.current === true) {
        const fetchQuiz = async () => {
          const quizList = await storageServ.quizRepo.getManyQuiz({
            is_recent: true,
            search_key_word: null,
            onlyNotArchived: true,
          });
          setQuiz(quizList);
        };

        if (match.params.window) {
          setWindow(match.params.window);
        }

        fetchQuizAttempts();
        fetchQuiz();
        fetchArchive();
      }
    });

    return () => {
      initSubscription.unsubscribe();
    };
  }, [storageServ]);
  const redirectQuiz = async (quiz_id: number) => {
    history.push(`/quiz/${quiz_id}`, {});
  };

  const handleSelectArchive = (quiz: iQuiz, isChecked: boolean) => {
    setSelectedQuiz((prev) => {
      // If checked, add the question; if unchecked, remove it.
      if (isChecked) {
        return [...prev, quiz];
      } else {
        return prev.filter((q) => q.quiz_id !== quiz.quiz_id);
      }
    });
  };

  const redirectQuizResult = (id: number) => {
    router.push(`/quiz-result/${id}`);
  };
  return (
    <IonPage>
      <IonContent>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle
              onClick={() => setIsOpen(true)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "1.6rem" }}>
                {isShowQuiz ? "Quiz" : "Archives"}
              </span>
              <IonIcon
                style={{ marginLeft: "5px" }}
                icon={!isOpen ? caretDown : caretUp}
              />
            </IonTitle>
            <div
              slot="end"
              style={{
                marginRight: "8px",
              }}
            >
              {isSelectQuiz && (
                <>
                  <button
                    disabled={selectedQuiz.length === 0}
                    style={{
                      marginRight: "3px",
                    }}
                    className="del-note-btn"
                    onClick={() => {
                      setIsShowDelAlertQuizzes(true);
                    }}
                  >
                    <IonIcon
                      icon={archiveOutline}
                      style={{ fontSize: "30px" }}
                    />
                  </button>
                  <IonAlert
                    isOpen={isShowDelAlertQuizzes}
                    header="Do you want to ARCHIVE all this Quizzes?"
                    buttons={[
                      { text: "Cancel", role: "cancel" },
                      {
                        cssClass: "alert-button-confirm",
                        text: "Yes",
                        role: "confirm",
                        handler: async () => {
                          await storageServ.quizRepo.archiveMultipleQuizzesAndAttempts(
                            selectedQuiz
                          );
                          setQuiz((prevQuiz) =>
                            prevQuiz.filter(
                              (quiz) =>
                                !selectedQuiz.some(
                                  (selected) =>
                                    selected.quiz_id === quiz.quiz_id
                                )
                            )
                          );
                          fetchQuizAttempts();
                          fetchArchive();
                          setSelectedQuiz([]);
                        },
                      },
                    ]}
                    onDidDismiss={() => {
                      setIsShowDelAlertQuizzes(false);
                      setIsSelectQuiz(false);
                    }}
                  ></IonAlert>
                </>
              )}

              {isShowQuiz && (
                <button
                  disabled={quiz.length === 0 || window !== "generated_quiz"}
                  className="multi-sel-note-btn"
                  onClick={() => {
                    setIsSelectQuiz(!isSelectQuiz);
                  }}
                >
                  <IonIcon
                    icon={!isSelectQuiz ? checkmarkDone : close}
                    style={{ fontSize: "30px" }}
                  />
                </button>
              )}
            </div>
          </IonToolbar>
        </IonHeader>
        <section className="ion-padding">
          {isShowQuiz ? (
            <>
              <IonSegment
                disabled={isSelectQuiz}
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
                <IonSegmentButton value="generated_quiz">
                  <IonLabel>Generated Quiz</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="attempted_quiz">
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
                      quiz.map((data, index) => {
                        const isSelected = selectedQuiz.some(
                          (q) => q.quiz_id === data.quiz_id
                        );
                        return (
                          <QuizCard
                            isCheckBox={isSelectQuiz}
                            key={index}
                            data={data}
                            isSelected={isSelected}
                            redirectQuiz={redirectQuiz}
                            handleSelectArchive={handleSelectArchive}
                          />
                        );
                      })
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
                          data={data}
                          redirectQuizResult={redirectQuizResult}
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
            </>
          ) : (
            <QuizArhives quizzes={arhives} />
          )}
        </section>
      </IonContent>

      {/* Modal */}
      <IonModal
        isOpen={isOpen}
        initialBreakpoint={0.5}
        breakpoints={[0.5]}
        onWillDismiss={() => setIsOpen(false)}
      >
        <IonContent className="ion-padding">
          <IonHeader className="ion-no-border">
            <IonToolbar>
              <IonTitle>Quiz</IonTitle>
              <IonButtons slot="end">
                <IonButton color="danger" onClick={() => setIsOpen(false)}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonButton
            expand="block"
            color="primary"
            fill="clear"
            onClick={() => {
              setIsShowQuiz(true);
              setIsOpen(false);
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "start",
                justifyContent: "start",
                fontSize: "1.2rem",
                gap: 10,
              }}
            >
              <IonIcon slot="start" icon={fileTray} />
              Quiz
            </div>
          </IonButton>
          <IonButton
            expand="block"
            color="danger"
            fill="clear"
            onClick={() => {
              setIsShowQuiz(false);

              setIsOpen(false);
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "start",
                justifyContent: "start",
                fontSize: "1.2rem",
                gap: 10,
              }}
            >
              <IonIcon slot="start" icon={archive} />
              Archives
            </div>
          </IonButton>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Quizzes;

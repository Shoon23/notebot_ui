import {
  IonAlert,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  useIonLoading,
  useIonRouter,
  useIonViewDidEnter,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import React, { useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import QuestionCard from "@/components/Quiz/QuestionCard";
import AttemptQuizCard from "@/components/Quizzes/AttemptQuizCard";
import useStorageService from "@/hooks/useStorageService";
import {
  iMCQQuestion,
  iQuizSet,
  QuestionWithOptions,
} from "@/repository/QuizRepository";
import { iAttemptQuiz } from "@/repository/AttemptQuizRepository";
import Header from "@/components/Header";
import QuizDetailCard from "@/components/Quiz/QuizDetailCard";
import QuizDescriptionCard from "@/components/Quiz/QuizDescriptionCard";
import {
  archive,
  closeOutline,
  createOutline,
  refresh,
  shuffle,
} from "ionicons/icons";
import "../styles/quiz.css";
import EditQuizModal from "@/components/Quiz/EditQuizModal";
import QuizQuickActions from "@/components/Quiz/QuizQuickActions";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { b64toBlob } from "@/components/GenerateQuiz/GenerateQuizForm";
import Rubrics from "@/components/Rubrics/Rubrics";
import { Rubric } from "@/repository/EssayRepository";
import { Network } from "@capacitor/network";

interface QuizProp
  extends RouteComponentProps<{
    id: string;
  }> {}

const QuizArhived: React.FC<QuizProp> = ({ match }) => {
  const [quiz, setQuiz] = useState<iMCQQuestion>({
    quiz_name: "",
    question_type: "",
    blooms_taxonomy_level: "",
    description: "",
    num_questions: 0,
    quiz_id: 0,
    questions: [],
    note_id: 0,
    chain_id: "",
  });
  const storageServ = useStorageService();
  const [attemptedQuiz, setAttemptedQuiz] = useState<iAttemptQuiz[]>([]);
  const [window, setWindow] = useState("questions");
  const [isEdit, setIsEdit] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [shadowColorDetail, setshadowColorDetail] = useState("");
  const [shadowColorActions, setshadowColorActions] = useState("");
  const [isSelectQuestion, setIsSelectQuestion] = useState(false);
  const history = useHistory();

  const [usedRubric, setUsedRubric] = useState<Rubric | null>(null);
  // State to store selected questionsj
  const [selectedQuestions, setSelectedQuestions] = useState<
    QuestionWithOptions[]
  >([]);

  const [note, setNote] = useState<{
    content_text: string | null;
    content_pdf_url: string | null;
    note_name: string;
    note_id: number;
  }>({
    content_pdf_url: "",
    content_text: "",
    note_name: "",
    note_id: -1,
  });

  const [quizSets, setQuizSets] = useState<Array<iQuizSet>>([]);
  const [present, dismiss] = useIonLoading();
  const [isError, setIsError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [isShowDelete, setIsShowDelete] = useState(false);
  const router = useIonRouter();
  const [disableRegen, setDisableRegen] = useState(false);
  // Hardware back button handler that resets edit mode
  const backButtonHandler = (event: any) => {
    // Register with a high priority so it overrides default behavior
    event.detail.register(100, (processNextHandler: any) => {
      setIsEdit(false);
      processNextHandler();
    });
  };

  const [currSet, setCurrSet] = useState(-1);

  // Register the back button handler when the view is active
  useIonViewDidEnter(() => {
    document.addEventListener("ionBackButton", backButtonHandler);
  });

  // Remove the back button handler when leaving the view
  useIonViewWillLeave(() => {
    document.removeEventListener("ionBackButton", backButtonHandler);
  });

  useIonViewWillEnter(() => {
    const fetchQuizData = async () => {
      try {
        const quiz_data = await storageServ.quizRepo.getQuizWithQuestions(
          Number(match.params.id)
        );

        const note_data = await storageServ.noteRepo.getNoteById(
          quiz_data.note_id
        );

        const quiz_set = await storageServ.quizRepo.getQuizzesByChain(
          quiz_data.chain_id
        );

        setNote(note_data);
        setQuizSets(quiz_set);
        setCurrSet(quiz_set[0].quiz_id);
        fetchQuizAttemptHistory(quiz_data.quiz_id);

        if (quiz_data.question_type === "essay") {
          setSelectedQuestions(quiz_data.questions);
        }
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

        console.log(quizAttempt);
        setAttemptedQuiz(quizAttempt);
      } catch (error) {
        console.log(error);
      }
    };

    fetchQuizData();
    setshadowColorDetail(getShadowColors());
    setshadowColorActions(getShadowColors());
  });

  // Callback when a question card toggles its selection
  const handleSelectionChange = (
    question: QuestionWithOptions,
    isChecked: boolean
  ) => {
    setSelectedQuestions((prev) => {
      // If checked, add the question; if unchecked, remove it.
      if (isChecked) {
        return [...prev, question];
      } else {
        return prev.filter((q) => q.question_id !== question.question_id);
      }
    });
  };

  const handleRegenerateQuiz = async () => {
    try {
      await present({ message: "Generating Quiz..." });
      const networkStatus = await Network.getStatus();
      if (!networkStatus.connected) {
        setIsError(true);
        setErrMsg(
          "No internet connection. Please check your network settings."
        );
        await dismiss();
        return;
      }
      const quizHistory = await storageServ.quizRepo.getQuizzesByChainRawText(
        quiz.chain_id as string
      );
      const apiUrl =
        "https://test-backend-9dqr.onrender.com/generate-questions-set";
      let fileBlob: Blob | null = null;
      let filename: string | null = null;

      // If a file path exists, read the file using Capacitor Filesystem.
      if (note.content_pdf_url) {
        // Remove any "file://" prefix if present.
        let filePath = note.content_pdf_url;
        if (filePath.startsWith("file://")) {
          filePath = filePath.replace("file://", "");
        }
        // Read the file from Directory.Documents (adjust if needed)
        const fileResult = await Filesystem.readFile({
          path: filePath, // Relative path (e.g., folderName/file.name)
          directory: Directory.Data,
        });
        const base64Data = fileResult.data as any; // Base64 encoded string

        // Determine MIME type based on file extension
        let mimeType = "application/octet-stream";
        if (filePath.toLowerCase().endsWith(".pdf")) {
          mimeType = "application/pdf";
        } else if (filePath.toLowerCase().endsWith(".docx")) {
          mimeType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        // Convert the Base64 string to a Blob.
        fileBlob = b64toBlob(base64Data, mimeType);
        filename = filePath.split("/").pop() || "uploadfile";
      }

      // Always use FormData to send the data.
      const formData = new FormData();
      // Append the file if available.
      if (fileBlob && filename) {
        formData.append("file", fileBlob, filename);
      }
      formData.append("blooms_taxonomy_level", quiz.blooms_taxonomy_level);
      formData.append("num_questions", String(quiz.num_questions));
      formData.append("question_type", quiz.question_type);
      // Append note content (or fallback to an empty string).
      formData.append("content_text", note.content_text || "");
      formData.append("quiz_history", JSON.stringify(quizHistory));
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const res = await response.json();

        console.log(res);

        setIsError(true);
        setErrMsg(res?.message || res[0].message || "Something Went Wrong");
        await dismiss();

        return;
      }
      const data = await response.json();
      let quiz_data = null;
      const {
        quiz_name,
        note_id,
        question_type,
        blooms_taxonomy_level,
        num_questions,
        ...others
      } = quiz;

      const quizData = {
        note_id,
        quiz_name,
        question_type,
        blooms_taxonomy_level,
        num_questions,
        description: null,
      };
      switch (quiz.question_type) {
        case "essay":
          quiz_data = await storageServ.quizRepo.saveEssayQuestion(
            quizData,
            data,
            quiz.chain_id
          );
          break;
        case "mcq":
          quiz_data = await storageServ.quizRepo.save_generated_mcq(
            quizData,
            data,
            quiz.chain_id
          );
          break;
        case "true-or-false":
        case "short-answer":
          quiz_data =
            await storageServ.quizRepo.saved_gen_true_false_or_short_answer(
              quizData,
              data,
              quiz.chain_id
            );
          break;
        default:
          console.error("Unknown question type");
      }

      if (!quiz_data) return;
      setQuizSets((prev) => [
        ...prev,
        {
          quiz_id: quiz_data?.quiz_id,
          chain_id: quiz.chain_id,
        },
      ]);
      setCurrSet(quiz_data?.quiz_id);
      if (quiz_data.question_type === "essay") {
        setSelectedQuestions(quiz_data.questions as any);
      }
      setQuiz((prev) => ({
        ...prev,
        quiz_id: quiz_data?.quiz_id,
        questions: quiz_data.questions as any,
      }));
    } catch (error) {
      setIsError(true);
      setErrMsg("Something Went Wrong");
      console.error(error);
    } finally {
      await dismiss();
    }
  };

  const handleSwitchSet = async (quiz_id: number) => {
    try {
      const quiz_data = await storageServ.quizRepo.getQuizWithQuestions(
        quiz_id
      );
      if (quiz_data.question_type === "essay") {
        setSelectedQuestions(quiz_data.questions);
      }
      setQuiz(quiz_data);
    } catch (error) {
      console.log(error);
    }
  };

  const redirectQuizResult = (id: number) => {
    router.push(`/quiz-result-archive/${id}`);
  };
  return (
    <IonPage style={{ overflow: "hidden" }}>
      <IonContent>
        <div
          style={{
            backgroundColor: "#ac4830",
            color: "white",
            padding: "10px",
            fontSize: "1.3rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          Archive
          <IonIcon icon={archive} style={{}}></IonIcon>
        </div>
        {/* backBtnText */}
        <Header
          backRoute={"/quizzes/generated_quiz"}
          nameComponent={
            <>
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
              </h1>

              <button
                className="refresh-note-btn"
                onClick={() => {
                  setIsShowDelete(true);
                }}
              >
                <IonIcon icon={refresh} style={{ fontSize: "30px" }} />
              </button>
              <IonAlert
                isOpen={isShowDelete}
                header="Do you want to RESTORE this quiz?"
                buttons={[
                  { text: "Cancel", role: "cancel" },
                  {
                    cssClass: "alert-button-confirm",
                    text: "Yes",
                    role: "confirm",
                    handler: async () => {
                      await storageServ.quizRepo.restoreQuizAndAttempts(
                        quiz.quiz_id
                      );
                      router.push("/quizzes/generated_quiz");
                    },
                  },
                ]}
                onDidDismiss={() => setIsShowDelete(false)}
              ></IonAlert>
            </>
          }
        />
        <section className="ion-padding">
          <QuizDetailCard data={quiz} shadowColor={shadowColorDetail} />
          {quiz.description && (
            <QuizDescriptionCard
              shadowColor={shadowColorDetail}
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
            onIonChange={(e) => setWindow(e.detail.value as string)}
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
                      isSelectQuestion={false}
                      setQuiz={setQuiz}
                      onSelectionChange={handleSelectionChange}
                      isSelected={false}
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
                    No History
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </IonContent>

      <IonAlert
        isOpen={isError}
        header={errMsg}
        buttons={[{ text: "Okay", role: "cancel" }]}
        onDidDismiss={() => setIsError(false)}
      ></IonAlert>
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
  return colors[randomIndex];
};

export default QuizArhived;

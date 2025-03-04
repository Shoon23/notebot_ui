import Header from "@/components/Header";
import QuestionCardAnswer from "@/components/TakeQuiz/QuestionCardAnswer";
import QuestionCardEssay from "@/components/TakeQuiz/QuestionCardEssay";
import QuestionCardMCQ from "@/components/TakeQuiz/QuestionCardMCQ";
import QuestionShortAnswer from "@/components/TakeQuiz/QuestionCardShortAnswer";
import QuestionCardTF from "@/components/TakeQuiz/QuestionCardTF";
import useStorageService from "@/hooks/useStorageService";
import { Rubric } from "@/repository/EssayRepository";
import { iMCQQuestion } from "@/repository/QuizRepository";
import { AttemptEssayType, iAttemptQuiz } from "@/services/attemptQuizService";
import { Filesystem, Directory } from "@capacitor/filesystem";
import {
  IonAlert,
  IonButton,
  IonContent,
  IonPage,
  useIonLoading,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { b64toBlob } from "@/components/GenerateQuiz/GenerateQuizForm";
import "../styles/take-quiz.css";
interface TakeQuizProp
  extends RouteComponentProps<{
    id: string;
  }> {}
const TakeQuiz: React.FC<TakeQuizProp> = ({ match }) => {
  const storageServ = useStorageService();
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [quiz, setQuiz] = useState<iMCQQuestion>({
    quiz_name: "",
    question_type: "",
    blooms_taxonomy_level: "",
    num_questions: 0,
    quiz_id: 0,
    questions: [],
    chain_id: "",
    note_id: 0,
    created_at: "",
    description: "",
  });
  const lastShortAnswerRef = useRef<{
    content: string;
    question: string;
    question_id: number;
  }>({
    content: "",
    question: "",
    question_id: 0,
  });
  const [totalWord, setTotalWorld] = useState(0);
  const [usedRubric, setUsedRubric] = useState<Rubric | null>(null);

  const [attemptQuiz, setAttemptQuiz] = useState<iAttemptQuiz>({
    quiz_id: 0,
    attempted_answers: [],
  });

  const router = useIonRouter();
  const [present, dismiss] = useIonLoading();
  const location = useLocation<{ quiz: any }>();
  // Check the state passed via history.push

  useIonViewWillEnter(() => {
    // storageServ.isInitCompleted.subscribe((isComplete) => {
    //   if (isComplete) {

    //   }
    // });
    const fetchQuizWithAnswer = async () => {
      try {
        const quiz_data = location.state.quiz;
        // const quiz_data = await storageServ.quizRepo.getQuizWithQuestions(
        //   match.params.id
        // );
        if (quiz_data.question_type === "essay") {
          setAttemptQuiz({
            quiz_id: Number(match.params.id),
            attempted_answers: [
              {
                answer: {
                  content: "",
                },
                question: quiz_data.questions[0].content,
                question_id: quiz_data.questions[0].question_id,
              },
            ],
          });
        } else {
          setAttemptQuiz({
            quiz_id: Number(match.params.id),
            attempted_answers: [],
          });
        }

        setQuiz(quiz_data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuizWithAnswer();
  }, [location.state]);

  const handleCheckAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      present({
        message: "Checking Answer",
      });

      let result;
      switch (quiz.question_type) {
        case "mcq":
          result = await storageServ.attemptQuizService.processMCQAnswers(
            attemptQuiz
          );
          break;
        case "true-or-false":
          result = await storageServ.attemptQuizService.processTrueFalseAnswers(
            attemptQuiz
          );
          break;
        case "short-answer":
          result = await storageServ.attemptQuizService.processShortAnswer(
            attemptQuiz
          );
          break;
        case "essay":
          let fileBlob: Blob | null = null;
          let filename: string | null = null;
          let filePath = usedRubric?.file_path as string;
          if (filePath.startsWith("file://")) {
            filePath = filePath.replace("file://", "");
          }

          const fileResult = await Filesystem.readFile({
            path: filePath,
            directory: Directory.Data,
          });

          const base64Data = fileResult.data as any; // Base64 encoded string
          // Convert the Base64 string to a Blob.
          fileBlob = b64toBlob(base64Data, "application/pdf");
          filename = filePath.split("/").pop() || "uploadfile";

          const formData = new FormData();

          // Append the answer and question fields (assuming these are string values)
          formData.append(
            "answer",
            attemptQuiz.attempted_answers[0].answer.content
          );
          formData.append(
            "question",
            attemptQuiz.attempted_answers[0].question as string
          );

          formData.append("rubric", fileBlob, filename);

          const response = await fetch(
            "https://test-backend-9dqr.onrender.com/evaluate-essay",
            {
              method: "POST",
              body: formData,
              // Do not manually set the Content-Type header; the browser sets it automatically.
            }
          );
          // const response: HttpResponse = await CapacitorHttp.post(options);
          console.log(response);
          if (!response.ok) {
            const res = await response.json();
            console.log(res);
            setIsError(true);
            setErrorMsg(
              res?.message || res[0].message || "Something Went Wrong"
            );
            dismiss();

            return;
          }

          const evaluated_answer = (await response.json()) as AttemptEssayType;

          result = await storageServ.attemptQuizService.processEssayAnswer({
            ...evaluated_answer,
            answer: attemptQuiz.attempted_answers[0].answer.content,
            question_id: attemptQuiz.attempted_answers[0].question_id,
            quiz_id: quiz.quiz_id,
            rubric_id: usedRubric?.rubric_id as number,
          });
          break;
      }

      router.push(`/quiz-result/${result?.quiz_attempt_id}`);
    } catch (error) {
      setIsError(true);
      setErrorMsg("Something Went Wrong");
    } finally {
      dismiss();
    }
  };
  const handleSelectAnswer = (answer: any, question_type: string) => {
    switch (question_type) {
      case "mcq":
        setAttemptQuiz((prev) => {
          // update if it already exists
          const updatedAnswers = prev.attempted_answers.map((attemptedAnswer) =>
            answer.question_id === attemptedAnswer.question_id
              ? {
                  ...attemptedAnswer,
                  answer: {
                    content: answer.content,
                    option_id: answer.option_id,
                  },
                }
              : attemptedAnswer
          );

          // add if it not exists
          // Check if the question_id exists in attempted_answers
          const isQuestionAnswered = prev.attempted_answers.some(
            (attemptedAnswer) =>
              attemptedAnswer.question_id === answer.question_id
          );

          // If question_id does not exist, add it as a new answer
          if (!isQuestionAnswered) {
            updatedAnswers.push({
              question_id: answer.question_id,
              question: answer.question,
              answer: {
                content: answer.content,
                option_id: answer.option_id,
              },
            });
          }
          return {
            ...prev,
            attempted_answers: updatedAnswers,
          };
        });
        break;
      case "true-or-false":
        setAttemptQuiz((prev) => {
          const updatedAnswers = prev.attempted_answers.map((attemptedAnswer) =>
            answer.question_id === attemptedAnswer.question_id
              ? {
                  ...attemptedAnswer,
                  answer: {
                    content: answer.content,
                  },
                }
              : attemptedAnswer
          );
          // add if it not exists
          // Check if the question_id exists in attempted_answers
          const isQuestionAnswered = prev.attempted_answers.some(
            (attemptedAnswer) =>
              attemptedAnswer.question_id === answer.question_id
          );

          // If question_id does not exist, add it as a new answer
          if (!isQuestionAnswered) {
            updatedAnswers.push({
              question_id: answer.question_id,
              question: answer.question,
              answer: {
                content: answer.content,
              },
            });
          }
          return {
            ...prev,
            attempted_answers: updatedAnswers,
          };
        });
        break;
    }
  };
  const handleOnChangeAnswer = (answer: any, question_type: string) => {
    switch (question_type) {
      case "short-answer":
        setAttemptQuiz((prev) => {
          const existingAnswerIndex = prev.attempted_answers.findIndex(
            (attempt) => attempt.question === answer.question
          );

          // Create a copy of the attempted answers
          const updatedAnswers = [...prev.attempted_answers];

          if (existingAnswerIndex !== -1) {
            // Update the existing answer
            updatedAnswers[existingAnswerIndex] = {
              question_id: answer.question_id,
              question: answer.question,
              answer: {
                content: answer.content,
              },
            };
          } else {
            // Add a new answer if not found
            updatedAnswers.push({
              question_id: answer.question_id,
              question: answer.question,
              answer: {
                content: answer.content,
              },
            });
          }

          return {
            ...prev,
            attempted_answers: updatedAnswers,
          };
        });
        break;

      default:
        console.warn(`Unhandled question type: ${question_type}`);
    }
  };
  const countWords = (text: string): number =>
    text.trim().split(/\s+/).filter(Boolean).length;
  const handleOnChangeEssayAnswer = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTotalWorld(countWords(e.target.value));
    setAttemptQuiz((prev) => {
      const prevAnswer = prev.attempted_answers[0];
      const updatedAnswer = {
        ...prevAnswer,
        answer: {
          content: e.target.value,
        },
      };
      return {
        ...prev,
        attempted_answers: [updatedAnswer],
      };
    });
  };
  return (
    <IonPage>
      <IonContent>
        <Header
          nameComponent={
            <h1
              style={{
                alignSelf: "center",
                marginTop: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              Quiz Time!
            </h1>
          }
          backRoute={`/quiz/${quiz.quiz_id}`}
        />
        <form
          className="ion-padding"
          style={{
            overflowX: "hidden",
            height: "100%",
            width: "100%",
            marginTop: "20px",
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onSubmit={handleCheckAnswer}
        >
          {quiz.questions.map((question_answer, index) => {
            // Determine the question type and assign the correct card component
            const attemptedAnswer = attemptQuiz.attempted_answers.find(
              (answer) => answer.question === question_answer.content
            );
            switch (quiz.question_type) {
              case "mcq":
                return (
                  <QuestionCardMCQ
                    key={index}
                    question_answer={question_answer}
                    idx={index}
                    handleSelectAnswer={handleSelectAnswer}
                  />
                );
              case "true-or-false":
                return (
                  <QuestionCardTF
                    key={index}
                    question_answer={question_answer}
                    idx={index}
                    handleSelectAnswer={handleSelectAnswer}
                  />
                );
              case "short-answer":
                return (
                  <QuestionShortAnswer
                    lastShortAnswerRef={lastShortAnswerRef}
                    key={index}
                    question_answer={question_answer}
                    idx={index}
                    handleOnChangeAnswer={handleOnChangeAnswer}
                    value={attemptedAnswer?.answer.content || ""}
                  />
                );
              case "essay":
                return (
                  <QuestionCardEssay
                    usedRubric={usedRubric}
                    setUsedRubric={setUsedRubric}
                    totalWord={totalWord}
                    answer={
                      attemptQuiz.attempted_answers[0].answer.content ?? ""
                    }
                    question_answer={question_answer}
                    idx={index}
                    key={index}
                    handleOnChangeEssayAnswer={handleOnChangeEssayAnswer}
                  />
                );
            }
          })}

          <button
            disabled={
              quiz.question_type !== "essay"
                ? attemptQuiz.attempted_answers.length !== quiz.questions.length
                : !attemptQuiz.attempted_answers[0].answer.content ||
                  totalWord < 100 ||
                  !usedRubric
            }
            className="submit-quiz-btn"
          >
            Submit
          </button>
        </form>
      </IonContent>
      <IonAlert
        isOpen={isError}
        header={errorMsg}
        buttons={[{ text: "Okay", role: "cancel" }]}
        onDidDismiss={() => setIsError(false)}
      ></IonAlert>
    </IonPage>
  );
};

export default TakeQuiz;

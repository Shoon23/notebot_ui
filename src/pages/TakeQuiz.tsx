import Header from "@/components/Header";
import QuestionCardAnswer from "@/components/TakeQuiz/QuestionCardAnswer";
import QuestionCardEssay from "@/components/TakeQuiz/QuestionCardEssay";
import QuestionCardMCQ from "@/components/TakeQuiz/QuestionCardMCQ";
import QuestionShortAnswer from "@/components/TakeQuiz/QuestionCardShortAnswer";
import QuestionCardTF from "@/components/TakeQuiz/QuestionCardTF";
import useStorageService from "@/hooks/useStorageService";
import { iMCQQuestion } from "@/repository/QuizRepository";
import { AttemptEssayType, iAttemptQuiz } from "@/services/attemptQuizService";
import { HttpResponse, CapacitorHttp } from "@capacitor/core";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { c } from "vitest/dist/reporters-5f784f42";
interface TakeQuizProp
  extends RouteComponentProps<{
    id: string;
  }> {}
const TakeQuiz: React.FC<TakeQuizProp> = ({ match }) => {
  const storageServ = useStorageService();
  const [quiz, setQuiz] = useState<iMCQQuestion>({
    quiz_name: "",
    question_type: "",
    blooms_taxonomy_level: "",
    difficulty: "",
    num_questions: 0,
    quiz_id: 0,
    questions: [],
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

  const [attemptQuiz, setAttemptQuiz] = useState<iAttemptQuiz>({
    quiz_id: 0,
    attempted_answers: [],
  });

  const [present, dismiss] = useIonLoading();

  const router = useIonRouter();
  useIonViewWillEnter(() => {
    storageServ.isInitCompleted.subscribe((isComplete) => {
      if (isComplete) {
        const fetchQuizWithAnswer = async () => {
          try {
            const quiz_data = await storageServ.quizRepo.getQuizWithQuestions(
              match.params.id
            );
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
      }
    });
  }, []);

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
          const options = {
            url: "https://test-backend-9dqr.onrender.com/evaluate-essay",
            headers: {
              "Content-Type": "application/json", // Set the content type to JSON
            },
            data: attemptQuiz,
          };
          const response: HttpResponse = await CapacitorHttp.post(options);
          const evaluated_answer = response.data as AttemptEssayType;
          console.log(evaluated_answer);
          result = await storageServ.attemptQuizService.processEssayAnswer(
            evaluated_answer
          );
          break;
      }

      router.push(`/quiz-result/${result?.quiz_attempt_id}`);
    } catch (error) {
      console.log(error);
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

  const handleOnChangeEssayAnswer = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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
  console.log(attemptQuiz);
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
        <form className="ion-padding" onSubmit={handleCheckAnswer}>
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
              disabled={
                quiz.question_type !== "essay"
                  ? attemptQuiz.attempted_answers.length !==
                    quiz.questions.length
                  : !attemptQuiz.attempted_answers[0].answer.content
              }
              color={"tertiary"}
              type="submit"
            >
              Submit
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default TakeQuiz;

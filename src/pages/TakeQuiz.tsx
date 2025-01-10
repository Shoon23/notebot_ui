import Header from "@/components/Header";
import QuestionCardAnswer from "@/components/TakeQuiz/QuestionCardAnswer";
import QuestionCardMCQ from "@/components/TakeQuiz/QuestionCardMCQ";
import QuestionShortAnswer from "@/components/TakeQuiz/QuestionCardShortAnswer";
import QuestionCardTF from "@/components/TakeQuiz/QuestionCardTF";
import useStorageService from "@/hooks/useStorageService";
import { iMCQQuestion } from "@/repository/QuizRepository";
import { iAttemptQuiz } from "@/services/attemptQuizService";
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
    difficultys: "",
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
            setAttemptQuiz({
              quiz_id: Number(match.params.id),
              attempted_answers: [],
            });
            setQuiz(quiz_data);
          } catch (error) {
            console.log(error);
          }
        };
        fetchQuizWithAnswer();
      }
    });
  }, []);

  const handleCheckAnswer = async () => {
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
          const updatedAnswers = attemptQuiz;
          updatedAnswers.attempted_answers.push({
            question_id: lastShortAnswerRef.current?.question_id,
            question: lastShortAnswerRef.current?.question,
            answer: {
              content: lastShortAnswerRef.current?.content,
            },
          });

          result = await storageServ.attemptQuizService.processShortAnswer(
            updatedAnswers
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
        // question_id: string;
        // question: string | null;
        // answer: {
        //     content: string;
        //     option_id?: string | null;
        // };
        setAttemptQuiz((prev) => {
          const existingAnswerIndex = prev.attempted_answers.findIndex(
            (attempt) => attempt.question_id === answer.question_id
          );
          let updatedAnswers;

          if (existingAnswerIndex !== -1) {
            // Update the existing answer
            updatedAnswers = [...prev.attempted_answers];
            updatedAnswers[existingAnswerIndex] = {
              question_id: answer.question_id,
              question: answer.question,
              answer: {
                content: answer.content,
              },
            };
          } else {
            // Add the new answer
            updatedAnswers = [
              ...prev.attempted_answers,
              {
                question_id: answer.question_id,
                question: answer.question,
                answer: {
                  content: answer.content,
                },
              },
            ];
          }

          return {
            ...prev,
            attempted_answers: updatedAnswers,
          };
        });
        break;
    }
  };

  return (
    <IonPage>
      <IonContent>
        <Header name={"Quiz Time!"} backRoute={`/quiz/${quiz.quiz_id}`} />
        <section
          className="ion-padding"
          style={{
            height: "85%",
          }}
        >
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
                    />
                  );
                case "essay":
                  // QuestionCard = EssayCard;
                  break;
              }
            })}
          </div>
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <IonButton
              disabled={
                attemptQuiz.attempted_answers.length !== quiz.questions.length
              }
              color={"tertiary"}
              onClick={handleCheckAnswer}
            >
              Submit
            </IonButton>
          </div>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default TakeQuiz;

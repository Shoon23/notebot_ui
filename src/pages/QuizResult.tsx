import ResultCard from "@/components/QuizResult/ResultCard";
import ResultTitle from "@/components/QuizResult/ResultTitle";
import QuestionCardMCQ from "@/components/TakeQuiz/QuestionCardMCQ";
import QuestionShortAnswer from "@/components/TakeQuiz/QuestionCardShortAnswer";
import QuestionCardTF from "@/components/TakeQuiz/QuestionCardTF";
import useStorageService from "@/hooks/useStorageService";
import {
  iAttemptQuiz,
  iEssayResults,
  iQuizResult,
} from "@/repository/AttemptQuizRepository";
import "../styles/note-input.css";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  useIonViewWillEnter,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import { match } from "assert";
import { chevronBack, colorWand, logoGithub } from "ionicons/icons";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import Header from "@/components/Header";
import RubricResult from "@/components/QuizResult/RubricResult";
import EssayAnswerCard from "@/components/QuizResult/EssayAnswerCard";
import FeedBackCard from "@/components/QuizResult/FeedBackCard";
interface QuizResultProp
  extends RouteComponentProps<{
    id: string;
  }> {}
const QuizResult: React.FC<QuizResultProp> = ({ match }) => {
  const storageServ = useStorageService();
  const router = useIonRouter();
  const [quizResult, setQuizResult] = useState<
    iAttemptQuiz & {
      quiz_results: iQuizResult[] | iEssayResults;
    }
  >({
    created_at: "",
    num_questions: 0,
    quiz_attempt_id: 0,
    quiz_name: "",
    score: 0,
    quiz_results: [],
    blooms_taxonomy_level: "",
    question_type: "",
    quiz_id: 0,
  });
  useIonViewWillEnter(() => {
    const fetchQuizAttemptAnswers = async () => {
      try {
        const data = await storageServ.attemptQuizRepo.getAttemptQuizResults(
          Number(match.params.id)
        );

        console.log(data);
        setQuizResult(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuizAttemptAnswers();
  }, []);
  return (
    <IonPage>
      <IonContent>
        <Header
          backRoute={`/quiz/${quizResult.quiz_id}`}
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
              Result
            </h1>
          }
        />
        <section className="ion-padding">
          <ResultTitle data={quizResult} />

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
            {Array.isArray(quizResult.quiz_results) ? (
              quizResult.quiz_results.map((result, idx) => {
                return (
                  <ResultCard key={idx} question_answer={result} idx={idx} />
                );
              })
            ) : (
              <EssayAnswerCard
                answer={quizResult.quiz_results.answer}
                question={quizResult.quiz_results.question}
              />
            )}
          </div>
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "end",
            }}
          ></div>
          {!Array.isArray(quizResult.quiz_results) && (
            <>
              <RubricResult data={quizResult.quiz_results.scores} />
              <FeedBackCard
                name={"Strengths"}
                feedbacks={quizResult.quiz_results.strength}
              />
              <FeedBackCard
                name={"Improvements"}
                feedbacks={quizResult.quiz_results.improvements}
              />
            </>
          )}
        </section>
      </IonContent>
    </IonPage>
  );
};

export default QuizResult;

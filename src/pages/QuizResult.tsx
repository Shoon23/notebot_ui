import ResultCard from "@/components/QuizResult/ResultCard";
import ResultTitle from "@/components/QuizResult/ResultTitle";
import QuestionCardMCQ from "@/components/TakeQuiz/QuestionCardMCQ";
import QuestionShortAnswer from "@/components/TakeQuiz/QuestionCardShortAnswer";
import QuestionCardTF from "@/components/TakeQuiz/QuestionCardTF";
import useStorageService from "@/hooks/useStorageService";
import { iAttemptQuiz, iQuizResult } from "@/repository/AttemptQuizRepository";
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
interface QuizResultProp
  extends RouteComponentProps<{
    id: string;
  }> {}
const QuizResult: React.FC<QuizResultProp> = ({ match }) => {
  const storageServ = useStorageService();
  const router = useIonRouter();
  const [quizResult, setQuizResult] = useState<
    iAttemptQuiz & {
      quiz_results: iQuizResult[];
    }
  >({
    created_at: "",
    num_questions: 0,
    quiz_attempt_id: 0,
    quiz_name: "",
    score: 0,
    quiz_results: [],
  });
  useIonViewWillEnter(() => {
    const fetchQuizAttemptAnswers = async () => {
      try {
        const data = await storageServ.attemptQuizRepo.getAttemptQuizResults(
          Number(match.params.id)
        );
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
        <Header backRoute="/quizzes/generated_quiz" name="Result" />
        <section
          className="ion-padding"
          style={{
            height: "85%",
          }}
        >
          <ResultTitle
            data={{
              created_at: quizResult.created_at,
              num_questions: quizResult.num_questions,
              quiz_attempt_id: quizResult.quiz_attempt_id,
              quiz_name: quizResult.quiz_name,
              score: quizResult.score,
            }}
          />
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
            {quizResult.quiz_results.map((result, idx) => {
              return (
                <ResultCard key={idx} question_answer={result} idx={idx} />
              );
            })}
          </div>
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "end",
            }}
          ></div>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default QuizResult;

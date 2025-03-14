import ResultCard from "@/components/QuizResult/ResultCard";
import ResultTitle from "@/components/QuizResult/ResultTitle";
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
  useIonViewWillEnter,
  useIonRouter,
  IonIcon,
} from "@ionic/react";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import Header from "@/components/Header";
import RubricResult from "@/components/QuizResult/RubricResult";
import EssayAnswerCard from "@/components/QuizResult/EssayAnswerCard";
import FeedBackCard from "@/components/QuizResult/FeedBackCard";
import { Rubric } from "@/repository/EssayRepository";
import RubricFile from "@/components/QuizResult/RubricFile";
import { archive } from "ionicons/icons";
interface QuizResultArhivedProp
  extends RouteComponentProps<{
    id: string;
  }> {}
const QuizResultArhived: React.FC<QuizResultArhivedProp> = ({ match }) => {
  const storageServ = useStorageService();
  const router = useIonRouter();
  const [rubric, setRubric] = useState<Rubric>({
    file_name: "",
    file_path: "",
    rubric_id: 0,
    is_used: true,
  });
  const [quizResult, setQuizResult] = useState<
    iAttemptQuiz & {
      quiz_results: iQuizResult[] | iEssayResults;
    }
  >({
    created_at: "",
    max_score: 0,
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
        if (!Array.isArray(data.quiz_results)) {
          const essayResult = data.quiz_results as iEssayResults;
          const rubric = await storageServ.essayRepo.getRubric(
            essayResult.rubric_id
          );

          setRubric(rubric);
        }
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
        <Header
          backRoute={`/quiz-archive/${quizResult.quiz_id}`}
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
              display: "flex",
              gap: 5,
              alignItems: "center",
              justifyContent: "center",
              height: "55px",
              marginBottom: "10px",
            }}
          >
            {/* <button className="view-note-btn">View Note</button> */}
            <button
              className="add-question-btn"
              onClick={() => {
                router.push(
                  `/quiz-archive/${quizResult.quiz_id}`,
                  "back",
                  "pop"
                );
              }}
            >
              View Quiz
            </button>
          </div>
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
              <RubricFile rubric={rubric} />

              <RubricResult scores={quizResult.quiz_results.scores} />
              <FeedBackCard
                name={"Feedback"}
                feedbacks={quizResult.quiz_results.feedback}
              />
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

export default QuizResultArhived;

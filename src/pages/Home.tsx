import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import "../theme/animation.css";
import {
  libraryOutline,
  caretForwardOutline,
  closeSharp,
} from "ionicons/icons";

import generate_icon from "../assets/generate2.png";
import "../theme/animation.css";
import ai_icon from "../assets/robot.png";
import AttemptQuizCard from "@/components/Quizzes/AttemptQuizCard";
import NoteCard from "@/components/NoteCard";
import MoreButton from "@/components/Home/MoreButton";
import { StorageServiceContext } from "@/App";
import { Quiz } from "@/databases/models/quiz";
import { Note } from "@/databases/models/note";
import { iAttemptQuiz } from "@/repository/AttemptQuizRepository";
import useStorageService from "@/hooks/useStorageService";
import { RouteComponentProps } from "react-router-dom";

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  const router = useIonRouter();
  const [attemptedQuiz, setAttemptedQuiz] = useState<iAttemptQuiz[]>([]);
  const [note, setNotes] = useState<Note[]>([]);
  const isInitComplete = useRef(false);

  const storageServ = useStorageService();

  useIonViewWillEnter(() => {
    const initSubscription = storageServ.isInitCompleted.subscribe((value) => {
      isInitComplete.current = value;
      if (isInitComplete.current === true) {
        const fetchNote = async () => {
          const noteList = await storageServ.noteRepo.getListOfNotes({
            limit: 5,
          });

          setNotes(noteList);
        };

        const fetchQuizAttempts = async () => {
          const quizList = await storageServ.attemptQuizRepo.getManyAttempts({
            is_recent: true,
          });
          console.log(quizList);
          setAttemptedQuiz(quizList);
        };
        fetchNote();
        fetchQuizAttempts();
      }
    });

    return () => {
      initSubscription.unsubscribe();
    };
  }, [storageServ]);

  const handleMoreRecentQuiz = () => {
    router.push("/quizzes/attempted_quiz");
  };

  const handleMoreNotes = () => {
    router.push("/notes");
  };
  return (
    <IonPage>
      <IonContent>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <section className="ion-padding">
          <div>
            <h4>Quick Actions</h4>
            <div
              style={{
                display: "flex",
                height: "70px",
              }}
            >
              <button
                className="animated-button"
                style={{
                  border: "2px solid black",
                  fontSize: "1.5rem",
                  height: "100%",
                  borderRadius: "20px",
                  marginBottom: "10px",
                  backgroundColor: "#E57373",
                  marginRight: 5,
                  flex: 1,
                  color: "white",
                  boxShadow: "5px 8px 15px rgba(0, 0, 0, 0.3)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  display: "flex", // Flexbox layout
                  alignItems: "center", // Vertically align items (text and image)
                  justifyContent: "center", // Horizontally center content
                  padding: "0", // Ensure no padding inside the button
                  gap: 0,
                }}
              >
                <img src={generate_icon} width={40} />
                <span>Create Quiz</span>
              </button>

              <button
                className="animated-button"
                style={{
                  border: "2px solid black",
                  fontSize: "1.5rem",
                  flex: 1,
                  height: "100%",
                  borderRadius: "20px",

                  backgroundColor: "#81C784",
                  color: "white",

                  boxShadow: "5px 8px 15px rgba(0, 0, 0, 0.3)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  display: "flex", // Flexbox layout
                  alignItems: "center", // Vertically align items (text and image)
                  justifyContent: "center", // Horizontally center content
                }}
              >
                <img
                  src={ai_icon}
                  width={40}
                  style={{
                    marginRight: "10px",
                  }}
                />
                AI Assist
              </button>
            </div>
          </div>

          <div>
            <h4>Recent Quizzes</h4>

            {attemptedQuiz.length !== 0 ? (
              <div
                style={{
                  display: "flex",
                  overflowY: "auto",
                  whiteSpace: "nowrap",
                  gap: "5px",
                  scrollBehavior: "smooth", // Optional: for smooth scrolling
                  flexDirection: "column",
                  height: "300px",
                }}
              >
                {attemptedQuiz.map((data) => {
                  return (
                    <AttemptQuizCard
                      key={data.quiz_attempt_id}
                      width="360px"
                      data={data}
                    />
                  );
                })}
                <MoreButton
                  color="#ECC56A"
                  handleMoreButton={handleMoreRecentQuiz}
                />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  overflowY: "auto",
                  whiteSpace: "nowrap",
                  scrollBehavior: "smooth", // Optional: for smooth scrolling
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "250px",
                }}
              >
                No Quiz Taken
              </div>
            )}
            <div
              style={{
                color: "white",
              }}
            >
              Sean
            </div>
          </div>

          <div
            style={{
              marginBottom: "50px",
            }}
          >
            <h4>Recent Notes</h4>

            {note.length !== 0 ? (
              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  gap: "10px",
                  scrollBehavior: "smooth", // Optional: for smooth scrolling
                  flexDirection: "column",
                  height: "300px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {note.map((data, index) => {
                  return (
                    <NoteCard
                      key={index}
                      width="360px"
                      data={data}
                      handleSelectNote={function (): {} {
                        throw new Error("Function not implemented.");
                      }}
                    />
                  );
                })}
                <MoreButton
                  color={"#47926B"}
                  handleMoreButton={handleMoreNotes}
                />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  scrollBehavior: "smooth", // Optional: for smooth scrolling
                  flexDirection: "column",
                  height: "250px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No Notes
              </div>
            )}
            <div
              style={{
                width: "200px",
                color: "white",
              }}
            >
              Sean
            </div>
          </div>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Home;

import useUserSession from "@/hooks/useUserSession";
import noteService from "@/services/noteService";
import quizServices from "@/services/quizServices";
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
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "../theme/animation.css";
import { libraryOutline, caretForwardOutline } from "ionicons/icons";

import generate_icon from "../assets/generate2.png";
import "../theme/animation.css";
import ai_icon from "../assets/robot.png";
import QuizCard from "@/components/QuizCard";
import NoteCard from "@/components/NoteCard";
import MoreButton from "@/components/Home/MoreButton";
const Home: React.FC = () => {
  const user = useUserSession();
  const [quiz, setQuiz] = useState<any>([]);
  const [note, setNotes] = useState<any>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await quizServices.getQuizzes(user.user_id as any);
        setQuiz(res);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchNotes = async () => {
      try {
        const res = await noteService.getNotes(user.user_id as any);
        setNotes(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuizzes();
    fetchNotes();
  }, []);

  return (
    <>
      <IonContent>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <section className="ion-padding">
          <IonButton routerLink="/login">Login</IonButton>
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

          <div className="">
            <h4>Recent Quizzes</h4>
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                whiteSpace: "nowrap",
                gap: "10px",
                scrollBehavior: "smooth", // Optional: for smooth scrolling
              }}
            >
              {[1, 2, 3, 4, 5].map((num, index) => {
                return <QuizCard index={index} />;
              })}
              <MoreButton color="#ECC56A" />

              <div
                style={{
                  color: "white",
                }}
              >
                Sean
              </div>
            </div>
          </div>

          <div>
            <h4>Recent Notes</h4>
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                whiteSpace: "nowrap",
                gap: "10px",
                scrollBehavior: "smooth", // Optional: for smooth scrolling
              }}
            >
              {[1, 2, 3, 4, 5].map((num, index) => {
                return <NoteCard index={index} />;
              })}
              <MoreButton color={"#47926B"} />
              <div
                style={{
                  color: "white",
                }}
              >
                Sean
              </div>
            </div>
          </div>
        </section>
      </IonContent>
    </>
  );
};

export default Home;

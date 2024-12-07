import useUserSession from "@/hooks/useUserSession";
import noteService from "@/services/noteService";
import quizServices from "@/services/quizServices";
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>home</IonContent>;
    </>
  );
};

export default Home;

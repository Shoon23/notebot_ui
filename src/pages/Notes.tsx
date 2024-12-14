import NoteCard from "@/components/NoteCard";
import AttemptQuizCard from "@/components/Quizzes/AttemptQuizCard";
import QuizCard from "@/components/Quizzes/AttemptQuizCard";
import SearchInput from "@/components/SearchInput/SearchInput";
import useUserSession from "@/hooks/useUserSession";
import noteService from "@/services/noteService";
import {
  IonContent,
  IonFab,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { createOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import NoteList from "@/components/Note/NoteList/NoteList";

const Notes = () => {
  const router = useIonRouter();
  const user = useUserSession();
  const [notes, setNotes] = useState<any>([]);

  // useEffect(() => {
  //   const fetchNotes = async () => {
  //     try {
  //       const res = await noteService.getNotes(user.user_id as any);
  //       console.log(res);
  //       setNotes(res);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchNotes();
  // }, []);
  return (
    <IonPage>
      <IonContent>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>Notes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <section className="ion-padding">
          {/* input */}
          <NoteList />
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Notes;

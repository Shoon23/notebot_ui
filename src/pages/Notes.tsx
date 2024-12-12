import NoteCard from "@/components/NoteCard";
import AttemptQuizCard from "@/components/Quiz/AttemptQuizCard";
import QuizCard from "@/components/QuizCard";
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
import "../styles/note.css";
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
          <SearchInput />
          <div
            style={{
              height: "650px",
              width: "100%",
              marginTop: "20px",
              overflow: "scroll",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {[...Array(10)].map((num, index) => {
              return <NoteCard width="360px" />;
            })}
            <br />
            <br />
            <br />
          </div>

          <IonFab
            style={{
              position: "fixed",
              bottom: "100px",
              right: "20px",
              zIndex: "5px",
            }}
            slot="fixed"
            horizontal="end"
          >
            <div className="generate-btn-container-note animated-button">
              <IonIcon
                icon={createOutline}
                color="light"
                style={{
                  fontSize: "24px",
                }}
              ></IonIcon>
            </div>
          </IonFab>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Notes;

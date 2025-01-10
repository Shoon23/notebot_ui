import NoteCard from "@/components/NoteCard";
import AttemptQuizCard from "@/components/Quizzes/AttemptQuizCard";
import QuizCard from "@/components/Quizzes/AttemptQuizCard";
import SearchInput from "@/components/SearchInput/SearchInput";
import useUserSession from "@/hooks/useUserSession";
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
  useIonViewWillEnter,
} from "@ionic/react";
import { createOutline } from "ionicons/icons";
import { useContext, useEffect, useState } from "react";
import NoteList from "@/components/Note/NoteList/NoteList";
import { StorageServiceContext } from "@/App";
import { Note } from "@/databases/models/note";

const Notes = () => {
  const router = useIonRouter();
  const user = useUserSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const storageServ = useContext(StorageServiceContext);
  useIonViewWillEnter(() => {
    const fetchNote = async () => {
      const noteList = await storageServ.noteRepo.getListOfNotes({});
      setNotes(noteList);
    };

    fetchNote();
  }, []);

  const handleSelectNote = async (note_data: {
    note_id: number;
    note_name: string;
  }) => {
    router.push(`/note/${note_data.note_id}`);
  };
  return (
    <IonPage>
      <IonContent>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>Notes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <section className="ion-padding">
          <NoteList notes={notes} handleSelectNote={handleSelectNote} />
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Notes;

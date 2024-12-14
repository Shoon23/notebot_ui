import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import "../styles/note-input.css";
import { chevronBack, colorWand } from "ionicons/icons";

interface NoteInputProp
  extends RouteComponentProps<{
    id: string;
  }> {}
const NoteInput: React.FC<NoteInputProp> = () => {
  return (
    <IonPage>
      <IonContent>
        <header className="notes-header">
          <button className="back-btn">
            <IonIcon
              icon={chevronBack}
              style={{
                fontSize: "30px",
              }}
            ></IonIcon>
            <span
              style={{
                fontSize: "20px",
              }}
            >
              Back
            </span>
          </button>

          <button className="gen-btn">
            <IonIcon
              icon={colorWand}
              style={{
                fontSize: "30px",
              }}
            ></IonIcon>
          </button>
        </header>
        <section
          style={{
            height: "94%",
          }}
        >
          <div className="note-name-container">
            <input
              className="note-name-input"
              type="text"
              placeholder="Enter Note Name..."
            />
          </div>
          <textarea className="note-input" placeholder="Enter Here...." />
        </section>
      </IonContent>
    </IonPage>
  );
};

export default NoteInput;

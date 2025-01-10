import { IonIcon, useIonRouter } from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import React from "react";
import "../styles/note-input.css";

interface HeaderProps {
  name: string;
  backRoute: string;
}
const Header: React.FC<HeaderProps> = ({ name, backRoute }) => {
  const router = useIonRouter();
  return (
    <header className="notes-header">
      <button
        className="back-btn"
        onClick={() => {
          router.push(backRoute, "back", "pop");
        }}
      >
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
      <h1
        style={{
          alignSelf: "center",
          marginTop: "60px",
        }}
      >
        {name}
      </h1>
    </header>
  );
};

export default Header;

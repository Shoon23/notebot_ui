import { IonIcon, useIonRouter } from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import React from "react";
import "../styles/note-input.css";

interface HeaderProps {
  backRoute: string;
  backBtnText?: string;
  nameComponent: React.ReactNode; // Fix: Define the correct type for nameComponent
}
const Header: React.FC<HeaderProps> = ({
  nameComponent,
  backRoute,
  backBtnText,
}) => {
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
          {backBtnText ?? "Back"}
        </span>
      </button>
      {nameComponent}
    </header>
  );
};

export default Header;

import { IonIcon } from "@ionic/react";
import { sparklesOutline, search } from "ionicons/icons";
import "./style.css";
const SearchInput = () => {
  return (
    <div className="input-container">
      <IonIcon icon={search}></IonIcon>
      <input className="search-input" placeholder="Search Here..." />
    </div>
  );
};

export default SearchInput;

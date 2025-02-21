import ChatLists from "@/pages/ChatLists";
import ChatView from "@/pages/ChatView";
import GenerateQuiz from "@/pages/GenerateQuiz";
import Home from "@/pages/Home";
import NewChat from "@/pages/NewChat";
import NoteArchived from "@/pages/NoteArchived";
import NoteInput from "@/pages/NoteInput";
import Notes from "@/pages/Notes";
import Quiz from "@/pages/Quiz";
import QuizResult from "@/pages/QuizResult";
import Quizzes from "@/pages/Quizzes";
import TakeQuiz from "@/pages/TakeQuiz";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonPage,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { render } from "@testing-library/react";
import { chatbubbles, home, fileTray, layers } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Redirect, Route, matchPath, useLocation } from "react-router-dom";

const HomePageLayout = () => {
  const [selectedTab, setSelectedTab] = useState("/home"); // Track the selected tab
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const matchedTab = tabs.find((tab) =>
      matchPath(location.pathname, { path: tab.href, exact: false })
    );

    setSelectedTab(matchedTab ? matchedTab.href : "/home");
  }, [location.pathname]);
  const tabs = [
    { tab: "home", href: "/home", icon: home, label: "Home" },
    {
      tab: "quiz",
      href: "/quizzes",
      icon: layers,
      label: "Quizzes",
    },
    { tab: "note", href: "/notes", icon: fileTray, label: "Notes" },
    { tab: "chat", href: "/chats", icon: chatbubbles, label: "Chats" },
  ];

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/home" />
        <Route path="/home" render={() => <Home />} exact />
        <Route
          path="/quizzes/:window"
          render={(props) => <Quizzes {...props} />}
          exact
        />
        <Route path="/notes" render={() => <Notes />} exact />

        <Route path="/chats" render={() => <ChatLists />} exact />

        {/* No Nav Tabs Page */}

        <Route path="/chat/:id" render={(props) => <ChatView {...props} />} />
        {/* <Route path="/new-chat/" render={() => <NewChat />} /> */}
        <Route
          path={"/note/:id"}
          render={(props) => <NoteInput {...props} />}
        />
        <Route
          path={"/note-archive/:id"}
          render={(props) => <NoteArchived {...props} />}
        />
        <Route path={"/quiz/:id"} render={(props) => <Quiz {...props} />} />
        <Route path={"/generate-quiz"} render={(props) => <GenerateQuiz />} />

        <Route
          path={"/take-quiz/:id"}
          render={(props) => <TakeQuiz {...props} />}
        />
        <Route
          path={"/quiz-result/:id"}
          render={(props) => <QuizResult {...props} />}
        />
      </IonRouterOutlet>

      {tabs.some((tab) =>
        matchPath(location.pathname, { path: tab.href, exact: false })
      ) && (
        <IonTabBar
          color={"warning"}
          slot="bottom"
          style={{
            position: "fixed",
            bottom: "10px",
            left: "3%", // Add space from the left side of the screen
            right: "3%", // Add space from the right side of the screen
            zIndex: "10",
            boxShadow: "rgba(0, 0, 0, 0.3)", // Floating effect
            border: "2px solid black", // Black border around the tab bar

            borderRadius: "15px",
          }}
        >
          {tabs.map((tabItem) => {
            const isSelected = location.pathname.startsWith(tabItem.href);

            let href = tabItem.href;
            if (href === "/quizzes") {
              href = "/quizzes/generated_quiz";
            }
            const animationStyles = isSelected
              ? {
                  animationName: "bookOpen",
                  animationDuration: "0.5s",
                  animationTimingFunction: "ease",
                  animationFillMode: "forwards",
                }
              : {};

            const keyframes = `
           @keyframes bookOpen {
        0% {
          background-color: transparent;
          transform: scaleX(0); /* Start from no width */
        } 
          25%{
          transform: scaleX(0.5); /* Slight overshoot for animation effect */
         
        }
        50% {
          background-color: #87CEEB; /* Blue transition */
          transform: scaleX(0.8); /* Slight overshoot for animation effect */
        }
      
      }
        `;
            return (
              <IonTabButton
                key={tabItem.tab}
                tab={tabItem.tab}
                href={href}
                onClick={() => handleTabClick(tabItem.href)}
                style={{
                  display: "flex",
                  flexDirection: "row", // Position label to the right of the icon
                  alignItems: "center", // Center the icon and label vertically
                  justifyContent: "center", // Center the entire content horizontally
                  padding: "10px",
                  border: isSelected && "2px solid black", // Black border around the tab bar

                  backgroundColor: isSelected ? "#87CEEB" : "transparent", // Sky blue for selected
                  borderRadius: "12px", // Add slight rounding for selected tabs
                  transition: "background-color 0.3s ease",
                  transform: isSelected ? "scale(0.8)" : "scale(1)", // Make it smaller when selected
                  ...animationStyles, // Add animation styles
                }}
              >
                <IonIcon
                  icon={tabItem.icon}
                  style={{
                    fontSize: isSelected ? "20px" : "24px", // Smaller icon size when selected
                    color: isSelected ? "#FFFFFF" : "#000000",
                    display: "flex",
                  }}
                />
                {isSelected && (
                  <IonLabel
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginLeft: "8px", // Add space between icon and label
                      color: "#FFFFFF", // White text for labels on selected
                      marginTop: "8px", // Add slight spacing between icon and label
                    }}
                  >
                    {tabItem.label}
                  </IonLabel>
                )}
                <style>{keyframes}</style>
              </IonTabButton>
            );
          })}
        </IonTabBar>
      )}
    </IonTabs>
  );
};
export default HomePageLayout;

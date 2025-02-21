import React from "react";
import { IonApp, setupIonicReact, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Filesystem, Directory } from "@capacitor/filesystem";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional CSS utils */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
/* Theme variables */
import "./theme/variables.css";

// React Query Init
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Routes from "./Routes";
import HomePageLayout from "./components/layouts/HomePageLayout";
import Quiz from "./pages/Quiz";
import NoteInput from "./pages/NoteInput";
import SqliteService from "./services/sqliteService";
import DbVersionService from "./services/dbVersionService";
import StorageService from "./services/storageService";
import AppInitializer from "./components/AppInitializer/AppInitializer";
import GenerateQuiz from "./pages/GenerateQuiz";
import TakeQuiz from "./pages/TakeQuiz";
import QuizResult from "./pages/QuizResult";

// Singleton Services
export const SqliteServiceContext = React.createContext(SqliteService);
export const DbVersionServiceContext = React.createContext(DbVersionService);
export const StorageServiceContext = React.createContext(
  new StorageService(SqliteService, DbVersionService)
);

// In your index.tsx or App.tsx (run this once at startup)
setupIonicReact();

const App: React.FC = () => {
  return (
    <SqliteServiceContext.Provider value={SqliteService}>
      <DbVersionServiceContext.Provider value={DbVersionService}>
        <StorageServiceContext.Provider
          value={new StorageService(SqliteService, DbVersionService)}
        >
          <AppInitializer>
            <IonApp>
              <IonReactRouter>
                <IonRouterOutlet>
                  <HomePageLayout />
                </IonRouterOutlet>
              </IonReactRouter>
            </IonApp>
          </AppInitializer>
        </StorageServiceContext.Provider>
      </DbVersionServiceContext.Provider>
    </SqliteServiceContext.Provider>
  );
};

export default App;

import { Redirect, Route, Switch } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Login from "./pages/Login";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
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
import Register from "./pages/Register";
import HomePageLayout from "./components/layouts/HomePageLayout";

setupIonicReact();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
});

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <QueryClientProvider client={queryClient}>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            {/* <Routes /> */}
            <HomePageLayout />

            <Route exact path="/login">
              <Login />
            </Route>

            <Route exact path="/register">
              <Register />
            </Route>
          </QueryClientProvider>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

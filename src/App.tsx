import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "./theme/index.css";
// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Quiz from "./pages/Quiz";
// Layout
import Layout from "./components/layouts/Layout";
import GenerateQuiz from "./pages/GenerateQuiz";
import ViewQuiz from "./pages/ViewQuiz";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Layout>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/quiz">
            <Quiz />
          </Route>
          <Route exact path="/quiz/generate">
            <GenerateQuiz />
          </Route>
          <Route exact path="/quiz/view">
            <ViewQuiz />
          </Route>
        </Layout>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;

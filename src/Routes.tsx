import React from "react";
import { Switch, Route, Redirect, useLocation } from "react-router";
import GenerateQuiz from "./pages/GenerateQuiz";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Register from "./pages/Register";
import ViewQuiz from "./pages/ViewQuiz";
import Layout from "./components/layouts/Layout";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import AttemptViewQuiz from "./pages/AttemptViewQuiz";
import _404 from "./pages/_404";
import Notes from "./pages/Notes";
import UploadNote from "./pages/UploadNote";

const Routes = () => {
  return (
    <>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <AuthMiddleware>
          <Layout>
            <Route exact path="/home" component={Home} />
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            <Route exact path="/quiz" component={Quiz} />
            <Route exact path="/quiz/generate" component={GenerateQuiz} />
            <Route exact path="/quiz/view/:quizId" component={ViewQuiz} />
            <Route exact path="/quiz/attempt" component={AttemptViewQuiz} />
            <Route exact path="/notes" component={Notes} />
            <Route exact path="/notes/upload" component={UploadNote} />
          </Layout>
        </AuthMiddleware>
        <Route exact path="*" component={_404} />
      </Switch>
    </>
  );
};

export default Routes;

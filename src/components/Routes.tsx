import React from "react";
import { Switch, Route, Redirect, useLocation } from "react-router";
import GenerateQuiz from "../pages/GenerateQuiz";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Quiz from "../pages/Quiz";
import Register from "../pages/Register";
import ViewQuiz from "../pages/ViewQuiz";
import Layout from "./layouts/Layout";

const Routes = () => {
  const location = useLocation();

  const noLayoutPaths = ["/login", "/register"];
  return (
    <>
      {noLayoutPaths.includes(location.pathname) ? (
        // Render without Layout for specific paths
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      ) : (
        // Render with Layout for all other paths
        <Layout>
          <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            <Route exact path="/quiz" component={Quiz} />
            <Route exact path="/quiz/generate" component={GenerateQuiz} />
            <Route exact path="/quiz/view" component={ViewQuiz} />
          </Switch>
        </Layout>
      )}
    </>
  );
};

export default Routes;

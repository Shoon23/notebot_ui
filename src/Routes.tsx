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

const Routes = () => {
  return (
    <>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Layout>
          <AuthMiddleware>
            <Route exact path="/home" component={Home} />
            <Route exact path="/" render={() => <Redirect to="/home" />} />{" "}
            <Route exact path="/quiz" component={Quiz} />
            <Route exact path="/quiz/generate" component={GenerateQuiz} />{" "}
            <Route exact path="/quiz/view" component={ViewQuiz} />{" "}
            {/* Add a fallback 404 route to catch invalid URLs */}
            <Route render={() => <div>404 - Page Not Found</div>} />
          </AuthMiddleware>
        </Layout>
      </Switch>
    </>
  );
};

export default Routes;

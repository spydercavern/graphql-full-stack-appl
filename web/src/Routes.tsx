import React from "react";
import { useHelloQuery } from "./generated/graphql";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Register from "./pages/Register";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";

const App: React.FC = () => {
  const { data, loading } = useHelloQuery();
  if (loading || !data) {
    return <div> loading...</div>;
  }
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={LoginPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;

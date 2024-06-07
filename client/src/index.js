import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Header from "./components/Header";
import RecipeForm from "./components/RecipeForm";
import ErrorPage from "./error-page";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import Profile from "./routes/Profile";
import Recipe from "./routes/Recipe";
import Register from "./routes/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },

  {
    path: "recipes",
    element: <Recipe />,
  },
  {
    path: "recipes/:recipeId",
    element: <Recipe />,
  },
  {
    path: "recipes/create",
    element: <RecipeForm />,
  },
  {
    path: "recipes/edit/:recipeId",
    element: <RecipeForm />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "logout",
    element: <Logout />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "404",
    element: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Header />
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import BasicGrid from "./components/CharterUpdation.tsx";
import Home from "./components/Home.tsx";
import Login from "./components/Login.tsx";
import AdminWrapper from "./components/Project/Admin.tsx";
import ProjectDetails from "./components/Project/ProjectDetails.tsx";
import YGridWrapper from "./components/Project/YPage.tsx";
import Training from "./components/Training/Training.tsx";
import "./index.css";
import store from "./services/GlobalStateService.ts";
import MediaGridWrapper from "./commons/Grids/MediaPage.tsx";

const routes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <App />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "media",
        element: <MediaGridWrapper />,
      },
      {
        path: "problem_bank",
        element: <YGridWrapper />,
      },
      {
        path: "project",
        element: <AdminWrapper />,
      },
      {
        path: "project_details",
        element: <ProjectDetails />,
      },
      {
        path: "charter_update/:data",
        element: <BasicGrid />,
      },
      {
        path: "trainings",
        element: <Training />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);

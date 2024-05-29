import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import MediaGridFixWrapper from "./commons/Grids/Media2/MediaPageFix.tsx";
import MediaGridWrapper from "./commons/Grids/MediaPage.tsx";
import BasicGrid from "./components/CharterUpdation.tsx";
import Home from "./components/Home.tsx";
import Login from "./components/Login.tsx";
import AdminWrapper from "./components/Project/Admin.tsx";
import PDFGenrator from "./components/Project/PDFGen.tsx";
import ProjectDetails from "./components/Project/ProjectDetails.tsx";
import YGridWrapper from "./components/Project/YPage.tsx";
import ZGridWrapper from "./components/Project/ZPage.tsx";
import RolePermissions from "./components/RolePermissions.tsx";
import SessionTimeout from "./components/SessionExpire.tsx";
import Training from "./components/Training/Training.tsx";
import "./index.css";
import store from "./services/GlobalStateService.ts";
import ReportGrid from "./components/Project/ReportGrid.tsx";
import SimpleReportGrid from "./components/Project/SimpleReportGrid.tsx";
import { UserRoleProvider } from "./contexts/userContextProvider.tsx";
import XYParent from "./components/Project/GridHirarchy/XYParent.tsx";
import GridTable from "./components/GridTable.tsx";

const routes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/session_timeout",
    element: <SessionTimeout />,
  },
  {
    path: "grid_table",
    element: <GridTable />,
  },
  {
    path: "/dashboard",
    element: (
      <UserRoleProvider>
        <App />
      </UserRoleProvider>
    ),
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "z_grid",
        element: <ZGridWrapper />,
      },
      {
        path: "pdf_gen",
        element: <PDFGenrator />,
      },
      {
        path: "media_fix",
        element: <MediaGridFixWrapper />,
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
      {
        path: "permission_manage",
        element: <RolePermissions />,
      },
      {
        path: "reporting",
        element: <ReportGrid />,
      },
      {
        path: "simple_reporting",
        element: <SimpleReportGrid />,
      },
      {
        path: "grid_hirarchy",
        element: <XYParent />,
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

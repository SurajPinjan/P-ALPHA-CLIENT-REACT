import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import BasicGrid from './components/CharterUpdation.tsx'
import Home from './components/Home.tsx'
import Login from './components/Login.tsx'
import Admin from './components/Project/Project.tsx'
import ProjectDetails from './components/Project/ProjectDetails.tsx'
import Training from './components/Training/Training.tsx'
import ProblemBank from './components/problemBank/ProblemBank.tsx'
import './index.css'

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
        path: "problem_bank",
        element: <ProblemBank />,
      },
      {
        path: "project",
        element: <Admin />,
      },
      {
        path: "project_details",
        element: <ProjectDetails />,
      },
      {
        path: "charter_update",
        element: <BasicGrid />,
      },
      {
        path: "training",
        element: <Training />,
      }
    ],
  },
]

const router = createBrowserRouter(routes);

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />
  // <React.StrictMode>
  //   <RouterProvider router={router} />
  // </React.StrictMode>
)

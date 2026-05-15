import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import AddUser from "./pages/AddUser";
import Gallery from "./pages/Gallery";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-user",
    element: (
      <ProtectedRoute>
        <AddUser />
      </ProtectedRoute>
    ),
  },
  {
    path: "/gallery",
    element: (
      <ProtectedRoute>
        <Gallery />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function MainApp() {
  return <RouterProvider router={router} />;
}

export default MainApp;

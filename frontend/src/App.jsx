import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import CreateResume from "./pages/CreateResume";
import ResumeScore from "./components/resume/ResumeScore";
import EditResume from "./pages/EditResume";

function App() {
  const { isAuthenticated } = useAuth();

  return (
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Home />
            )
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/resume/create"
          element={
            isAuthenticated ? (
              <CreateResume />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/resume/score/:resumeId"
          element={
            isAuthenticated ? (
              <ResumeScore />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/resume/edit/:resumeId"
          element={
            isAuthenticated ? (
              <EditResume />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
  );
}

export default App;
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import CreateResume from "./pages/CreateResume";
import ResumeScore from "./components/resume/ResumeScore";
import EditResume from "./pages/EditResume";
function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/resume/create"
          element={<CreateResume />}
        />
        <Route
          path="/resume/score/:resumeId"
          element={<ResumeScore />}
        />
        <Route
          path="/resume/edit/:resumeId"
          element={<EditResume />}
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
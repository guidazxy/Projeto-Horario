import { useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import ThemeProvider from "./components/ThemeContext";
import LoginPortal from "./components/LoginPortal";
import Workspace from "./components/Workspace";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <ThemeProvider>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to={user.role === "professor" ? "/professor" : "/aluno"} replace /> : <LoginPortal onAuth={setUser} />}
          />
          <Route
            path="/professor"
            element={user?.role === "professor" ? <Workspace user={user} onLogout={() => setUser(null)} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/aluno"
            element={user?.role === "aluno" ? <Workspace user={user} onLogout={() => setUser(null)} /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;

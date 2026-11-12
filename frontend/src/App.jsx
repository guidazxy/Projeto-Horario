import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import ThemeProvider from "./components/ThemeContext";
import LoginPortal from "./components/LoginPortal";
import "./index.css";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("academi_token");
    if (!token) return;
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("unauth");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        const role = data.role;
        role === "professor" ? navigate("/professor") : navigate("/aluno");
      })
      .catch(() => {
        localStorage.removeItem("academi_token");
        setUser(null);
        navigate("/");
      });
  }, [navigate]);

  return (
    <ThemeProvider>
      {user ? (
        <Router>
          <Routes>
            <Route path="/professor" element={<ProfessorDashboard user={user} />} />
            <Route path="/aluno" element={<AlunoPortal user={user} />} />
          </Routes>
        </Router>
      ) : (
        <LoginPortal onAuth={setUser} />
      )}
    </ThemeProvider>
  );
}

export default App;

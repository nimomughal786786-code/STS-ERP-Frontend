import { useState } from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login/login";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <Routes>

      {/* Login */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      {/* Main App */}
      <Route
        path="/*"
        element={
          user ? (
            <AppRoutes user={user} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

    </Routes>
  );
}

export default App;
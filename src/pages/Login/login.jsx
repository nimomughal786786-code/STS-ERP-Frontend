import { useState } from "react";

function Login({ onLogin }) {
const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const em = email.trim();
    const pw = password;

    // Temporary frontend authentication.
    // Later this will be replaced with backend API authentication.
    const adminEmail = "demo@sts.com";
const adminPassword = "demo123";
    if (em === adminEmail && pw === adminPassword) {
      setError("");

      if (onLogin) {
  onLogin({
    name: "Demo User",
    role: "superadmin",
    avatar: "DU",
  });
}

      return;
    }

    setError("Invalid email or password.");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      id="LG"
      style={{
        position: "fixed",
        inset: 0,
        background:
          "linear-gradient(135deg,#040e1a 0%,#0a3d62 60%,#1565a8 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "2.4rem 2.1rem",
          width: "100%",
          maxWidth: "390px",
          boxShadow: "0 30px 80px rgba(0,0,0,.45)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "1.7rem",
          }}
        >
          <div
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "1.05rem",
              color: "#0a3d62",
            }}
          >
            Smart Trading{" "}
            <span style={{ color: "#F0A500" }}>Solutions</span>
          </div>

          <div
            style={{
              fontSize: ".66rem",
              color: "#94a3b8",
              letterSpacing: ".09em",
              textTransform: "uppercase",
              marginTop: ".22rem",
            }}
          >
            ERP Admin Portal — Secure Access
          </div>
        </div>

        <div
          id="LGE"
          style={{
            fontSize: ".76rem",
            color: "#dc2626",
            textAlign: "center",
            minHeight: "1.2em",
            marginBottom: ".4rem",
          }}
        >
          {error}
        </div>

        <div style={{ marginBottom: ".82rem" }}>
          <label
            style={{
              display: "block",
              fontSize: ".7rem",
              fontWeight: 600,
              color: "#64748b",
              marginBottom: ".25rem",
            }}
          >
            Email Address
          </label>

          <input
            type="email"
            id="LGI"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              borderRadius: "9px",
              padding: ".66rem 1rem",
              fontSize: ".87rem",
              outline: "none",
            }}
            placeholder="admin@email.com"
          />
        </div>

        <div style={{ marginBottom: ".9rem" }}>
          <label
            style={{
              display: "block",
              fontSize: ".7rem",
              fontWeight: 600,
              color: "#64748b",
              marginBottom: ".25rem",
            }}
          >
            Password
          </label>

          <input
            type="password"
            id="LGP"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              borderRadius: "9px",
              padding: ".66rem 1rem",
              fontSize: ".87rem",
              outline: "none",
            }}
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            background: "#0a3d62",
            color: "#fff",
            fontFamily: "'Syne',sans-serif",
            fontWeight: 700,
            fontSize: ".88rem",
            padding: ".8rem",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Sign In →
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: ".66rem",
            color: "#94a3b8",
            marginTop: "1.2rem",
          }}
        >
Demo Email: demo@sts.com · Password: demo123        </p>
      </div>
    </div>
  );
}

export default Login;
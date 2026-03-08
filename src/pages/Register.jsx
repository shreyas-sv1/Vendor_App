import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function isDarkMode() {
  try {
    return document.documentElement.classList.contains("dark");
  } catch (e) {
    return false;
  }
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(isDarkMode());
    const handleDarkModeToggle = () => setIsDark(isDarkMode());
    window.addEventListener("darkModeToggled", handleDarkModeToggle);
    return () => window.removeEventListener("darkModeToggled", handleDarkModeToggle);
  }, []);

  const validateEmail = (email) => {
    return email.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validatePassword = (pass) => {
    return pass.length >= 6;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !confirmPass) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      window.location.href = "/profile-setup";
    }, 1500);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* TITLE */}
        <h1 style={styles.bigTitle}>Hello! Register Here</h1>
        <p style={styles.subtitle}>Create your vendor account</p>

        {/* FORM */}
        <form style={styles.form} onSubmit={handleRegister}>
          {error && <p style={styles.error}>{error}</p>}

          <input
            type="text"
            placeholder="Username"
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="text"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm password"
            style={styles.input}
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* SOCIAL LOGIN */}
        <p style={styles.orText}>Or Register with</p>

        <div style={styles.socialRow}>
          <div style={styles.socialBox}>f</div>
          <div style={styles.socialBox}>G</div>
          <div style={styles.socialBox}></div>
        </div>

        {/* FOOTER */}
        <p style={styles.bottomText}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>Login Now</Link>
        </p>
      </div>
    </div>
  );
}

/* ---------------- THEME & STYLES ------------------ */

const getLightTheme = () => ({
  primary: "#FF8A00",
  primaryDark: "#E87C00",
  primarySoft: "#FFB267",
  success: "#00B34A",
  white: "#FFFFFF",
  bg: "#F7F8FC",
  text: "#1A1A1A",
  muted: "#7A8593",
  border: "#EBEBEB",
  cardShadow: "rgba(16, 24, 40, 0.08)",
});

const getDarkTheme = () => ({
  primary: "#FF8A00",
  primaryDark: "#E87C00",
  primarySoft: "#FFB267",
  success: "#00B34A",
  white: "#FFFFFF",
  bg: "#0D1117",
  text: "#E8E8E8",
  muted: "#A8B0BD",
  border: "#30363D",
  cardShadow: "rgba(0, 0, 0, 0.3)",
});

const THEME = isDarkMode() ? getDarkTheme() : getLightTheme();

const currentTheme = isDark ? getDarkTheme() : getLightTheme();
const styles = {
  page: {
    background: currentTheme.bg,
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },

  container: {
    width: "100%",
    maxWidth: "440px",
    background: isDark ? "#161B22" : currentTheme.white,
    padding: "40px 28px",
    margin: "0 auto",
    borderRadius: "20px",
    marginTop: "40px",
    boxShadow: `0 4px 12px ${currentTheme.cardShadow}`,
    border: `1px solid ${currentTheme.border}`,
  },

  bigTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: currentTheme.text,
    textAlign: "center",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    textAlign: "center",
    color: currentTheme.muted,
    marginBottom: "32px",
    fontSize: "15px",
    fontWeight: "500",
  },

  form: {
    width: "100%",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: "14px",
    border: `1px solid ${currentTheme.border}`,
    borderRadius: "12px",
    fontSize: "15px",
    backgroundColor: isDark ? "#0D1117" : currentTheme.white,
    outline: "none",
    color: currentTheme.text,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box",
    lineHeight: "1.5",
    boxShadow: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: `linear-gradient(135deg, ${currentTheme.primaryDark} 0%, ${currentTheme.primary} 100%)`,
    border: "none",
    color: currentTheme.white,
    fontSize: "16px",
    fontWeight: "700",
    borderRadius: "12px",
    cursor: "pointer",
    marginTop: "8px",
    marginBottom: "24px",
    boxShadow: `0 4px 12px ${currentTheme.cardShadow}`,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  orText: {
    textAlign: "center",
    color: currentTheme.muted,
    marginBottom: "18px",
    fontSize: "14px",
    fontWeight: "600",
  },

  socialRow: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "24px",
  },

  socialBox: {
    width: "52px",
    height: "52px",
    background: isDark ? "#161B22" : currentTheme.white,
    borderRadius: "14px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    cursor: "pointer",
    border: `1.5px solid ${currentTheme.border}`,
    transition: "all 0.2s ease",
    boxShadow: `0 4px 12px ${currentTheme.cardShadow}`,
  },

  bottomText: {
    textAlign: "center",
    fontSize: "15px",
    color: currentTheme.muted,
    fontWeight: "500",
  },

  link: {
    color: currentTheme.primary,
    fontWeight: "800",
    textDecoration: "none",
  },

  error: {
    background: isDark ? "rgba(255, 138, 0, 0.15)" : `${currentTheme.primarySoft}20`,
    color: isDark ? "#FFB267" : currentTheme.primaryDark,
    padding: "12px 16px",
    borderRadius: "12px",
    textAlign: "center",
    marginBottom: "18px",
    fontSize: "14px",
    fontWeight: "600",
    border: `1px solid ${isDark ? "#FFB267" : currentTheme.primarySoft}`,
  },
};

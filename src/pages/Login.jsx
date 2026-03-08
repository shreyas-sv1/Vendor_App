import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function isDarkMode() {
  try {
    return document.documentElement.classList.contains("dark");
  } catch (e) {
    return false;
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(isDarkMode());
    const handleDarkModeToggle = () => setIsDark(isDarkMode());
    window.addEventListener("darkModeToggled", handleDarkModeToggle);
    return () => window.removeEventListener("darkModeToggled", handleDarkModeToggle);
  }, []);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER TEXT */}
        <h1 style={styles.title}>Welcome Back!</h1>
        <p style={styles.subtitle}>Login to continue your vendor journey</p>

        {/* FORM */}
        <form style={styles.form} onSubmit={handleLogin}>
          {error && <p style={styles.error}>{error}</p>}

          <input
            type="text"
            placeholder="Email Address"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              style={styles.passwordInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              style={styles.showHide}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {/* REMEMBER ME + FORGOT */}
          <div style={styles.rowBetween}>
            <label style={styles.rememberLabel}>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <span style={{ marginLeft: 6 }}>Remember Me</span>
            </label>

            <span
  style={styles.forgot}
  onClick={() => (window.location.href = "/reset-password")}
>
  Forgot Password?
</span>

          </div>

          {/* LOGIN BUTTON */}
          <button style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* OR DIVIDER */}
        <div style={styles.dividerContainer}>
          <div style={styles.line}></div>
          <span style={styles.or}>OR</span>
          <div style={styles.line}></div>
        </div>

        {/* SOCIAL LOGIN */}
        <div style={styles.socialRow}>
          <div style={styles.socialBox}>f</div>
          <div style={styles.socialBox}>G</div>
          <div style={styles.socialBox}></div>
        </div>

        {/* FOOTER */}
        <p style={styles.bottomText}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register Now
          </Link>
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

const styles = {
  page: {
    background: currentTheme.bg,
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },

  container: {
    width: "100%",
    maxWidth: "440px",
    background: isDark ? "#161B22" : currentTheme.white,
    padding: "40px 28px",
    borderRadius: "20px",
    boxShadow: `0 4px 12px ${currentTheme.cardShadow}`,
    border: `1px solid ${currentTheme.border}`,
  },

  title: {
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "8px",
    color: currentTheme.text,
    textAlign: "center",
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
    color: currentTheme.text,
    outline: "none",
    boxShadow: "none",
    boxSizing: "border-box",
    lineHeight: "1.5",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  passwordContainer: {
    position: "relative",
    marginBottom: "14px",
  },

  passwordInput: {
    width: "100%",
    padding: "12px 14px",
    paddingRight: "80px",
    border: `1px solid ${currentTheme.border}`,
    borderRadius: "12px",
    backgroundColor: isDark ? "#0D1117" : currentTheme.white,
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    boxShadow: "none",
    color: currentTheme.text,
    lineHeight: "1.5",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  showHide: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: currentTheme.primary,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },

  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "10px",
  },

  rememberLabel: {
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    color: currentTheme.text,
    fontWeight: "500",
  },

  forgot: {
    fontSize: "14px",
    color: currentTheme.primary,
    cursor: "pointer",
    fontWeight: "700",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: `linear-gradient(135deg, ${currentTheme.primaryDark} 0%, ${currentTheme.primary} 100%)`,
    color: currentTheme.white,
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "24px",
    boxShadow: `0 4px 12px ${currentTheme.cardShadow}`,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  dividerContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },

  line: {
    flex: 1,
    height: "1px",
    background: currentTheme.border,
  },

  or: {
    margin: "0 12px",
    color: currentTheme.muted,
    fontSize: "13px",
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
    border: `1.5px solid ${currentTheme.border}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    cursor: "pointer",
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

import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

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
    <div style={styles.wrapper}>
      <div style={styles.container}>

        <h1 style={styles.title}>Welcome Back!</h1>
        <p style={styles.subtitle}>Login to continue your vendor journey</p>

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

          <div style={styles.rowBetween}>
            <label style={styles.rememberLabel}>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <span style={{ marginLeft: 6 }}>Remember Me</span>
            </label>

            <span style={styles.forgot}>Forgot Password?</span>
          </div>

          <button style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={styles.dividerContainer}>
          <div style={styles.line}></div>
          <span style={styles.or}>OR</span>
          <div style={styles.line}></div>
        </div>

        <div style={styles.socialRow}>
          <div style={styles.socialBox}>f</div>
          <div style={styles.socialBox}>G</div>
          <div style={styles.socialBox}></div>
        </div>

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

/* ---------------- STYLES ------------------ */

const styles = {
  wrapper: {
    width: "100%",
    height: "100vh",
    background: "#fafafa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  container: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    padding: "40px 30px",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "4px",
  },

  subtitle: {
    color: "#555",
    marginBottom: "25px",
  },

  form: {
    width: "100%",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    fontSize: "15px",
  },

  passwordContainer: {
    position: "relative",
    width: "100%",
    marginBottom: "15px",
  },

  passwordInput: {
    width: "100%",
    padding: "14px",
    paddingRight: "60px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    fontSize: "15px",
  },

  showHide: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#ff8a00",
    cursor: "pointer",
    fontWeight: "600",
  },

  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  rememberLabel: {
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
  },

  forgot: {
    fontSize: "14px",
    color: "#ff8a00",
    cursor: "pointer",
    fontWeight: "600",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#ff8a00",
    color: "white",
    border: "none",
    borderRadius: "50px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "25px",
  },

  dividerContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },

  line: {
    flex: 1,
    height: "1px",
    background: "#ddd",
  },

  or: {
    margin: "0 10px",
    color: "#888",
    fontSize: "14px",
  },

  socialRow: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "25px",
  },

  socialBox: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "22px",
    cursor: "pointer",
    border: "1px solid #ddd",
  },

  bottomText: {
    textAlign: "center",
    fontSize: "14px",
  },

  link: {
    color: "#05a502",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
  },

  error: {
    background: "#ffd2d2",
    color: "#b30000",
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "14px",
  },
};

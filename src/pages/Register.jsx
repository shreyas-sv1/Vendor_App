import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
;

    }, 1500);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>

        {/* UPDATED TITLE */}
        <h1 style={styles.bigTitle}>Hello! Register Here</h1>
        <p style={styles.subtitle}>Create your vendor account</p>

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

        <p style={styles.orText}>Or Register with</p>

        <div style={styles.socialRow}>
          <div style={styles.socialBox}>f</div>
          <div style={styles.socialBox}>G</div>
          <div style={styles.socialBox}></div>
        </div>

        <p style={styles.bottomText}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>Login Now</Link>
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
    boxShadow: "0 8px 20px rgba(255, 255, 255, 1)",
  },

  bigTitle: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#ff8a00",
    textAlign: "center",
    marginBottom: "5px",
  },

  subtitle: {
    textAlign: "center",
    color: "#ffffffff",
    marginBottom: "25px",
    fontSize: "15px",
  },

  form: {
    width: "100%",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "14px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    fontSize: "15px",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#ff8a00",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "50px",
    cursor: "pointer",
    marginTop: "5px",
    marginBottom: "20px",
  },

  orText: {
    textAlign: "center",
    color: "#ffffffff",
    marginBottom: "15px",
  },

  socialRow: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "15px",
  },

  socialBox: {
    width: "45px",
    height: "45px",
    background: "#f5f5f5",
    borderRadius: "12px",
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
    cursor: "pointer",
    fontWeight: "600",
    textDecoration: "none",
  },

  error: {
    background: "#ffd2d2",
    color: "#b30000",
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
    marginBottom: "15px",
  },
};

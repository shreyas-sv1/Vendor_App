import React, { useState } from "react";
import BackButton from "../components/BackButton";

export default function ResetPassword() {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  // STEP 1: Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    setError("");

    if (phone.length !== 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    // Backend will send OTP here...
    setStep("otp");
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    setStep("password");
  };

  // STEP 3: Set New Password
  const handleSetPassword = (e) => {
    e.preventDefault();
    setError("");

    if (pass.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (pass !== confirm) {
      setError("Passwords do not match");
      return;
    }

    // Simulate backend update
    setStep("success");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1200);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <BackButton fallback="/login" />
          <div style={{ fontWeight: 800 }} />
        </div>

        {/* STEP 1 — PHONE NUMBER */}
        {step === "phone" && (
          <>
            <h2 style={styles.title}>Reset Password</h2>
            <p style={styles.subtitle}>Enter phone number to receive OTP</p>

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSendOtp}>
              <input
                type="number"
                placeholder="Phone Number"
                style={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <button style={styles.button}>Send OTP</button>
            </form>

            <p style={styles.link} onClick={() => (window.location.href = "/login")}>
              ← Back to Login
            </p>
          </>
        )}

        {/* STEP 2 — OTP INPUT */}
        {step === "otp" && (
          <>
            <h2 style={styles.title}>Verify OTP</h2>
            <p style={styles.subtitle}>OTP sent to {phone}</p>

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleVerifyOtp}>
              <input
                type="number"
                placeholder="Enter OTP"
                style={styles.input}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button style={styles.button}>Verify OTP</button>
            </form>

            <p style={styles.link} onClick={() => setStep("phone")}>
              Resend OTP
            </p>
          </>
        )}

        {/* STEP 3 — NEW PASSWORD */}
        {step === "password" && (
          <>
            <h2 style={styles.title}>Create New Password</h2>

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSetPassword}>
              <input
                type="password"
                placeholder="New Password"
                style={styles.input}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                style={styles.input}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />

              <button style={styles.button}>Update Password</button>
            </form>
          </>
        )}

        {/* STEP 4 — SUCCESS SCREEN */}
        {step === "success" && (
          <div style={{ textAlign: "center" }}>
            <h2 style={styles.title}>🎉 Password Updated</h2>
            <p style={styles.subtitle}>Redirecting to login...</p>
          </div>
        )}

      </div>
    </div>
  );
}

/* ---------------- STYLES ------------------ */

const styles = {
  page: {
    background: "#F5F7FC",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    padding: 30,
    borderRadius: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: 800,
    color: "#ff8a00",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    border: "1px solid #ddd",
    background: "#fafafa",
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 15,
    background: "#ff8a00",
    border: "none",
    borderRadius: 50,
    color: "#fff",
    fontWeight: 700,
    fontSize: 17,
    cursor: "pointer",
    marginBottom: 20,
  },
  link: {
    textAlign: "center",
    color: "#ff8a00",
    fontWeight: 700,
    cursor: "pointer",
  },
  error: {
    background: "#ffe5e5",
    color: "#b30000",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    textAlign: "center",
  },
};

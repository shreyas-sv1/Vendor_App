import React from "react";
import BackButton from "../components/BackButton";

export default function LocationSetup() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* IMAGE */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
          alt="map"
          style={styles.image}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <BackButton />
          <h2 style={styles.title}>Set your location</h2>
        </div>

        {/* SUBTITLE */}
        <p style={styles.subtitle}>
          This helps us detect your location for better reach and faster service.
        </p>

        {/* BUTTONS */}
        <button
          style={styles.primaryButton}
          onClick={() => (window.location.href = "/notifications")}
        >
          Allow Google Maps
        </button>

        <button
          style={styles.secondaryButton}
          onClick={() => (window.location.href = "/notifications")}
        >
          Set Manually
        </button>

      </div>
    </div>
  );
}

/* ---------------- STYLES ------------------ */

const styles = {
  page: {
    background: "#F5F7FC",
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    padding: "35px 25px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(15, 20, 25, 0.06)",
    border: "1px solid #E8EAED",
  },

  image: {
    width: "170px",
    marginBottom: "25px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "800",
    marginBottom: "10px",
    color: "#222",
  },

  subtitle: {
    fontSize: "15px",
    color: "#666",
    marginBottom: "30px",
    padding: "0 10px",
  },

  primaryButton: {
    width: "100%",
    padding: "16px",
    background: "#ff8a00",
    borderRadius: "50px",
    border: "none",
    color: "#fff",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "18px",
    boxShadow: "0 5px 12px rgba(255,138,0,0.3)",
  },

  secondaryButton: {
    width: "100%",
    padding: "16px",
    background: "#f0f0f0",
    borderRadius: "50px",
    border: "none",
    color: "#555",
    fontSize: "17px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

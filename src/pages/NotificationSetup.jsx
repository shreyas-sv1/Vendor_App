import React from "react";

export default function NotificationSetup() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        
        {/* IMAGE */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/941/941592.png"
          style={styles.image}
        />

        {/* TITLE */}
        <h2 style={styles.title}>Lastly, please<br />enable notification</h2>

        {/* SUBTITLE */}
        <p style={styles.subtitle}>
          Enable your notifications for more updates and important messages about your vendor activity.
        </p>

        {/* BUTTONS */}
        <button
          style={styles.primaryButton}
          onClick={() => (window.location.href = "/dashboard")}
        >
          Enable Notifications
        </button>

        <button
          style={styles.secondaryButton}
          onClick={() => (window.location.href = "/dashboard")}
        >
          Skip For Now
        </button>

      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    height: "100vh",
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  container: {
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
  },

  image: {
    width: "180px",
    marginBottom: "30px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "10px",
    lineHeight: "32px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#777",
    marginBottom: "35px",
  },

  primaryButton: {
    width: "100%",
    padding: "14px",
    background: "#ff8a00",
    borderRadius: "40px",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "15px",
    cursor: "pointer",
  },

  secondaryButton: {
    width: "100%",
    padding: "14px",
    background: "#eee",
    borderRadius: "40px",
    border: "none",
    color: "#555",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

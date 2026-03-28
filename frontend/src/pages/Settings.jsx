// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const COLORS = {
  primary: "#FF8A00",
  primaryDark: "#E87C00",
  primarySoft: "#FFB267",
  success: "#00B34A",
  white: "#FFFFFF",
  bg: "#F5F7FC",
  text: "#0F1419",
  muted: "#8B92A1",
  border: "#E8EAED",
  cardShadow: "rgba(15, 20, 25, 0.06)",
  danger: "#D9534F",
};

export default function Settings() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("dark_mode") === "true";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("dark_mode", "true");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("dark_mode", "false");
      }
    } catch (e) {}
  }, [darkMode]);

  return (
    <div
      className="page"
      style={{
        background: COLORS.bg,
        minHeight: "100vh",
        padding: "18px",
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        paddingBottom: 120,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <BackButton />
        <div>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.4px" }}>⚙️ Settings</div>
          <p style={{ margin: "4px 0 0 0", color: COLORS.muted, fontSize: 13, fontWeight: 500 }}>Manage your account</p>
        </div>
      </div>

      {/* Settings Card */}
      <div
        style={{
          background: COLORS.white,
          padding: "12px 0",
          borderRadius: 16,
          boxShadow: `0 8px 24px ${COLORS.cardShadow}`,
          marginBottom: 20,
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden",
        }}
      >
        {/* Profile */}
        <div
          style={rowStyle(COLORS, false)}
          onClick={() => navigate("/profile")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18 }}>👤</span>
            <span style={rowText(COLORS)}>Profile</span>
          </div>
          <span style={{ color: COLORS.muted, fontSize: 18 }}>›</span>
        </div>

        {/* Wallet */}
        <div
          style={rowStyle(COLORS, false)}
          onClick={() => navigate("/wallet")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18 }}>💳</span>
            <span style={rowText(COLORS)}>Wallet & Payments</span>
          </div>
          <span style={{ color: COLORS.muted, fontSize: 18 }}>›</span>
        </div>

        {/* Upload history */}
        <div
          style={rowStyle(COLORS, false)}
          onClick={() => navigate("/upload-history")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18 }}>📁</span>
            <span style={rowText(COLORS)}>Upload History</span>
          </div>
          <span style={{ color: COLORS.muted, fontSize: 18 }}>›</span>
        </div>

        {/* Dark mode */}
        <div
          style={rowStyle(COLORS, false)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18 }}>🌙</span>
            <span style={rowText(COLORS)}>Dark Mode</span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-pressed={darkMode}
            style={{
              width: 54,
              height: 30,
              background: darkMode ? COLORS.primary : COLORS.border,
              borderRadius: 999,
              position: "relative",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: darkMode ? `0 4px 12px ${COLORS.cardShadow}` : "none",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                background: COLORS.white,
                borderRadius: "50%",
                position: "absolute",
                top: 2,
                left: darkMode ? 26 : 2,
                transition: "all 0.2s ease",
                boxShadow: `0 2px 6px ${COLORS.cardShadow}`,
              }}
            ></div>
          </button>
        </div>

        {/* Support */}
        <div
          style={rowStyle(COLORS, false)}
          onClick={() => navigate("/support")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18 }}>🆘</span>
            <span style={rowText(COLORS)}>Support</span>
          </div>
          <span style={{ color: COLORS.muted, fontSize: 18 }}>›</span>
        </div>

        {/* About */}
        <div
          style={rowStyle(COLORS, true)}
          onClick={() => alert("Vendor App v1.0.0")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18 }}>ℹ️</span>
            <span style={rowText(COLORS)}>About</span>
          </div>
          <span style={{ color: COLORS.muted, fontSize: 18 }}>›</span>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={() => navigate("/")}
        style={{
          width: "100%",
          padding: "13px",
          background: COLORS.danger,
          color: COLORS.white,
          border: "none",
          borderRadius: 12,
          fontWeight: 800,
          fontSize: 15,
          cursor: "pointer",
          boxShadow: `0 4px 12px ${COLORS.cardShadow}`,
          transition: "all 0.2s ease",
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
}

const rowStyle = (colors, isLast) => ({
  padding: "14px 16px",
  borderBottom: isLast ? "none" : `1px solid ${colors.border}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    background: colors.bg,
  },
});

const rowText = (colors) => ({
  fontWeight: 700,
  color: colors.text,
  fontSize: 15,
});

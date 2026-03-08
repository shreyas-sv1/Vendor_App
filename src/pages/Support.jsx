// src/pages/Support.jsx
import React from "react";
import BackButton from "../components/BackButton";

const THEME = {
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
};

function hexWithAlpha(hex, alpha = 0.12) {
  try {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch (e) {
    return hex;
  }
}

export default function Support() {
  return (
    <div className="page"
      style={{
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        background: THEME.bg,
        minHeight: "100vh",
        padding: "18px",
        paddingBottom: 120,
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <BackButton />
        <div>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 26, letterSpacing: "-0.4px" }}>🆘 Support</h2>
          <p style={{ margin: "4px 0 0 0", color: THEME.muted, fontSize: 13, fontWeight: 500 }}>We're here to help</p>
        </div>
      </div>

      {/* CONTACT SUPPORT */}
      <div
        style={{
          background: THEME.white,
          padding: 18,
          borderRadius: 16,
          boxShadow: `0 8px 24px ${THEME.cardShadow}`,
          marginBottom: 18,
          border: `1px solid ${THEME.border}`,
        }}
      >
        <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 800, letterSpacing: "-0.3px" }}>Contact Support</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            style={btnStyle(THEME.primary, THEME.white)}
            onClick={() => (window.location.href = "tel:+918000000000")}
          >
            📞 Call Support
          </button>

          <button
            style={btnStyle("#25D366", THEME.white)}
            onClick={() =>
              (window.location.href =
                "https://wa.me/918000000000?text=I need help with my account")
            }
          >
            💬 WhatsApp Support
          </button>

          <button
            style={btnStyle(THEME.primarySoft, THEME.text)}
            onClick={() =>
              (window.location.href = "mailto:support@vendorapp.com")
            }
          >
            📧 Email Support
          </button>
        </div>
      </div>

      {/* RAISE A TICKET */}
      <div
        style={{
          background: THEME.white,
          padding: 18,
          borderRadius: 16,
          boxShadow: `0 8px 24px ${THEME.cardShadow}`,
          marginBottom: 18,
          border: `1px solid ${THEME.border}`,
        }}
      >
        <h3 style={{ margin: "0 0 14px 0", fontSize: 18, fontWeight: 800, letterSpacing: "-0.3px" }}>Raise a Ticket</h3>

        <textarea
          placeholder="Describe your issue in detail..."
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: `1.5px solid ${THEME.border}`,
            minHeight: 110,
            outline: "none",
            marginBottom: 14,
            background: THEME.white,
            color: THEME.text,
            fontSize: 14,
            fontFamily: "inherit",
            boxShadow: `inset 0 2px 6px ${THEME.cardShadow}`,
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />

        <button
          style={btnStyle(THEME.success, THEME.white)}
          onClick={() => alert("Ticket submitted (demo)")}
        >
          ✓ Submit Ticket
        </button>
      </div>

      {/* FAQ SECTION */}
      <div
        style={{
          background: THEME.white,
          padding: 18,
          borderRadius: 16,
          boxShadow: `0 8px 24px ${THEME.cardShadow}`,
          border: `1px solid ${THEME.border}`,
        }}
      >
        <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 800, letterSpacing: "-0.3px" }}>Frequently Asked Questions</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {FAQ_LIST.map((faq, idx) => (
            <div
              key={faq.q}
              style={{
                padding: "14px 0",
                borderBottom: idx < FAQ_LIST.length - 1 ? `1px solid ${THEME.border}` : "none",
              }}
            >
              <div style={{ fontWeight: 800, color: THEME.text, fontSize: 14, marginBottom: 6 }}>
                Q: {faq.q}
              </div>
              <div style={{ color: THEME.muted, fontSize: 13, fontWeight: 500, lineHeight: 1.5 }}>
                A: {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function btnStyle(bg, color) {
  return {
    width: "100%",
    padding: "13px",
    borderRadius: 12,
    border: "none",
    fontWeight: 800,
    background: bg,
    color,
    cursor: "pointer",
    fontSize: 15,
    boxShadow: `0 4px 12px ${hexWithAlpha(bg, 0.3)}`,
    transition: "all 0.2s ease",
  };
}

const FAQ_LIST = [
  {
    q: "How do I update my cart?",
    a: "You can upload a new cart image from the dashboard every hour. Higher refresh rate means better order chances!",
  },
  {
    q: "Why am I not receiving orders?",
    a: "Make sure your Online/Offline toggle is set to Online and your location is accurate.",
  },
  {
    q: "How do I change my phone number?",
    a: "Go to Settings → Profile to update your phone number and other account details.",
  },
  {
    q: "How do I track a delivery?",
    a: "Click the 'Track' button on any order to see live location and route on the map.",
  },
];

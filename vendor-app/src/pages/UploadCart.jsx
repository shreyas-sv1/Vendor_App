// src/pages/UploadCart.jsx
import React, { useRef, useState } from "react";
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

/* -------------------------------------------------------
   Local Storage Hook
--------------------------------------------------------- */
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  const updateValue = (val) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  return [value, updateValue];
}

/* -------------------------------------------------------
   Unique ID generator
--------------------------------------------------------- */
function uid(prefix = "id_") {
  return prefix + Math.random().toString(36).substring(2, 9);
}

/* -------------------------------------------------------
   Main Component
--------------------------------------------------------- */
export default function UploadCart() {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [queue, setQueue] = useLocalStorage("cart_queue", []);

  /* -----------------------------
      File capture + preview
  ----------------------------- */
  const handleCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  /* -----------------------------
      Upload Now (Simulated)
  ----------------------------- */
  const uploadNow = () => {
    if (!preview) return alert("Please capture an image first.");

    setTimeout(() => {
      alert("Uploaded successfully!");
      setPreview(null);
    }, 1200);
  };

  /* -----------------------------
      Save to queue
  ----------------------------- */
  const addToQueue = () => {
    if (!preview) return alert("Capture an image first.");
    const newEntry = { id: uid("cart_"), img: preview, time: new Date().toISOString() };
    setQueue([newEntry, ...queue]);
    alert("Saved to queue!");
    setPreview(null);
  };

  /* -----------------------------
      Remove one from queue
  ----------------------------- */
  const removeQueueItem = (id) => {
    setQueue(queue.filter((q) => q.id !== id));
  };

  return (
    <div className="page"
      style={{
        padding: "18px",
        maxWidth: 480,
        margin: "0 auto",
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        background: THEME.bg,
        minHeight: "100vh",
        paddingBottom: 100,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <BackButton />
        <div>
          <h2 style={{ fontWeight: 900, margin: 0, color: THEME.text, fontSize: 26, letterSpacing: "-0.4px" }}>📸 Upload Cart</h2>
          <p style={{ marginTop: 4, color: THEME.muted, fontSize: 13, fontWeight: 500 }}>Refresh to get more orders</p>
        </div>
      </div>

      {/* Capture Box */}
      <div
        style={{
          width: "100%",
          height: 260,
          background: THEME.white,
          border: `2px dashed ${THEME.border}`,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
          boxShadow: `0 8px 24px ${THEME.cardShadow}`,
          transition: "all 0.2s ease",
          marginBottom: 20,
        }}
        onClick={() => inputRef.current.click()}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = THEME.primary;
          e.currentTarget.style.boxShadow = `0 12px 32px ${hexWithAlpha(THEME.primary, 0.25)}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = THEME.border;
          e.currentTarget.style.boxShadow = `0 8px 24px ${THEME.cardShadow}`;
        }}
      >
        {preview ? (
          <img
            src={preview}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="preview"
          />
        ) : (
          <div style={{ textAlign: "center", color: THEME.muted }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>📸</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: THEME.text }}>Tap to Capture</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>or drag to upload</div>
          </div>
        )}
      </div>

      {/* Hidden camera input */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleCapture}
      />

      {/* Buttons */}
      {preview && (
        <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={btn(THEME, { background: THEME.white, color: THEME.text, border: `1.5px solid ${THEME.border}`, flex: 0.4 })}
              onClick={() => setPreview(null)}
            >
              Remove
            </button>

            <button
              style={btn(THEME, { background: `linear-gradient(135deg, ${THEME.primaryDark} 0%, ${THEME.primary} 100%)`, color: THEME.white, flex: 1 })}
              onClick={uploadNow}
            >
              ⬆️ Upload Now
            </button>
          </div>

          <button
            style={btn(THEME, { background: THEME.success, color: THEME.white, width: "100%" })}
            onClick={addToQueue}
          >
            💾 Save to Queue
          </button>
        </div>
      )}

      {/* Queue List */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: "-0.3px" }}>📁 Queue</h3>
            <p style={{ margin: "4px 0 0 0", color: THEME.muted, fontSize: 12, fontWeight: 500 }}>{queue.length} image{queue.length !== 1 ? 's' : ''} pending</p>
          </div>
        </div>

        {queue.length === 0 ? (
          <div style={{ background: THEME.white, padding: 24, borderRadius: 16, textAlign: "center", border: `1px solid ${THEME.border}`, boxShadow: `0 4px 12px ${THEME.cardShadow}` }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <p style={{ color: THEME.muted, margin: 0, fontWeight: 600 }}>No queued images yet</p>
          </div>
        ) : (
          queue.map((q) => (
            <div
              key={q.id}
              style={{
                background: THEME.white,
                padding: 14,
                borderRadius: 14,
                display: "flex",
                gap: 12,
                alignItems: "center",
                boxShadow: `0 6px 18px ${THEME.cardShadow}`,
                marginBottom: 12,
                border: `1px solid ${THEME.border}`,
              }}
            >
              <img
                src={q.img}
                alt=""
                style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover", boxShadow: `0 4px 12px ${THEME.cardShadow}` }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: THEME.text, fontSize: 14 }}>Queued Upload</div>
                <div style={{ color: THEME.muted, fontSize: 12, marginTop: 4 }}>
                  🕐 {new Date(q.time).toLocaleString()}
                </div>
              </div>
              <button
                style={btn(THEME, {
                  background: THEME.white,
                  color: THEME.text,
                  border: `1.5px solid ${THEME.border}`,
                  padding: "8px 12px",
                  fontSize: 13,
                })}
                onClick={() => removeQueueItem(q.id)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* Button Style Generator */
function btn(theme, customStyle = {}) {
  return {
    padding: "12px 16px",
    borderRadius: 12,
    border: "none",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: 14,
    boxShadow: `0 4px 12px ${theme.cardShadow}`,
    transition: "all 0.2s ease",
    ...customStyle,
  };
}

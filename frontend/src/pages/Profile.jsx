import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("Shreyas Vendor");
  const [phone, setPhone] = useState("9876543210");
  const [email, setEmail] = useState("vendor@example.com");
  const [location, setLocation] = useState("Bangalore, India");

  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div
      className="page"
      style={{
        background: "#FAFAFB",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        paddingBottom: 100,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          margin: "0 auto",
          padding: "16px",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <BackButton fallback="/settings" />
          <h2
            style={{
              fontSize: 26,
              fontWeight: 900,
              margin: 0,
              letterSpacing: "-0.4px",
            }}
          >
            👤 Profile
          </h2>
        </div>

        {/* PROFILE CARD */}
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 14,
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          }}
        >
          {/* Profile Picture */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "#eee",
                margin: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
              }}
            >
              {'\u{1F464}'}
            </div>
          </div>

          {/* FORM */}
          <div>
            {/* Name */}
            <div style={rowStyle}>
              <label style={labelStyle}>Name</label>
              <input
                disabled={!editing}
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle(editing)}
              />
            </div>

            {/* Phone */}
            <div style={rowStyle}>
              <label style={labelStyle}>Phone</label>
              <input
                disabled={!editing}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle(editing)}
              />
            </div>

            {/* Email */}
            <div style={rowStyle}>
              <label style={labelStyle}>Email</label>
              <input
                disabled={!editing}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle(editing)}
              />
            </div>

            {/* Location */}
            <div style={rowStyle}>
              <label style={labelStyle}>Location</label>
              <input
                disabled={!editing}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle(editing)}
              />
            </div>
          </div>

          {/* BUTTONS */}
          {!editing ? (
            <button onClick={() => setEditing(true)} style={editBtnStyle}>
              Edit Profile
            </button>
          ) : (
            <button onClick={handleSave} style={saveBtnStyle}>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const rowStyle = {
  marginBottom: 16,
};

const labelStyle = {
  display: "block",
  fontSize: 14,
  fontWeight: 700,
  marginBottom: 6,
  color: "#444",
};

const inputStyle = (editing) => ({
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: editing ? "1px solid #FF8A00" : "1px solid #ddd",
  background: editing ? "#fff" : "#f3f3f3",
  fontSize: 15,
  outline: "none",
});

const editBtnStyle = {
  width: "100%",
  padding: 14,
  background: "#FF8A00",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer",
  marginTop: 10,
};

const saveBtnStyle = {
  width: "100%",
  padding: 14,
  background: "#00B34A",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer",
  marginTop: 10,
};

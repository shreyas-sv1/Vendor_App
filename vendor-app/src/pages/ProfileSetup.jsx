import React, { useState } from "react";
import BackButton from "../components/BackButton";

export default function ProfileSetup() {
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [category, setCategory] = useState("Grocery");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleFinish = () => {
    if (!firstName || !lastName || !dob) {
      alert("Please fill all required fields");
      return;
    }

    window.location.href = "/location";
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* BACK BUTTON */}
        <div>
          <BackButton />
        </div>

        {/* TITLE */}
        <h2 style={styles.title}>Create your profile</h2>

        {/* PROFILE PHOTO */}
        <div style={styles.photoContainer}>
          <div style={styles.photoCircle}>
            {image && (
              <img src={image} alt="profile" style={styles.profileImage} />
            )}
          </div>

          <label style={styles.uploadIcon}>
            ⟳
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </label>
        </div>

        <p style={styles.uploadText}>Upload Photo</p>

        {/* INPUT FIELDS */}
        <input
          type="text"
          placeholder="First Name"
          style={styles.input}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Last Name"
          style={styles.input}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="date"
          style={styles.input}
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <select
          style={styles.input}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Grocery">Grocery</option>
          <option value="Food">Food</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Clothes">Clothes</option>
        </select>

        {/* FINISH BUTTON */}
        <button style={styles.finishButton} onClick={handleFinish}>
          Finish
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
    alignItems: "flex-start",
  },

  container: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    padding: "35px 25px",
    borderRadius: "20px",
    margin: "0 auto",
    marginTop: "25px",
    boxShadow: "0 4px 12px rgba(15, 20, 25, 0.06)",
    border: "1px solid #E8EAED",
  },

  backBtn: {
    fontSize: "26px",
    cursor: "pointer",
    marginBottom: "10px",
    width: "40px",
    color: "#333",
  },

  title: {
    fontSize: "26px",
    fontWeight: "800",
    marginBottom: "25px",
    color: "#222",
  },

  photoContainer: {
    position: "relative",
    width: "150px",
    height: "150px",
    margin: "0 auto",
  },

  photoCircle: {
    width: "150px",
    height: "150px",
    background: "#c7f0c0",
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  uploadIcon: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    background: "#ff8a00",
    color: "#fff",
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "18px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
  },

  uploadText: {
    marginTop: "15px",
    textAlign: "center",
    color: "#666",
    marginBottom: "25px",
    fontSize: "15px",
  },

  input: {
    width: "100%",
    padding: "16px",
    marginBottom: "18px",
    border: "1px solid #e3e3e3",
    borderRadius: "14px",
    fontSize: "16px",
    backgroundColor: "#fafafa",
    outline: "none",
    color: "#000",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    transition: "0.2s",
    boxSizing: "border-box",
    lineHeight: "1.2",
  },

  finishButton: {
    width: "100%",
    padding: "16px",
    background: "#ff8a00",
    border: "none",
    color: "#fff",
    borderRadius: "50px",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 6px 15px rgba(255,138,0,0.3)",
  },
};

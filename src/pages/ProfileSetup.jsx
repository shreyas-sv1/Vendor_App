import React, { useState } from "react";

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
    <div style={styles.wrapper}>
      <div style={styles.container}>

        {/* BACK BUTTON */}
        <div style={styles.backBtn} onClick={() => window.history.back()}>
          ←
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

        {/* INPUTS */}
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
  wrapper: {
    width: "100%",
    minHeight: "100vh",
    background: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "40px",
    padding: "20px",
  },

  container: {
    width: "100%",
    maxWidth: "420px",
  },

  backBtn: {
    fontSize: "24px",
    cursor: "pointer",
    marginBottom: "10px",
    width: "40px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "25px",
  },

  photoContainer: {
    position: "relative",
    width: "140px",
    height: "140px",
    margin: "0 auto",
  },

  photoCircle: {
    width: "140px",
    height: "140px",
    background: "green",
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
  },

  uploadText: {
    marginTop: "10px",
    textAlign: "center",
    color: "#555",
    marginBottom: "25px",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    fontSize: "15px",
    backgroundColor: "#ffffff",
    color: "#000000",
    outline: "none",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },

  finishButton: {
    width: "100%",
    padding: "14px",
    marginTop: "10px",
    background: "#ff8a00",
    color: "#fff",
    border: "none",
    borderRadius: "40px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

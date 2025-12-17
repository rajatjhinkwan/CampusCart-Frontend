import React from "react";

export default function ProfileSettings({ data, onChange, onAvatarSelect }) {
  const form = data || {};

  const handleChange = (e) => {
    onChange({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatar = (file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    onAvatarSelect(file, previewUrl);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Profile Settings</h2>
      <p style={styles.subText}>Update your personal information.</p>

      {/* PROFILE IMAGE */}
      <div style={styles.imageBox}>
        <img
          src={form.profileImage || "https://via.placeholder.com/100"}
          alt="Profile"
          style={styles.image}
        />
        <div>
          <label htmlFor="imageUpload" style={styles.imageButton}>
            Change Photo
          </label>
          <input
            type="file"
            id="imageUpload"
            style={{ display: "none" }}
            onChange={(e) => handleAvatar(e.target.files?.[0])}
          />
        </div>
      </div>

      {/* NAME */}
      <div style={styles.field}>
        <label style={styles.label}>Full Name *</label>
        <input
          type="text"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      {/* USERNAME */}
      <div style={styles.field}>
        <label style={styles.label}>Username</label>
        <input
          type="text"
          name="username"
          value={form.username || ""}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      {/* BIO */}
      <div style={styles.field}>
        <label style={styles.label}>Bio</label>
        <textarea
          name="bio"
          value={form.bio || ""}
          onChange={handleChange}
          style={styles.textarea}
        />
      </div>

      {/* INSTITUTION */}
      <div style={styles.field}>
        <label style={styles.label}>Institution / Company</label>
        <input
          type="text"
          name="institution"
          placeholder="e.g. IIT Delhi, Microsoft"
          value={form.institution || ""}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      {/* PHONE */}
      <div style={styles.field}>
        <label style={styles.label}>Phone Number</label>
        <input
          type="text"
          name="phone"
          placeholder="Enter phone number"
          value={form.phone || ""}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      {/* LOCATION */}
      <div style={styles.field}>
        <label style={styles.label}>Location</label>
        <input
          type="text"
          name="location"
          placeholder="City, State"
          value={form.location || ""}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },

  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "6px",
  },

  subText: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "20px",
  },

  imageBox: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },

  image: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  imageButton: {
    background: "#2563eb",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },

  field: {
    marginBottom: "16px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
  },

  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    height: "80px",
    resize: "none",
  },
};

import React, { useState } from "react";

export default function AppPreferences() {
  const [prefs, setPrefs] = useState({
    darkMode: false,
    compactView: false,
    autoPlayVideos: true,
    language: "English",
  });

  const toggle = (key) => {
    setPrefs({ ...prefs, [key]: !prefs[key] });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>App Preferences</h2>
      <p style={styles.subText}>Customize how the app looks and behaves.</p>

      {/* LANGUAGE */}
      <div style={styles.field}>
        <label style={styles.label}>Language</label>
        <select
          value={prefs.language}
          onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
          style={styles.select}
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Punjabi</option>
          <option>Gujarati</option>
        </select>
      </div>

      {/* DARK MODE */}
      <div style={styles.row}>
        <span style={styles.label}>Dark Mode</span>
        <input
          type="checkbox"
          checked={prefs.darkMode}
          onChange={() => toggle("darkMode")}
          style={styles.checkbox}
        />
      </div>

      {/* COMPACT VIEW */}
      <div style={styles.row}>
        <span style={styles.label}>Compact View</span>
        <input
          type="checkbox"
          checked={prefs.compactView}
          onChange={() => toggle("compactView")}
          style={styles.checkbox}
        />
      </div>

      {/* AUTO-PLAY */}
      <div style={styles.row}>
        <span style={styles.label}>Auto-play listing videos</span>
        <input
          type="checkbox"
          checked={prefs.autoPlayVideos}
          onChange={() => toggle("autoPlayVideos")}
          style={styles.checkbox}
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
  title: { fontSize: "22px", fontWeight: "bold", marginBottom: "6px" },
  subText: { fontSize: "14px", color: "#6b7280", marginBottom: "20px" },

  field: { marginBottom: "16px" },
  label: { fontSize: "15px", fontWeight: "500", marginBottom: "6px", display: "block" },

  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    background: "#f9fafb",
    borderRadius: "10px",
    marginBottom: "12px",
    border: "1px solid #e5e7eb",
  },

  checkbox: { width: "20px", height: "20px", cursor: "pointer" },
};

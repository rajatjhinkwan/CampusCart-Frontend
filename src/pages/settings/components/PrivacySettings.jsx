// FILE: PrivacySettings.jsx

import React, { useState } from "react";

export default function PrivacySettings() {
  const [settings, setSettings] = useState({
    profileVisible: true,
    activityStatus: true,
    searchEngineListing: false,
    dataDownload: false,
    personalizedAds: true,
  });

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const styles = {
    card: {
      background: "#fff",
      padding: "24px",
      borderRadius: "20px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      width: "100%",
      maxWidth: "600px",
      margin: "auto",
    },
    title: {
      fontSize: "22px",
      fontWeight: "600",
      marginBottom: "20px",
    },
    option: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 0",
      borderBottom: "1px solid #eee",
    },
    label: {
      fontSize: "16px",
    },
    toggle: {
      width: "46px",
      height: "24px",
      borderRadius: "20px",
      background: "#ccc",
      position: "relative",
      cursor: "pointer",
      transition: "0.3s",
    },
    toggleActive: {
      background: "#4A90E2",
    },
    circle: {
      width: "20px",
      height: "20px",
      background: "#fff",
      borderRadius: "50%",
      position: "absolute",
      top: "2px",
      left: "2px",
      transition: "0.3s",
    },
    circleActive: {
      left: "24px",
    },
  };

  const Switch = ({ active }) => (
    <div
      style={{
        ...styles.toggle,
        ...(active ? styles.toggleActive : {}),
      }}
      onClick={() => {}}
    >
      <div
        style={{
          ...styles.circle,
          ...(active ? styles.circleActive : {}),
        }}
      ></div>
    </div>
  );

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Privacy Settings</h2>

      {/* Profile Visibility */}
      <div style={styles.option}>
        <span style={styles.label}>Show my profile publicly</span>
        <div onClick={() => toggle("profileVisible")}>
          <Switch active={settings.profileVisible} />
        </div>
      </div>

      {/* Activity Status */}
      <div style={styles.option}>
        <span style={styles.label}>Show activity status</span>
        <div onClick={() => toggle("activityStatus")}>
          <Switch active={settings.activityStatus} />
        </div>
      </div>

      {/* Search Engine Listing */}
      <div style={styles.option}>
        <span style={styles.label}>Allow search engines to show my profile</span>
        <div onClick={() => toggle("searchEngineListing")}>
          <Switch active={settings.searchEngineListing} />
        </div>
      </div>

      {/* Data Download */}
      <div style={styles.option}>
        <span style={styles.label}>Allow data download request</span>
        <div onClick={() => toggle("dataDownload")}>
          <Switch active={settings.dataDownload} />
        </div>
      </div>

      {/* Personalized Ads */}
      <div style={styles.option}>
        <span style={styles.label}>Enable personalized ads</span>
        <div onClick={() => toggle("personalizedAds")}>
          <Switch active={settings.personalizedAds} />
        </div>
      </div>
    </div>
  );
}

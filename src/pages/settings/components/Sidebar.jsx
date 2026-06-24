import React from "react";
import { styles } from "../styles";

export default function Sidebar({ activeTab, onTabChange }) {
  const menu = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notifications" },
    { id: "privacy", label: "Privacy" },
    { id: "preferences", label: "Preferences" },
  ];

  return (
    <div style={styles.sidebarContainer}>
      {menu.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          style={{
            width: "100%",
            padding: "14px 16px",
            marginBottom: "6px",
            textAlign: "left",
            background: activeTab === item.id ? "#dbeafe" : "#fff",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "500",
            color: activeTab === item.id ? "#1e3a8a" : "#334155",
            transition: "0.2s ease",
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

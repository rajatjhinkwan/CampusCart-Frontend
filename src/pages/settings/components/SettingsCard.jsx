import React from "react";

export default function SettingsCard({ children, title }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(226,232,240,0.8)",
        borderRadius: "16px",
        padding: "32px",
        marginBottom: "24px",
      }}
    >
      {title && (
        <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

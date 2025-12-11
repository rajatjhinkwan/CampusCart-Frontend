import React from "react";

export default function InputField({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ fontSize: "12px", marginBottom: "6px", display: "block" }}>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
        }}
      />
    </div>
  );
}

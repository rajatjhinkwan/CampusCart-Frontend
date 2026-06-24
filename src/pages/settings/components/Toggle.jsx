import React from "react";

export default function Toggle({ label, checked, onChange }) {
  return (
    <div style={{ margin: "12px 0", display: "flex", justifyContent: "space-between" }}>
      <span>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: "50px",
          height: "24px",
          borderRadius: "999px",
          border: 0,
          background: checked ? "#2563eb" : "#cbd5e1",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            background: "#fff",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            top: "3px",
            left: checked ? "26px" : "4px",
            transition: "0.2s",
          }}
        />
      </button>
    </div>
  );
}

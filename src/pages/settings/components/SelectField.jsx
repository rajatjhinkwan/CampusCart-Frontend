import React from "react";

export default function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ fontSize: "12px", marginBottom: "6px", display: "block" }}>
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

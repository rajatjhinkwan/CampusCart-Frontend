import React from "react";

export default function SecuritySettings({ data, onChange }) {
  const twoFactor = data?.twoFactor || false;
  const passwordForm = data?.password || { current: "", newPass: "", confirm: "" };

  const container = {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  };

  const section = {
    marginBottom: "28px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e5e7eb",
  };

  const title = {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "16px",
  };

  const label = {
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "6px",
  };

  const input = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    marginBottom: "16px",
    outline: "none",
  };

  const toggleRow = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "10px",
  };

  const toggleSwitch = {
    width: "46px",
    height: "24px",
    borderRadius: "20px",
    background: twoFactor ? "#2563eb" : "#cbd5e1",
    position: "relative",
    cursor: "pointer",
    transition: "0.2s",
  };

  const toggleCircle = {
    width: "20px",
    height: "20px",
    background: "#fff",
    borderRadius: "50%",
    position: "absolute",
    top: "2px",
    left: twoFactor ? "24px" : "2px",
    transition: "0.2s",
  };

  const activityItem = {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    marginBottom: "10px",
    background: "#f8fafc",
  };

  return (
    <div style={container}>
      {/* CHANGE PASSWORD */}
      <div style={section}>
        <h2 style={title}>Password Settings</h2>

        <label style={label}>Current Password</label>
        <input
          type="password"
          style={input}
          value={passwordForm.current}
          onChange={(e) =>
            onChange({
              ...data,
              password: { ...passwordForm, current: e.target.value },
            })
          }
        />

        <label style={label}>New Password</label>
        <input
          type="password"
          style={input}
          value={passwordForm.newPass}
          onChange={(e) =>
            onChange({
              ...data,
              password: { ...passwordForm, newPass: e.target.value },
            })
          }
        />

        <label style={label}>Confirm Password</label>
        <input
          type="password"
          style={input}
          value={passwordForm.confirm}
          onChange={(e) =>
            onChange({
              ...data,
              password: { ...passwordForm, confirm: e.target.value },
            })
          }
        />
      </div>

      {/* TWO FACTOR AUTH */}
      <div style={section}>
        <h2 style={title}>Two-Factor Authentication</h2>
        <p style={{ fontSize: "14px", color: "#475569" }}>
          Add an extra layer of security to your CampusCard account.
        </p>

        <div
          style={toggleRow}
          onClick={() => onChange({ ...data, twoFactor: !twoFactor })}
        >
          <span style={{ fontSize: "15px", fontWeight: "500" }}>
            Enable Two-Factor
          </span>

          <div style={toggleSwitch}>
            <div style={toggleCircle}></div>
          </div>
        </div>
      </div>

      {/* LOGIN ACTIVITY */}
      <div>
        <h2 style={title}>Recent Login Activity</h2>

        <div style={activityItem}>
          <strong>Chrome • Windows</strong>
          <p style={{ margin: "4px 0", fontSize: "13px" }}>
            Dehradun, India
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
            Today at 6:42 PM
          </p>
        </div>

        <div style={activityItem}>
          <strong>Mobile App • Android</strong>
          <p style={{ margin: "4px 0", fontSize: "13px" }}>
            Dehradun, India
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
            Yesterday at 9:24 PM
          </p>
        </div>
      </div>
    </div>
  );
}

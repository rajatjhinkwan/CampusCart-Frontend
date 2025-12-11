import React, { useState } from "react";

export default function NotificationsSettings() {
  const [prefs, setPrefs] = useState({
    newMessage: true,
    productSold: true,
    priceDrop: false,
    newOffer: true,
    appUpdates: false,
  });

  const toggle = (key) => {
    setPrefs({ ...prefs, [key]: !prefs[key] });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Notifications</h2>
      <p style={styles.subText}>Choose how you want to be notified.</p>

      {/* ITEM 1 */}
      <div style={styles.row}>
        <div>
          <h4 style={styles.label}>New Messages</h4>
          <p style={styles.desc}>Get notified when a buyer or seller messages you.</p>
        </div>
        <input
          type="checkbox"
          checked={prefs.newMessage}
          onChange={() => toggle("newMessage")}
          style={styles.checkbox}
        />
      </div>

      {/* ITEM 2 */}
      <div style={styles.row}>
        <div>
          <h4 style={styles.label}>Product Sold</h4>
          <p style={styles.desc}>When your listed product gets sold.</p>
        </div>
        <input
          type="checkbox"
          checked={prefs.productSold}
          onChange={() => toggle("productSold")}
          style={styles.checkbox}
        />
      </div>

      {/* ITEM 3 */}
      <div style={styles.row}>
        <div>
          <h4 style={styles.label}>Price Drop Alerts</h4>
          <p style={styles.desc}>When items you saved drop in price.</p>
        </div>
        <input
          type="checkbox"
          checked={prefs.priceDrop}
          onChange={() => toggle("priceDrop")}
          style={styles.checkbox}
        />
      </div>

      {/* ITEM 4 */}
      <div style={styles.row}>
        <div>
          <h4 style={styles.label}>New Offers</h4>
          <p style={styles.desc}>When buyers send offers on your listing.</p>
        </div>
        <input
          type="checkbox"
          checked={prefs.newOffer}
          onChange={() => toggle("newOffer")}
          style={styles.checkbox}
        />
      </div>

      {/* ITEM 5 */}
      <div style={styles.row}>
        <div>
          <h4 style={styles.label}>App Updates</h4>
          <p style={styles.desc}>News about new features & improvements.</p>
        </div>
        <input
          type="checkbox"
          checked={prefs.appUpdates}
          onChange={() => toggle("appUpdates")}
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
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "6px",
  },
  subText: {
    color: "#6b7280",
    marginBottom: "20px",
    fontSize: "14px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f9fafb",
    padding: "14px 16px",
    borderRadius: "10px",
    marginBottom: "12px",
    border: "1px solid #e5e7eb",
  },
  label: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "2px",
  },
  desc: {
    fontSize: "13px",
    color: "#6b7280",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
};

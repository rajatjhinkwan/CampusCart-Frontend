// FILE: src/pages/productPage/components/SellerInfo.jsx

import React from "react";

const SellerInfo = ({ seller }) => {
  // If seller is not loaded yet
  if (!seller) {
    return (
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          background: "#fff",
          marginTop: "20px",
          textAlign: "center",
          color: "#777",
        }}
      >
        Loading seller details...
      </div>
    );
  }

  // Safely extract values
  const sellerName = seller?.name || "Unknown Seller";
  const sellerEmail = seller?.email || "No email provided";

  const styles = {
    card: {
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "20px",
      marginTop: "20px",
    },
    row: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
    },
    avatar: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      background: "#e2e2e2",
      marginRight: "12px",
    },
    name: { fontSize: "18px", fontWeight: "bold" },
    chatButton: {
      marginTop: "15px",
      width: "100%",
      padding: "10px",
      border: "1px solid #007bff",
      background: "#007bff",
      color: "#fff",
      fontWeight: "bold",
      borderRadius: "6px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.row}>
        <div style={styles.avatar} />
        <div>
          <p style={styles.name}>{sellerName}</p>
          <p style={{ fontSize: "12px", color: "#777" }}>{sellerEmail}</p>
        </div>
      </div>

      <button style={styles.chatButton}>Chat with Seller</button>
    </div>
  );
};

export default SellerInfo;

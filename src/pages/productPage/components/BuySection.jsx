// FILE: src/pages/productPage/components/BuySection.jsx

import React from "react";

const BuySection = ({ price }) => {
  const styles = {
    card: {
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "20px",
      textAlign: "center",
    },
    price: { fontSize: "28px", fontWeight: "bold", marginBottom: "15px" },
    button: {
      width: "100%",
      padding: "12px",
      background: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.price}>₹ {price}</div>
      <button style={styles.button}>Make Offer</button>
    </div>
  );
};

export default BuySection;

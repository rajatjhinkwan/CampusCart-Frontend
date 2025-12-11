// FILE: src/pages/productPage/components/DetailsCard.jsx

import React from "react";

const DetailsCard = ({ data }) => {
  const styles = {
    card: {
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "20px",
    },
    title: { fontSize: "24px", marginBottom: "8px" },
    sub: { fontSize: "13px", color: "#777", marginBottom: "15px" },
    label: { fontSize: "13px", color: "#999" },
    info: { fontSize: "15px", fontWeight: "bold" },
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{data.title}</h2>
      <p style={styles.sub}>{data.category}</p>

      <div>
        <p style={styles.label}>Location:</p>
        <p style={styles.info}>{data.location}</p>
      </div>

      <div style={{ marginTop: "15px" }}>
        <p style={styles.label}>Condition:</p>
        <p style={styles.info}>{data.condition}</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Description</h3>
        <p style={{ fontSize: "14px", lineHeight: 1.6 }}>
          {data.description}
        </p>
      </div>
    </div>
  );
};

export default DetailsCard;

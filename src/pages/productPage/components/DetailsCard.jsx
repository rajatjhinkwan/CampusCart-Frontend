// FILE: src/pages/productPage/components/DetailsCard.jsx

import React from "react";

const DetailsCard = ({ data }) => {
  const styles = {
    card: {
      background: "#fff",
      borderRadius: "16px",
      padding: "30px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    },
    title: { 
      fontSize: "32px", 
      fontWeight: "700", 
      marginBottom: "12px", 
      color: "#1e293b" 
    },
    sub: { 
      fontSize: "16px", 
      color: "#64748b", 
      marginBottom: "24px",
      display: "inline-block",
      background: "#f1f5f9",
      padding: "6px 12px",
      borderRadius: "20px",
      fontWeight: "500"
    },
    section: {
        marginBottom: "24px",
    },
    label: { 
        fontSize: "14px", 
        color: "#64748b", 
        marginBottom: "4px",
        fontWeight: "500"
    },
    info: { 
        fontSize: "18px", 
        fontWeight: "600", 
        color: "#334155" 
    },
    descTitle: {
        fontSize: "20px",
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: "12px"
    },
    descText: {
        fontSize: "16px",
        lineHeight: 1.7,
        color: "#475569"
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{data.title}</h2>
      <span style={styles.sub}>{data.category}</span>

      <div style={styles.section}>
        <p style={styles.label}>Location</p>
        <p style={styles.info}>{data.location}</p>
      </div>

      <div style={styles.section}>
        <p style={styles.label}>Condition</p>
        <p style={styles.info}>{data.condition}</p>
      </div>

      {data.type === "rent" && (
        <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#fff7ed", borderRadius: "12px", border: "1px solid #fed7aa" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "16px", color: "#9a3412", fontWeight: "700" }}>Rental Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
             <div>
                <p style={styles.label}>Rental Period</p>
                <p style={styles.info}>{data.rentalPeriod || "Monthly"}</p>
             </div>
             <div>
                <p style={styles.label}>Security Deposit</p>
                <p style={styles.info}>₹{data.securityDeposit || 0}</p>
             </div>
             <div>
                <p style={styles.label}>Min Duration</p>
                <p style={styles.info}>{data.minRentalDuration || 1} {data.rentalPeriod || "Month"}(s)</p>
             </div>
             {data.buyBackAvailable && (
                 <div>
                    <p style={styles.label}>Buy Back Guarantee</p>
                    <p style={styles.info}>Yes (Returns ₹{data.buyBackPrice})</p>
                 </div>
             )}
          </div>
        </div>
      )}

      <div style={{ marginTop: "30px", paddingTop: "30px", borderTop: "1px solid #e2e8f0" }}>
        <h3 style={styles.descTitle}>Description</h3>
        <p style={styles.descText}>
          {data.description}
        </p>
      </div>
    </div>
  );
};

export default DetailsCard;

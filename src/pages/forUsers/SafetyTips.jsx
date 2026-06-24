import React from "react";

const SafetyTips = () => {
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      color: "#1f2937",
      lineHeight: 1.6,
    },
    heading: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#0f172a",
    },
    subheading: {
      fontSize: "1.2rem",
      fontWeight: "600",
      marginTop: "20px",
      marginBottom: "10px",
      color: "#dc2626",
    },
    list: {
      paddingLeft: "20px",
    },
    listItem: {
      marginBottom: "10px",
    },
    note: {
      backgroundColor: "#fef3c7",
      padding: "10px",
      borderLeft: "5px solid #facc15",
      marginTop: "20px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Safety Tips for CampusCart</h1>

      <p>
        Safety is the top priority when buying or selling online. Follow these tips to protect yourself and your items.
      </p>

      <h2 style={styles.subheading}>1. Meet in Public Places</h2>
      <p>Always arrange meetups in safe, public areas on campus like cafeterias or libraries.</p>

      <h2 style={styles.subheading}>2. Verify the Buyer/Seller</h2>
      <ul style={styles.list}>
        <li style={styles.listItem}>Check profile ratings and reviews.</li>
        <li style={styles.listItem}>Ask for student ID if needed.</li>
      </ul>

      <h2 style={styles.subheading}>3. Inspect Items Carefully</h2>
      <p>
        Before purchasing, check the item thoroughly. For electronics, test if possible.
      </p>

      <h2 style={styles.subheading}>4. Secure Payments</h2>
      <p>
        Avoid sending money upfront. Prefer cash on pickup or trusted online payments supported by CampusCart.
      </p>

      <h2 style={styles.subheading}>5. Protect Personal Info</h2>
      <p>
        Do not share sensitive information like your home address or bank details with strangers.
      </p>

      <div style={styles.note}>
        <strong>Tip:</strong> Trust your instincts. If something feels off, walk away. CampusCart wants your transactions to be safe and stress-free!
      </div>
    </div>
  );
};

export default SafetyTips;

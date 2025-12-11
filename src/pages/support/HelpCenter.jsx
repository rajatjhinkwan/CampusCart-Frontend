import React from "react";

const HelpCenter = () => {
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
    paragraph: {
      marginBottom: "16px",
      fontSize: "14px",
    },
    list: {
      marginLeft: "20px",
      marginBottom: "16px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Help Center</h1>
      <p style={styles.paragraph}>
        Welcome to CampusCart Help Center! Here you can find answers to common questions and get guidance on using our platform.
      </p>
      <p style={styles.paragraph}>Popular topics:</p>
      <ul style={styles.list}>
        <li>How to buy and sell items safely</li>
        <li>Managing your account</li>
        <li>Payment and transaction issues</li>
        <li>Reporting problems or users</li>
      </ul>
      <p style={styles.paragraph}>
        If you cannot find an answer here, please contact our support team for personalized help.
      </p>
    </div>
  );
};

export default HelpCenter;

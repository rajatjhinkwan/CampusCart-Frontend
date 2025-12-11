import React from "react";

const PrivacyPolicy = () => {
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
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Privacy Policy</h1>
      <p style={styles.paragraph}>
        At CampusCart, we value your privacy. This policy explains how we collect, use, and protect your personal information while using our marketplace platform.
      </p>
      <p style={styles.paragraph}>
        We only collect information necessary to provide our services, ensure safe transactions, and improve your experience. Your data will never be shared with third parties without your consent.
      </p>
      <p style={styles.paragraph}>
        By using CampusCart, you agree to the practices described in this Privacy Policy.
      </p>
    </div>
  );
};

export default PrivacyPolicy;

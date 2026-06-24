import React from "react";

const TermsOfService = () => {
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
      <h1 style={styles.heading}>Terms of Service</h1>
      <p style={styles.paragraph}>
        Welcome to CampusCart! By accessing or using our platform, you agree to comply with these Terms of Service. Please read them carefully.
      </p>
      <p style={styles.paragraph}>
        You are responsible for all activity on your account and agree to use CampusCart only for legal purposes. CampusCart reserves the right to suspend or terminate accounts violating these terms.
      </p>
      <p style={styles.paragraph}>
        By continuing to use CampusCart, you accept these Terms of Service in full.
      </p>
    </div>
  );
};

export default TermsOfService;

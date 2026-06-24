import React from "react";

const Press = () => {
  const styles = {
    container: { maxWidth: "900px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif", color: "#1f2937", lineHeight: 1.6 },
    heading: { fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", color: "#0f172a" },
    paragraph: { marginBottom: "16px", fontSize: "14px" },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Press</h1>
      <p style={styles.paragraph}>
        CampusCart is featured in leading media outlets and blogs for transforming the student marketplace experience in India.
      </p>
      <p style={styles.paragraph}>
        For press inquiries, contact <strong>press@campuscart.com</strong>.
      </p>
    </div>
  );
};

export default Press;

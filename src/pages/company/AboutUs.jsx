import React from "react";

const AboutUs = () => {
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      color: "#1f2937",
      lineHeight: 1.6,
    },
    heading: { fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", color: "#0f172a" },
    paragraph: { marginBottom: "16px", fontSize: "14px" },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>About Us</h1>
      <p style={styles.paragraph}>
        CampusCart is India’s leading marketplace for students and campuses. We help users buy and sell anything from furniture, gadgets, jobs to services.
      </p>
      <p style={styles.paragraph}>
        Our mission is to create a safe and convenient platform for students to connect and trade locally, building a trusted community.
      </p>
    </div>
  );
};

export default AboutUs;

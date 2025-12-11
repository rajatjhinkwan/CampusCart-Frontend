import React from "react";

const Careers = () => {
  const styles = {
    container: { maxWidth: "900px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif", color: "#1f2937", lineHeight: 1.6 },
    heading: { fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", color: "#0f172a" },
    paragraph: { marginBottom: "16px", fontSize: "14px" },
    list: { marginLeft: "20px", marginBottom: "16px" },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Careers</h1>
      <p style={styles.paragraph}>
        Join the CampusCart team! We’re always looking for talented and passionate individuals to help us grow our marketplace and community.
      </p>
      <p style={styles.paragraph}>Open positions:</p>
      <ul style={styles.list}>
        <li>Frontend Developer</li>
        <li>Backend Developer</li>
        <li>Product Manager</li>
        <li>Marketing Specialist</li>
        <li>Customer Support</li>
      </ul>
      <p style={styles.paragraph}>
        Interested candidates can send their resumes to <strong>careers@campuscart.com</strong>.
      </p>
    </div>
  );
};

export default Careers;

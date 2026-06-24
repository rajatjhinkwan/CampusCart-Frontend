import React from "react";

const CommunityGuidelines = () => {
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
      <h1 style={styles.heading}>Community Guidelines</h1>
      <p style={styles.paragraph}>
        CampusCart is a safe and trustworthy marketplace because of our community guidelines. All users must follow these rules:
      </p>
      <ul style={styles.list}>
        <li>Be respectful to other users</li>
        <li>Do not post illegal or prohibited items</li>
        <li>Provide accurate information about items</li>
        <li>Report suspicious activity or spam</li>
        <li>Follow all laws and regulations</li>
      </ul>
      <p style={styles.paragraph}>
        Violating these guidelines may result in account suspension or removal of listings.
      </p>
    </div>
  );
};

export default CommunityGuidelines;

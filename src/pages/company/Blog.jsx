import React from "react";

const Blog = () => {
  const styles = {
    container: { maxWidth: "900px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif", color: "#1f2937", lineHeight: 1.6 },
    heading: { fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", color: "#0f172a" },
    paragraph: { marginBottom: "16px", fontSize: "14px" },
    list: { marginLeft: "20px", marginBottom: "16px" },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Blog</h1>
      <p style={styles.paragraph}>
        Welcome to the CampusCart Blog! Stay updated with the latest tips, guides, and stories about buying, selling, and campus life.
      </p>
      <ul style={styles.list}>
        <li>How to sell your used books effectively</li>
        <li>Top 10 student gadgets of 2025</li>
        <li>Campus success stories from users</li>
        <li>Safe buying tips for students</li>
      </ul>
    </div>
  );
};

export default Blog;

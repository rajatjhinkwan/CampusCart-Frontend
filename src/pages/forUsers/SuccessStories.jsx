import React from "react";

const SuccessStories = () => {
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
    card: {
      backgroundColor: "#f1f5f9",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
    name: {
      fontSize: "1.1rem",
      fontWeight: "600",
      marginBottom: "5px",
      color: "#1e40af",
    },
    story: {
      fontSize: "1rem",
      color: "#1f2937",
    },
    note: {
      fontStyle: "italic",
      marginTop: "10px",
      color: "#475569",
    },
  };

  const stories = [
    {
      name: "Riya Sharma",
      story:
        "I sold my old textbooks on CampusCart and got a great price within 2 days! The process was smooth and safe.",
      note: "– Electronics & Books Category",
    },
    {
      name: "Aman Verma",
      story:
        "Bought a gaming chair from a fellow student. Easy communication and fast delivery. Highly recommend CampusCart!",
      note: "– Furniture & Gadgets Category",
    },
    {
      name: "Sneha Kapoor",
      story:
        "I listed my laptop and sold it in a week. The pricing guide helped me set a fair price. Very happy with the experience!",
      note: "– Electronics Category",
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>CampusCart Success Stories</h1>

      {stories.map((item, index) => (
        <div key={index} style={styles.card}>
          <div style={styles.name}>{item.name}</div>
          <div style={styles.story}>{item.story}</div>
          <div style={styles.note}>{item.note}</div>
        </div>
      ))}
    </div>
  );
};

export default SuccessStories;

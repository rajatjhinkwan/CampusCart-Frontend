import React, { useEffect, useState } from "react";
import ADS1 from "../../assets/ADS1.jpg";

const Ads = () => {
  // Sample ad images (you can replace with your real URLs)
const images = [
  ADS1,
  "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687", // Smartphones Sale
  "https://plus.unsplash.com/premium_photo-1680985551009-05107cd2752c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1632", // Laptop Offer
  "https://images.unsplash.com/photo-1679009332752-db00e251c278?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170", // Headphones Discount
  "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170", // Furniture Deals
  "https://media.istockphoto.com/id/178598369/photo/muscle-car.webp?a=1&s=612x612&w=0&k=20&c=4D45zM1cAo-fQDfkEiwVpAfRvyZxRNrGQ_tRJEND7aE=", // Fashion & Clothing Offer
];


  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto change images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [images.length]);

  // --- Styles (Inline CSS in Object Form) ---
  const styles = {
    container: {
      width: "1500px",
      height: "280px",
      marginTop: "80px",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      background: "linear-gradient(135deg, #f0f4ff, #e2ebff)",
      position: "relative",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    heading: {
      position: "absolute",
      top: "15px",
      left: "20px",
      color: "#333",
      fontSize: "1.5rem",
      fontWeight: "bold",
      letterSpacing: "1px",
    },
    subText: {
      position: "absolute",
      top: "55px",
      left: "20px",
      color: "#555",
      fontSize: "1rem",
      opacity: 0.9,
    },
    imageContainer: {
      width: "100%",
      height: "100%",
      display: "flex",
      transition: "transform 0.6s ease-in-out",
      transform: `translateX(-${currentIndex * 100}%)`,
    },
    image: {
      width: "100%",
      flexShrink: 0,
      objectFit: "cover",
      borderRadius: "16px",
    },
    hoverEffect: {
      cursor: "pointer",
      transform: "scale(1.01)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    },
  };

  return (
    <div
      style={styles.container}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, styles.hoverEffect);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, {
          transform: "scale(1)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        });
      }}
    >
      {/* <h3 style={styles.heading}>🔥 Hot Deals Today</h3>
      <p style={styles.subText}>Check out our latest offers and discounts!</p> */}

      <div style={styles.imageContainer}>
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Ad ${index}`} style={styles.image} />
        ))}
      </div>
    </div>
  );
};

export default Ads;

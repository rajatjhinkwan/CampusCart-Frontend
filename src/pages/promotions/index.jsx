// pages/promotions/index.jsx
import React from "react";
import PromotionCard from "./components/PromotionCard";

const styles = {
  container: {
    padding: "24px",
  },
  heading: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  },
};

export default function PromotionsPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Promotions</h1>

      {/* Send whole list to PromotionCard */}
      <PromotionCard />
    </div>
  );
}

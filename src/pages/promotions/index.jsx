// pages/promotions/index.jsx
import React, { useState } from "react";
import axios from "../../lib/axios";
import PromotionCard from "./components/PromotionCard";

const styles = {
  container: {
    padding: "24px",
  },
  ctaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  heading: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "20px",
  },
  buyBtn: {
    backgroundColor: "#111827",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
  note: {
    fontSize: "13px",
    color: "#6b7280",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  },
};

export default function PromotionsPage() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuyPremium = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(`/api/users/premium/checkout`);
      const url = res.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        setError("Unable to start checkout right now");
      }
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Payments are not available");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.ctaRow}>
        <h1 style={styles.heading}>Promotions</h1>
        <div>
          <button style={styles.buyBtn} onClick={handleBuyPremium} disabled={loading}>
            {loading ? "Redirecting..." : "Buy Premium"}
          </button>
          <div style={styles.note}>
            {error ? error : "Premium boosts your listings for better visibility"}
          </div>
        </div>
      </div>

      {/* Send whole list to PromotionCard */}
      <PromotionCard />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "../../lib/axios";
import WishlistItem from "./components/WishlistItem";

const styles = {
  container: {
    padding: "24px",
  },
  heading: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "20px",
  }
};

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("/api/wishlist/me");
        const products = res.data?.wishlist?.products || [];
        const mapped = products.map((p) => ({
          id: p._id || p.id,
          title: p.title || "Untitled",
          price:
            typeof p.price === "number"
              ? `₹ ${p.price.toLocaleString("en-IN")}`
              : p.price || "₹ Not provided",
          image: Array.isArray(p.images) && p.images[0]?.url ? p.images[0].url : (p.image || "https://via.placeholder.com/300"),
          seller: p.seller?.name || p.seller || "User",
          condition: p.condition || "Unknown",
          location: p.location,
          date: p.updatedAt || p.createdAt || "Recently",
          negotiable: !!p.negotiable,
          type: "Product",
        }));
        setItems(mapped);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Wishlist</h1>

      {error && <div>{error}</div>}
      {loading ? <div>Loading...</div> : <WishlistItem items={items} />}
    </div>
  );
}

import React from "react";
import ProductCard from "../../../components/product/productCard";

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
};

export default function WishlistItem({ items = [] }) {
  return (
    <div style={styles.grid}>
      {items.map((item) => (
        <ProductCard key={item.id} product={item} />
      ))}
    </div>
  );
}

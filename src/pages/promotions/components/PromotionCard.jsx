import React from "react";
import ProductCard from "../../../components/product/productCard";

const PromotionsPage = () => {
  // Promotion-powered products
  const promotedItems = [
    {
      id: 101,
      title: "iPhone 13 Pro - Like New",
      price: "₹ 48,999",
      negotiable: true,
      image: "https://via.placeholder.com/300",
      location: "Mumbai",
      seller: "Campus Store",
      condition: "New",
      date: "Promoted",
    },
    {
      id: 102,
      title: "Gaming Keyboard RGB",
      price: "₹ 1,299",
      negotiable: false,
      image: "https://via.placeholder.com/300",
      location: "Bangalore",
      seller: "Tech Hub",
      condition: "Used",
      date: "Sponsored",
    },
  ];

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.grid}>
        {promotedItems.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#0f172a",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
};

export default PromotionsPage;

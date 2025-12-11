import React from "react";
import ProductCard from "../../../components/product/productCard";

const WishlistPage = () => {
  // Dummy wishlist products (same structure expected by ProductCard)
  const wishlistItems = [
    {
      id: 1,
      title: "Wireless Headphones",
      price: "₹ 1,999",
      negotiable: false,
      image: "https://via.placeholder.com/300",
      location: "Dehradun",
      seller: "Amit Sharma",
      condition: "Used",
      date: "2 days ago",
    },
    {
      id: 2,
      title: "Laptop Bag - Waterproof",
      price: "₹ 799",
      negotiable: true,
      image: "https://via.placeholder.com/300",
      location: "Delhi",
      seller: "Riya Verma",
      condition: "New",
      date: "1 day ago",
    },
  ];

  return (
    <div style={styles.pageWrapper}>
      <h2 style={styles.title}>Your Wishlist</h2>

      <div style={styles.grid}>
        {wishlistItems.map((item) => (
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

export default WishlistPage;

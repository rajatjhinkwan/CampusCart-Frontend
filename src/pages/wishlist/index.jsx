// pages/wishlist/index.jsx
import React from "react";
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
  const dummyItems = [
    {
      id: 1,
      title: "Wireless Headphones",
      price: "₹1,299",
      negotiable: false,
      image: "https://via.placeholder.com/300",
      location: "Delhi",
      seller: "Rajat",
      condition: "Used",
      date: "2 days ago",
    },
    {
      id: 2,
      title: "Laptop Bag",
      price: "₹899",
      negotiable: true,
      image: "https://via.placeholder.com/300",
      location: "Mumbai",
      seller: "Campus Store",
      condition: "New",
      date: "1 day ago",
    },
    {
      id: 3,
      title: "Desk Lamp",
      price: "₹499",
      negotiable: false,
      image: "https://via.placeholder.com/300",
      location: "Pune",
      seller: "Aman",
      condition: "Used",
      date: "Recently",
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Wishlist</h1>

      {/* Send ALL wishlist items in one go */}
      <WishlistItem items={dummyItems} />
    </div>
  );
}

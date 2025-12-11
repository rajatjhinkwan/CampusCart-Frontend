import React from "react";

const HowToBuy = () => {
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
    subheading: {
      fontSize: "1.2rem",
      fontWeight: "600",
      marginTop: "20px",
      marginBottom: "10px",
      color: "#1e40af",
    },
    list: {
      paddingLeft: "20px",
    },
    listItem: {
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>How to Buy on CampusCart</h1>

      <p>
        Buying on CampusCart is easy, safe, and fast! Follow these steps to find
        the best deals from fellow students.
      </p>

      <h2 style={styles.subheading}>1. Browse Listings</h2>
      <p>Explore categories like electronics, books, furniture, and more. Use search and filters to find exactly what you need.</p>

      <h2 style={styles.subheading}>2. Check Product Details</h2>
      <ul style={styles.list}>
        <li style={styles.listItem}>Read the description carefully.</li>
        <li style={styles.listItem}>Check photos and specifications.</li>
        <li style={styles.listItem}>Look at seller ratings and reviews.</li>
      </ul>

      <h2 style={styles.subheading}>3. Contact Seller</h2>
      <p>
        Use the "Chat" or "Message Seller" option to ask questions about the product. Negotiate if needed!
      </p>

      <h2 style={styles.subheading}>4. Arrange Pickup or Delivery</h2>
      <p>
        Decide with the seller whether you’ll meet in person or use delivery options. Always prioritize safety.
      </p>

      <h2 style={styles.subheading}>5. Make Payment</h2>
      <p>
        Pay only when you’ve received and checked the product. Avoid sending money before seeing the item.
      </p>

      <h2 style={styles.subheading}>6. Leave Feedback</h2>
      <p>
        Rate the seller and leave a review to help the community stay informed.
      </p>
    </div>
  );
};

export default HowToBuy;

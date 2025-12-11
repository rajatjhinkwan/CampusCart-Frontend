import React from "react";

const PricingGuide = () => {
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
    note: {
      backgroundColor: "#e0f2fe",
      padding: "10px",
      borderLeft: "5px solid #0284c7",
      marginTop: "20px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>CampusCart Pricing Guide</h1>

      <p>
        Setting the right price is key to selling quickly and buying fairly. Use this guide to understand how to price your items.
      </p>

      <h2 style={styles.subheading}>1. Check Similar Listings</h2>
      <p>
        Look at items in the same category to see what others are charging. This helps you set competitive prices.
      </p>

      <h2 style={styles.subheading}>2. Consider Item Condition</h2>
      <ul style={styles.list}>
        <li style={styles.listItem}>New or barely used items can be priced higher.</li>
        <li style={styles.listItem}>Used or older items should be priced lower.</li>
      </ul>

      <h2 style={styles.subheading}>3. Include Accessories or Extras</h2>
      <p>
        If your item comes with extra accessories or original packaging, factor this into the price.
      </p>

      <h2 style={styles.subheading}>4. Factor in Negotiation</h2>
      <p>
        Price slightly higher if you expect buyers to negotiate. This ensures you still get a fair deal.
      </p>

      <h2 style={styles.subheading}>5. Seasonal Demand</h2>
      <p>
        Some items sell better during specific times of the year. Price accordingly to maximize interest.
      </p>

      <div style={styles.note}>
        <strong>Tip:</strong> Be honest with your pricing. A fair price builds trust and leads to faster sales on CampusCart!
      </div>
    </div>
  );
};

export default PricingGuide;

import React from "react";

const HowToSell = () => {
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
      <h1 style={styles.heading}>How to Sell on CampusCart</h1>

      <p>
        Selling your items on CampusCart is simple and secure! Follow these steps to reach fellow students quickly.
      </p>

      <h2 style={styles.subheading}>1. Create a Listing</h2>
      <p>
        Click "Sell" and fill in details about your item. Include a clear title, description, and accurate category.
      </p>

      <h2 style={styles.subheading}>2. Upload Photos</h2>
      <ul style={styles.list}>
        <li style={styles.listItem}>Take clear, well-lit pictures from multiple angles.</li>
        <li style={styles.listItem}>Show any wear or defects honestly.</li>
      </ul>

      <h2 style={styles.subheading}>3. Set a Fair Price</h2>
      <p>
        Research similar items to set a competitive price. You can also mark items as "Negotiable".
      </p>

      <h2 style={styles.subheading}>4. Communicate with Buyers</h2>
      <p>
        Respond quickly to messages. Answer questions honestly and politely. Arrange meetups or delivery options safely.
      </p>

      <h2 style={styles.subheading}>5. Complete the Sale</h2>
      <p>
        Meet at a safe location if selling in person. Confirm payment before handing over the item.  
      </p>

      <h2 style={styles.subheading}>6. Leave Feedback</h2>
      <p>
        After the sale, leave a rating and review for the buyer to help the community trust each other.
      </p>
    </div>
  );
};

export default HowToSell;

import React from "react";
import {
  Zap,
  Users,
  ShieldCheck,
  Wallet
} from "lucide-react";

const SellingSection = () => {
  const styles = {
    wrapper: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      padding: "20px 0",
    },
    container: {
      width: "100%",
      maxWidth: "1280px",
      background: "linear-gradient(120deg, #2563EB 0%, #4F46E5 100%)",
      color: "white",
      textAlign: "center",
      padding: "40px 24px",
      borderRadius: "24px",
      overflow: "hidden",
      position: "relative",
      boxShadow: "0 20px 40px rgba(37, 99, 235, 0.2)",
    },
    heading: {
      fontSize: "clamp(1.5rem, 4vw, 2.5rem)", // Reduced font size slightly
      fontWeight: "800",
      marginBottom: "12px",
      letterSpacing: "-0.02em",
    },
    subtext: {
      fontSize: "1rem",
      color: "rgba(255,255,255,0.9)",
      marginBottom: "24px",
      maxWidth: "600px",
      margin: "0 auto 24px auto",
      lineHeight: "1.6",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "16px",
      marginBottom: "32px",
      flexWrap: "wrap",
    },
    primaryButton: {
      backgroundColor: "white",
      color: "#2563EB",
      fontWeight: "700",
      padding: "16px 32px",
      borderRadius: "12px",
      border: "none",
      fontSize: "1rem",
      cursor: "pointer",
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    secondaryButton: {
      backgroundColor: "rgba(255,255,255,0.1)",
      color: "white",
      fontWeight: "600",
      padding: "16px 32px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.3)",
      fontSize: "1rem",
      cursor: "pointer",
      backdropFilter: "blur(10px)",
      transition: "background 0.2s",
    },
    featureContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "32px",
      maxWidth: "1000px",
      margin: "0 auto",
    },
    featureBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      padding: "20px",
    },
    featureIcon: {
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: "16px",
      width: "64px",
      height: "64px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "16px",
      color: "white",
      backdropFilter: "blur(5px)",
    },
    featureTitle: {
      fontWeight: "700",
      fontSize: "1.1rem",
      marginBottom: "8px",
    },
    featureText: {
      color: "rgba(255,255,255,0.8)",
      fontSize: "0.95rem",
      lineHeight: "1.5",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Ready to start selling?</h2>
        <p style={styles.subtext}>
          Join thousands of sellers and start earning today. List your products, rooms, services, or jobs in minutes.
        </p>

        <div style={styles.buttonGroup}>
          <button 
            style={styles.primaryButton}
            onClick={() => window.location.href = '/sell-item'}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
            }}
          >
            Start Selling Now
          </button>
          <button 
            style={styles.secondaryButton}
            onClick={() => window.location.href = '/for-users/how-to-sell'}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
          >
            Learn More
          </button>
        </div>

        <div style={styles.featureContainer}>
          <div style={styles.featureBox}>
            <div style={styles.featureIcon}><Zap size={32} /></div>
            <div style={styles.featureTitle}>Fast Listing</div>
            <div style={styles.featureText}>List in under 2 minutes with our easy tools.</div>
          </div>
          <div style={styles.featureBox}>
            <div style={styles.featureIcon}><Users size={32} /></div>
            <div style={styles.featureTitle}>Huge Audience</div>
            <div style={styles.featureText}>Reach thousands of local buyers instantly.</div>
          </div>
          <div style={styles.featureBox}>
            <div style={styles.featureIcon}><ShieldCheck size={32} /></div>
            <div style={styles.featureTitle}>Secure Platform</div>
            <div style={styles.featureText}>Verified users and secure communication.</div>
          </div>
          <div style={styles.featureBox}>
            <div style={styles.featureIcon}><Wallet size={32} /></div>
            <div style={styles.featureTitle}>Zero Fees</div>
            <div style={styles.featureText}>Keep 100% of your earnings. No hidden charges.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellingSection;

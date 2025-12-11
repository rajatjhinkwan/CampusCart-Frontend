import React from "react";
import {
  Zap,
  Users,
  ShieldCheck,
  DollarSign
} from "lucide-react";

const SellingSection = () => {
  const styles = {
    container: {
      background: "linear-gradient(180deg, #4462F1 0%, #F1A13B 100%)",
      color: "white",
      textAlign: "center",
      padding: "80px 20px",
      borderRadius: "0px",
      overflow: "hidden",
    },
    heading: {
      fontSize: "2.8rem",
      fontWeight: "700",
      marginBottom: "12px",
      textShadow: "1px 1px 4px rgba(0,0,0,0.3)"
    },
    subtext: {
      fontSize: "1.1rem",
      color: "rgba(255,255,255,0.95)",
      marginBottom: "50px",
      maxWidth: "650px",
      margin: "0 auto 50px auto"
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "30px",
      marginBottom: "50px",
      flexWrap: "wrap",
    },
    primaryButton: {
      backgroundColor: "white",
      color: "#4462F1",
      fontWeight: "600",
      padding: "10px 22px",
      borderRadius: "10px",
      border: "none",
      fontSize: "1.05rem",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      transition: "all 0.3s ease",
    },
    secondaryButton: {
      backgroundColor: "transparent",
      color: "white",
      fontWeight: "600",
      padding: "14px 32px",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.8)",
      fontSize: "1.05rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    featureContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "60px",
      flexWrap: "wrap",
      marginBottom: "30px",
    },
    featureBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "220px",
      textAlign: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "default",
    },
    featureBoxHover: {
      transform: "translateY(-10px)",
      boxShadow: "0 10px 20px rgba(0,0,0,0.25)"
    },
    featureIcon: {
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: "12px",
      width: "60px",
      height: "60px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "14px",
      fontSize: "26px",
      transition: "all 0.3s ease",
    },
    featureTitle: {
      fontWeight: "700",
      fontSize: "1.15rem",
      marginBottom: "6px",
    },
    featureText: {
      color: "rgba(255,255,255,0.9)",
      fontSize: "0.95rem",
    },
    statsContainer: {
      borderTop: "1px solid rgba(255,255,255,0.4)",
      paddingTop: "50px",
      display: "flex",
      justifyContent: "center",
      gap: "110px",
      flexWrap: "wrap",
      marginBottom: "25px",
    },
    statBox: {
      textAlign: "center",
      transition: "transform 0.3s ease",
    },
    statNumber: {
      fontSize: "2rem",
      fontWeight: "700",
      marginBottom: "6px",
      textShadow: "1px 1px 3px rgba(0,0,0,0.3)"
    },
    statText: {
      color: "rgba(255,255,255,0.95)",
      fontWeight: "500",
    },
    footerText: {
      color: "rgba(255,255,255,0.85)",
      fontSize: "0.95rem",
      marginTop: "10px",
      fontStyle: "italic"
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Ready to Start Selling?</h1>
      <p style={styles.subtext}>
        Join our community of millions and turn your unused items into cash. It's free, fast, and secure.
      </p>

      <div style={styles.buttonGroup}>
        <button
          style={styles.primaryButton}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#e0e7ff"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}
        >
          + Post Your First Ad
        </button>
        <button
          style={styles.secondaryButton}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Browse Listings
        </button>
      </div>

      <div style={styles.featureContainer}>
        {[
          { Icon: Zap, title: "Post in Minutes", text: "Quick and easy listing creation with photo upload" },
          { Icon: Users, title: "Reach People", text: "Connect with buyers and sellers in your area" },
          { Icon: ShieldCheck, title: "Safe & Secure", text: "Verified users and secure messaging system" },
          { Icon: DollarSign, title: "Free to Start", text: "No listing fees for basic ads, premium options available" },
        ].map((feature, i) => (
          <div
            key={i}
            style={styles.featureBox}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0px)"}
          >
            <div style={styles.featureIcon}><feature.Icon size={28} strokeWidth={2.2} /></div>
            <h3 style={styles.featureTitle}>{feature.title}</h3>
            <p style={styles.featureText}>{feature.text}</p>
          </div>
        ))}
      </div>

      <div style={styles.statsContainer}>
        {[
          { number: "2.5M+", text: "Active Listings" },
          { number: "500K+", text: "Happy Users" },
          { number: "1M+", text: "Successful Deals" },
          { number: "50+", text: "Cities Covered" },
        ].map((stat, i) => (
          <div key={i} style={styles.statBox}>
            <h2 style={styles.statNumber}>{stat.number}</h2>
            <p style={styles.statText}>{stat.text}</p>
          </div>
        ))}
      </div>

      <p style={styles.footerText}>Trusted by hundreds of users in Chamoli</p>
    </div>
  );
};

export default SellingSection;

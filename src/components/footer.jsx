import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const styles = {
    footerContainer: {
      backgroundColor: "#fff",
      color: "#1f2937",
      padding: "60px 80px",
      fontFamily: "Arial, sans-serif",
    },
    topSection: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      marginBottom: "40px",
    },
    leftSection: {
      flex: "1",
      minWidth: "250px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      textAlign: "left",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      fontSize: "22px",
      fontWeight: "bold",
      color: "#1e3a8a",
      marginBottom: "16px",
    },
    logoIcon: {
      backgroundColor: "#2563eb",
      color: "#fff",
      borderRadius: "8px",
      padding: "8px",
      marginRight: "10px",
      fontSize: "18px",
    },
    text: {
      color: "#4b5563",
      fontSize: "14px",
      lineHeight: "22px",
      marginBottom: "20px",
    },
    socialIcons: {
      display: "flex",
      gap: "20px",
    },
    socialIcon: {
      backgroundColor: "#f3f4f6",
      borderRadius: "8px",
      padding: "10px",
      fontSize: "18px",
      cursor: "pointer",
      transition: "0.3s",
    },
    linksContainer: {
      display: "flex",
      justifyContent: "space-between",
      flex: "2",
      flexWrap: "wrap",
      gap: "40px",
    },
    linkGroup: {
      minWidth: "150px",
    },
    linkHeading: {
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#111827",
    },
    link: {
      display: "block",
      color: "#4b5563",
      textDecoration: "none",
      marginBottom: "8px",
      fontSize: "14px",
      transition: "0.3s",
    },
    subscribeSection: {
      borderTop: "1px solid #e5e7eb",
      paddingTop: "30px",
      marginTop: "30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
    },
    subscribeText: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#111827",
    },
    subscribeBox: {
      display: "flex",
      alignItems: "center",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      overflow: "hidden",
    },
    subscribePara: {
      color: "gray",
      fontSize: "14px",
      marginBottom: "8px",
    },
    leftSubscribeSection: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      flexDirection: "column",
    },
    input: {
      padding: "12px 16px",
      border: "none",
      outline: "none",
      fontSize: "14px",
      width: "320px",
    },
    sendButton: {
      backgroundColor: "#2563eb",
      color: "#fff",
      padding: "12px 18px",
      cursor: "pointer",
      border: "none",
    },
    bottomBar: {
      borderTop: "1px solid #e5e7eb",
      marginTop: "30px",
      paddingTop: "20px",
      fontSize: "13px",
      color: "#6b7280",
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    bottomLinks: {
      display: "flex",
      gap: "16px",
    },
  };

  const linkGroups = [
    {
      title: "For Users",
      links: [
        { name: "How to Buy", path: "/how-to-buy" },
        { name: "How to Sell", path: "/how-to-sell" },
        { name: "Safety Tips", path: "/safety-tips" },
        { name: "Pricing Guide", path: "/pricing-guide" },
        { name: "Success Stories", path: "/success-stories" },
      ],
    },
    {
      title: "Categories",
      links: [
        { name: "Vehicles", path: "/vehicles" },
        { name: "Real Estate", path: "/real-estate" },
        { name: "Electronics", path: "/electronics" },
        { name: "Jobs", path: "/jobs" },
        { name: "Services", path: "/services" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Press", path: "/press" },
        { name: "Blog", path: "/blog" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "/help" },
        { name: "Community Guidelines", path: "/community-guidelines" },
        { name: "Report Issue", path: "/report-issue" },
        { name: "Privacy Policy", path: "/privacy-policy" },
        { name: "Terms of Service", path: "/terms-of-service" },
      ],
    },
  ];

  return (
    <footer style={styles.footerContainer}>
      {/* Top Section */}
      <div style={styles.topSection}>
        {/* Left side */}
        <div style={styles.leftSection}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>📦</div>
            Campus Cart
          </div>
          <p style={styles.text}>
            Campus Cart is India’s leading marketplace for buying and selling anything from vehicles to furniture, jobs to services. Join millions of users nationwide.
          </p>
          <div style={styles.socialIcons}>
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube].map((Icon, i) => (
              <div
                key={i}
                style={styles.socialIcon}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
              >
                <Icon color="#1f2937" />
              </div>
            ))}
          </div>
        </div>

        {/* Links Section */}
        <div style={styles.linksContainer}>
          {linkGroups.map((group, index) => (
            <div key={index} style={styles.linkGroup}>
              <h4 style={styles.linkHeading}>{group.title}</h4>
              {group.links.map((link, i) => (
                <Link key={i} to={link.path} style={styles.link}>
                  {link.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe Section */}
      <div style={styles.subscribeSection}>
        <div style={styles.leftSubscribeSection}>
          <p style={styles.subscribeText}>Stay Updated</p>
          <p style={styles.subscribePara}>Get the latest deals and updates from Campus Cart directly in your inbox</p>
        </div>
        <div style={styles.subscribeBox}>
          <input type="email" placeholder="Enter your email" style={styles.input} />
          <button style={styles.sendButton}>
            <FaPaperPlane />
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={styles.bottomBar}>
        <p>© 2025 Campus Cart. All rights reserved.</p>
        <div style={styles.bottomLinks}>
          <Link to="/privacy-policy" style={styles.link}>Privacy Policy</Link>
          <Link to="/terms-of-service" style={styles.link}>Terms of Service</Link>
          <Link to="/cookie-policy" style={styles.link}>Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const styles = {
    footerWrapper: {
      backgroundColor: "#fff",
      color: "#1f2937",
      padding: "60px 0 20px",
      fontFamily: "'Inter', sans-serif",
      borderTop: "1px solid #E2E8F0",
    },
    container: {
      width: "100%",
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 24px",
      boxSizing: "border-box",
    },
    topSection: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      marginBottom: "60px",
      gap: "40px",
    },
    leftSection: {
      flex: "1",
      minWidth: "280px",
      maxWidth: "360px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      textAlign: "left",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      fontSize: "24px",
      fontWeight: "800",
      color: "#1E293B",
      marginBottom: "20px",
      letterSpacing: "-0.02em",
    },
    logoIcon: {
      backgroundColor: "#2563EB",
      color: "#fff",
      borderRadius: "10px",
      padding: "8px",
      marginRight: "12px",
      fontSize: "20px",
      boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
    },
    text: {
      color: "#64748B",
      fontSize: "15px",
      lineHeight: "1.6",
      marginBottom: "24px",
    },
    socialIcons: {
      display: "flex",
      gap: "12px",
    },
    socialIcon: {
      backgroundColor: "#F1F5F9",
      borderRadius: "10px",
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      color: "#64748B",
    },
    linksContainer: {
      display: "flex",
      justifyContent: "space-between",
      flex: "2",
      flexWrap: "wrap",
      gap: "40px",
    },
    linkGroup: {
      minWidth: "140px",
    },
    linkHeading: {
      fontWeight: "700",
      marginBottom: "20px",
      color: "#0F172A",
      fontSize: "16px",
    },
    link: {
      display: "block",
      color: "#64748B",
      textDecoration: "none",
      marginBottom: "12px",
      fontSize: "14px",
      transition: "color 0.2s",
    },
    subscribeSection: {
      backgroundColor: "#F8FAFF",
      borderRadius: "20px",
      padding: "32px",
      marginBottom: "40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "20px",
      border: "1px solid #F1F5F9",
    },
    subscribeText: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#0F172A",
      marginBottom: "8px",
    },
    subscribeBox: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#fff",
      border: "1px solid #E2E8F0",
      borderRadius: "12px",
      overflow: "hidden",
      padding: "4px",
      width: "100%",
      maxWidth: "400px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    },
    subscribePara: {
      color: "#64748B",
      fontSize: "15px",
      margin: 0,
    },
    leftSubscribeSection: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
    },
    input: {
      padding: "12px 16px",
      border: "none",
      outline: "none",
      fontSize: "15px",
      width: "100%",
      color: "#334155",
    },
    sendButton: {
      backgroundColor: "#2563EB",
      color: "#fff",
      padding: "10px 24px",
      cursor: "pointer",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      transition: "background 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    bottomBar: {
      borderTop: "1px solid #F1F5F9",
      paddingTop: "30px",
      fontSize: "14px",
      color: "#94A3B8",
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "20px",
      alignItems: "center",
    },
    bottomLinks: {
      display: "flex",
      gap: "24px",
    },
    bottomLink: {
      color: "#64748B",
      textDecoration: "none",
      transition: "color 0.2s",
    }
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
    <footer style={styles.footerWrapper}>
      <div style={styles.container}>
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2563EB";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#F1F5F9";
                    e.currentTarget.style.color = "#64748B";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Icon />
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
                  <Link 
                    key={i} 
                    to={link.path} 
                    style={styles.link}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#2563EB"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
                  >
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
            <input type="email" placeholder="Enter your email address" style={styles.input} />
            <button 
              style={styles.sendButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1D4ED8"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2563EB"}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <p>© 2025 Campus Cart. All rights reserved.</p>
          <div style={styles.bottomLinks}>
            <Link 
              to="/privacy-policy" 
              style={styles.bottomLink}
              onMouseEnter={(e) => e.currentTarget.style.color = "#2563EB"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms-of-service" 
              style={styles.bottomLink}
              onMouseEnter={(e) => e.currentTarget.style.color = "#2563EB"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
            >
              Terms of Service
            </Link>
            <Link 
              to="/cookie-policy" 
              style={styles.bottomLink}
              onMouseEnter={(e) => e.currentTarget.style.color = "#2563EB"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

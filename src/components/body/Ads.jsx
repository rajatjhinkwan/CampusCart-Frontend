import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ShoppingCart, ArrowRight, CheckCircle } from "lucide-react";

const Ads = () => {
  const navigate = useNavigate();

  // Images from the original file to be used in the new design
  const heroImage1 = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1000"; // Living room / Home
  const heroImage2 = "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687"; // Lifestyle / People

  const styles = {
    wrapper: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      padding: "40px 24px",
      backgroundColor: "#fff",
      overflow: "hidden", // Prevent scrollbars from floating elements
    },
    // Animation styles are injected via style tag below
    container: {
      width: "100%",
      maxWidth: "1280px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "40px",
      flexWrap: "wrap", // For responsiveness
    },
    leftContent: {
      flex: "1 1 500px", // Grow, shrink, basis
      paddingRight: "20px",
    },
    tagline: {
      display: "inline-block",
      backgroundColor: "#fff7ed",
      color: "#ea580c",
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "700",
      marginBottom: "24px",
      letterSpacing: "1px",
      textTransform: "uppercase",
    },
    heading: {
      fontSize: "56px",
      lineHeight: "1.1",
      fontWeight: "800",
      color: "#111827",
      marginBottom: "24px",
      fontFamily: "'Inter', sans-serif",
    },
    highlight: {
      color: "#ea580c", // Orange color for highlight
    },
    subtext: {
      fontSize: "18px",
      lineHeight: "1.6",
      color: "#4b5563",
      marginBottom: "40px",
      maxWidth: "540px",
    },
    buttonGroup: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
      alignItems: "center",
      marginBottom: "40px",
    },
    primaryBtn: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      backgroundColor: "#111827",
      color: "#fff",
      padding: "16px 32px",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "16px",
      border: "none",
      cursor: "pointer",
      transition: "transform 0.2s",
    },
    secondaryBtn: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      backgroundColor: "#fff",
      color: "#111827",
      padding: "16px 32px",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "16px",
      border: "1px solid #e5e7eb",
      cursor: "pointer",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      transition: "transform 0.2s",
    },
    iconBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ea580c",
      color: "#fff",
      width: "56px",
      height: "56px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    verification: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: "#6b7280",
      fontWeight: "500",
    },
    // Right side floating images
    rightContent: {
      flex: "1 1 500px",
      position: "relative",
      height: "500px", // Fixed height for image area
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    imageWrapper: {
      position: "relative",
      width: "100%",
      height: "100%",
      maxWidth: "600px",
    },
    mainImg: {
      position: "absolute",
      top: "0",
      right: "0",
      width: "75%",
      height: "75%",
      objectFit: "cover",
      borderRadius: "24px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      zIndex: 1,
      animation: "float 6s ease-in-out infinite",
    },
    floatingImg: {
      position: "absolute",
      bottom: "20px",
      left: "0",
      width: "55%",
      height: "55%",
      objectFit: "cover",
      borderRadius: "24px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      zIndex: 2,
      border: "8px solid #fff", // White border to separate
      animation: "float-delayed 7s ease-in-out infinite",
    },
    floatingBadge: {
      position: "absolute",
      bottom: "140px", // Adjust based on floating image position
      left: "40%",
      transform: "translateX(-50%)",
      backgroundColor: "#fff",
      padding: "12px 20px",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      zIndex: 3,
      display: "flex",
      alignItems: "center",
      gap: "10px",
      minWidth: "180px",
      animation: "float 8s ease-in-out infinite",
    },
    badgeText: {
      display: "flex",
      flexDirection: "column",
    },
    badgeTitle: {
      fontSize: "12px",
      color: "#6b7280",
      fontWeight: "600",
      textTransform: "uppercase",
    },
    badgeValue: {
      fontSize: "16px",
      color: "#111827",
      fontWeight: "700",
    }
  };

  return (
    <div style={styles.wrapper}>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          @keyframes float-delayed {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
      <div style={styles.container}>
        
        {/* Left Side Content */}
        <div style={styles.leftContent}>
          <div style={styles.tagline}>● India's Trusted Marketplace</div>
          
          <h1 style={styles.heading}>
            A New City.<br />
            <span style={styles.highlight}>Fashioned by You.</span>
          </h1>
          
          <p style={styles.subtext}>
            Whether you're moving to Bangalore for a startup job or Delhi for studies, 
            find pre-loved essentials and rent verified flats without the brokerage hassle.
          </p>
          
          <div style={styles.buttonGroup}>
            <button 
              style={styles.primaryBtn}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              onClick={() => navigate('/properties')} // Assuming route
            >
              <Home size={20} />
              Rent a Home
            </button>
            
            <button 
              style={styles.secondaryBtn}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              onClick={() => navigate('/products')} // Assuming route
            >
              <ShoppingCart size={20} />
              Buy Essentials
            </button>
            
            <button 
              style={styles.iconBtn}
              onClick={() => navigate('/all-categories')}
            >
              <ArrowRight size={24} />
            </button>
          </div>
          
          <div style={styles.verification}>
            <CheckCircle size={16} color="#22c55e" fill="#22c55e" />
            <span style={{color: "#22c55e", display: "flex", alignItems: "center", gap: "6px"}}>Verified with Basic ID / Aadhar verification</span>
          </div>
        </div>

        {/* Right Side Floating Images */}
        <div style={styles.rightContent}>
          <div style={styles.imageWrapper}>
            {/* Background/Main Image (Top Right) */}
            <img 
              src={heroImage1} 
              alt="Modern Interior" 
              style={styles.mainImg} 
            />
            
            {/* Foreground/Floating Image (Bottom Left) */}
            <img 
              src={heroImage2} 
              alt="Happy People" 
              style={styles.floatingImg} 
            />

            {/* Floating Badge (Optional - adds to the "floating" feel) */}
            <div style={styles.floatingBadge}>
              <div style={{
                width: "40px", 
                height: "40px", 
                borderRadius: "50%", 
                backgroundColor: "#dcfce7", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center"
              }}>
                <CheckCircle size={24} color="#16a34a" />
              </div>
              <div style={styles.badgeText}>
                <span style={styles.badgeTitle}>Listing Status</span>
                <span style={styles.badgeValue}>Verified Owner</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Ads;

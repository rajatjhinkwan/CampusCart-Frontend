import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  CheckCircle2,
  Tag,
  User,
  Clock,
  Briefcase,
} from "lucide-react";
import { useUserStore } from "../../store/userStore";

// ------------------------------
// LOCATION NORMALIZER
// ------------------------------
const normalizeLocation = (loc) => {
  if (!loc) return "Unknown";
  if (typeof loc === "string") {
    const s = loc.trim();
    if (s.startsWith("{") && s.endsWith("}")) {
      try {
        const parsed = JSON.parse(s);
        const { address, area, city, state, pincode } = parsed || {};
        const str = [address, area, city, state, pincode].filter(Boolean).join(", ");
        return str || "Unknown";
      } catch {
        return s;
      }
    }
    return s;
  }
  if (typeof loc === "object") {
    const { address, area, city, state, pincode } = loc;
    const str = [address, area, city, state, pincode].filter(Boolean).join(", ");
    return str || "Unknown";
  }
  return "Unknown";
};

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { wishlistProductIds, toggleWishlist } = useUserStore();
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  if (!product) return null;

  const finalLocation = normalizeLocation(product.location);
  const productId = product.id || product._id;
  const isLiked = productId ? wishlistProductIds.includes(String(productId)) : false;

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // PRODUCT ONLY
  const isNew = product.type === "Product" && product.condition === "New";

  // ------------------------------
  // LIKE HANDLER
  // ------------------------------
  const handleLike = (e) => {
    e.stopPropagation();
    if (productId) {
      toggleWishlist(String(productId));
    }
  };

  // ------------------------------
  // CORRECT NAVIGATION — FIXED
  // ------------------------------
  const handleNavigate = () => {
    // 🔥 FIX: JOB uses `_id` from DB, not `id`
    const id = product.id || product._id;

    if (product.type === "Job") {
      navigate(`/jobs/${id}`);
    } else if (product.type === "Room") {
      navigate(`/rooms/${id}`);
    } else if (product.type === "Service") {
      navigate(`/services/${id}`);
    } else {
      navigate(`/product/${id}`);
    }
  };

  // ------------------------------
  // STYLES
  // ------------------------------
  const styles = {
    card: {
      backgroundColor: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
      position: "relative",
      height: "100%",
      transition: "0.2s ease",
    },
    imageWrapper: {
      width: "100%",
      paddingTop: isMobile ? "62%" : "70%",
      position: "relative",
      backgroundColor: "#f1f5f9",
    },
    img: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    badgeOverlay: {
      position: "absolute",
      top: "10px",
      left: "10px",
      right: "10px",
      display: "flex",
      justifyContent: "space-between",
    },
    tag: {
      fontSize: isMobile ? "9px" : "10px",
      fontWeight: "700",
      padding: "4px 8px",
      borderRadius: "4px",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    tagNew: { backgroundColor: "#10b981" },
    tagRent: { backgroundColor: "#f59e0b" },
    tagCondition: { backgroundColor: "#3b82f6" },
    tagJob: { backgroundColor: "#9333ea" },
    heartBtn: {
      width: isMobile ? "28px" : "32px",
      height: isMobile ? "28px" : "32px",
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.95)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      transition: "0.1s",
    },
    content: {
      padding: isMobile ? "12px" : "16px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      flex: 1,
    },
    price: {
      fontSize: isMobile ? "16px" : "18px",
      fontWeight: "700",
      color: "#0f172a",
    },
    title: {
      fontSize: isMobile ? "14px" : "15px",
      fontWeight: "500",
      color: "#334155",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    location: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: isMobile ? "11px" : "12px",
      color: "#94a3b8",
    },
    divider: {
      height: "1px",
      backgroundColor: "#f1f5f9",
      margin: isMobile ? "6px 0" : "8px 0",
    },
    seller: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      color: "#64748b",
      fontSize: isMobile ? "11px" : "12px",
    },
  };

  return (
    <div
      style={styles.card}
      onClick={handleNavigate}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 10px 15px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* ------------------------------ */}
      {/* IMAGE */}
      {/* ------------------------------ */}
      <div style={styles.imageWrapper}>
        <img
          src={product.image || "https://via.placeholder.com/300"}
          alt={product.title}
          style={styles.img}
        />

        <div style={styles.badgeOverlay}>
          <div>
            {product.type === "Job" ? (
              <div style={{ ...styles.tag, ...styles.tagJob }}>
                <Briefcase size={10} /> JOB
              </div>
            ) : isNew ? (
              <div style={{ ...styles.tag, ...styles.tagNew }}>
                <Tag size={10} /> NEW
              </div>
            ) : (
              <div style={{ ...styles.tag, ...styles.tagCondition }}>
                {product.condition || "Condition"}
              </div>
            )}
          </div>

          {/* LIKE BUTTON */}
          <div
            style={styles.heartBtn}
            onClick={handleLike}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <Heart
              size={18}
              fill={isLiked ? "#ef4444" : "transparent"}
              color={isLiked ? "#ef4444" : "#9ca3af"}
            />
          </div>
        </div>
      </div>

      {/* ------------------------------ */}
      {/* CONTENT */}
      {/* ------------------------------ */}
      <div style={styles.content}>
        <span style={styles.price}>
          {product.type === "rent"
            ? `₹${product.rentalPrice || product.price}/${product.rentalPeriod || "mo"}`
            : product.price}
        </span>

        <div style={styles.title}>{product.title}</div>

        <div style={styles.location}>
          <MapPin size={12} /> {finalLocation}
        </div>

        <div style={styles.divider}></div>

        {/* FOOTER */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={styles.seller}>
            <User size={12} /> {product.seller || product.companyName}
            <CheckCircle2 size={10} color="#3b82f6" fill="#3b82f6" />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            <Clock size={12} /> {product.date || "Recently"}
          </div>
        </div>
      </div>
    </div>
  );
}

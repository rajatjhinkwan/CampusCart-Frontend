import React, { useEffect, useState } from "react";
import axios from "../../../lib/axios";

function LatestListings() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const styles = {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#fff", // Changed to white to alternate with NearYou (#F8FAFF)
      padding: "40px 0",
    },
    header: {
      width: "100%",
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 24px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : isTablet ? "repeat(2, 1fr)" : "repeat(1, 1fr)",
      gap: "24px",
      width: "100%",
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 24px",
      boxSizing: "border-box",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "16px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
      border: "1px solid #f1f5f9",
      overflow: "hidden",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
    },
    imageBox: {
      position: "relative",
      width: "100%",
      paddingTop: "75%", // 4:3 Aspect Ratio
      overflow: "hidden",
      backgroundColor: "#f1f5f9",
    },
    image: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s ease",
    },
    content: {
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      flex: 1,
    },
    priceRow: {
      display: "flex",
      alignItems: "baseline",
      gap: "8px",
      marginBottom: "8px",
    },
    price: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#0F172A",
    },
    oldPrice: {
      textDecoration: "line-through",
      color: "#94A3B8",
      fontSize: "14px",
    },
    title: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#334155",
      marginBottom: "8px",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      height: "44px", // Fixed height for 2 lines
    },
    location: {
      fontSize: "13px",
      color: "#64748B",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    tags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      marginTop: "auto",
      marginBottom: "16px",
    },
    tag: (bg, color) => ({
      backgroundColor: bg,
      color: color,
      fontSize: "11px",
      fontWeight: "600",
      padding: "4px 8px",
      borderRadius: "6px",
    }),
    footer: {
      marginTop: "auto",
      paddingTop: "12px",
      borderTop: "1px solid #F1F5F9",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    user: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    avatar: (color) => ({
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      backgroundColor: color,
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "10px",
      fontWeight: "bold",
    }),
    userName: {
      fontSize: "13px",
      color: "#475569",
      fontWeight: "500",
    },
    rating: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "13px",
      fontWeight: "600",
      color: "#F59E0B",
    },
    sectionTitle: {
      fontSize: "28px",
      fontWeight: "800",
      color: "#1E293B",
      margin: 0,
      letterSpacing: "-0.02em",
    },
    sectionSubtitle: {
      color: "#64748B",
      marginTop: "8px",
      fontSize: "16px",
    },
    viewAllBtn: {
      background: "transparent",
      border: "1px solid #E2E8F0",
      color: "#1E293B",
      padding: "10px 20px",
      borderRadius: "10px",
      textDecoration: "none",
      fontWeight: "600",
      fontSize: "14px",
      transition: "all 0.2s",
    }
  };

  const normalizeLocation = (loc) => {
    if (!loc) return "Location not set";
    if (typeof loc === "string") {
      const s = loc.trim();
      if (s.startsWith("{") && s.endsWith("}")) {
        try {
          const parsed = JSON.parse(s);
          const { address, area, city, state, pincode } = parsed || {};
          const str = [address, area, city, state, pincode].filter(Boolean).join(", ");
          return str || "Location not set";
        } catch {
          return s;
        }
      }
      return s;
    }
    if (typeof loc === "object") {
      const { address, area, city, state, pincode } = loc;
      const str = [address, area, city, state, pincode].filter(Boolean).join(", ");
      return str || "Location not set";
    }
    return "Location not set";
  };

  const [items, setItems] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Skeleton Styles
  const skeletonStyles = {
    card: {
      ...styles.card,
      pointerEvents: "none",
    },
    image: {
      ...styles.imageBox,
      backgroundColor: "#e2e8f0",
      animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    },
    content: {
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    line: (width, height = "16px") => ({
      width,
      height,
      backgroundColor: "#e2e8f0",
      borderRadius: "4px",
      animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    }),
    circle: {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      backgroundColor: "#e2e8f0",
      animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    }
  };

  const SkeletonCard = () => (
    <div style={skeletonStyles.card}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
          }
        `}
      </style>
      <div style={skeletonStyles.image}></div>
      <div style={skeletonStyles.content}>
        <div style={skeletonStyles.line("40%", "24px")}></div>
        <div style={skeletonStyles.line("90%", "20px")}></div>
        <div style={skeletonStyles.line("60%", "20px")}></div>
        <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
          <div style={skeletonStyles.line("30%", "20px")}></div>
          <div style={skeletonStyles.line("30%", "20px")}></div>
        </div>
        <div style={{ ...styles.footer, marginTop: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={skeletonStyles.circle}></div>
            <div style={skeletonStyles.line("80px", "14px")}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const fallbackCards = [
    { image: "https://images.unsplash.com/photo-1599202860130-f600f4948364?auto=format&fit=crop&q=60&w=600", title: "iPhone 15 Pro Max – Excellent Condition", price: "₹1,18,999", oldPrice: "₹1,29,999", location: "Gopeshwar, Chamoli", tags: [{ text: "Electronics", bg: "#E0F2FE", color: "#0369A1" }, { text: "Like New", bg: "#DCFCE7", color: "#15803D" }], user: { name: "Aman Rawat", color: "#2563EB", rating: 4.9 } },
    { image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", title: "2 BHK Flat for Rent – Fully Furnished", price: "₹16,500/month", location: "Chamoli Bazar, Chamoli", tags: [{ text: "Real Estate", bg: "#E0F2FE", color: "#0369A1" }, { text: "Excellent", bg: "#DCFCE7", color: "#15803D" }], user: { name: "Manjeet Singh", color: "#6366F1", rating: 4.7 } },
    { image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8", title: "MacBook Air M2 – 8GB RAM, 512GB SSD", price: "₹1,05,999", oldPrice: "₹1,19,999", location: "Nandprayag, Chamoli", tags: [{ text: "Electronics", bg: "#FEF3C7", color: "#92400E" }, { text: "Warranty", bg: "#E0F2FE", color: "#0369A1" }], user: { name: "Divya Bhatt", color: "#EF4444", rating: 4.6 } },
    { image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=60&w=600", title: "Sony WH-1000XM5 Noise Cancelling Headphones", price: "₹24,990", oldPrice: "₹29,990", location: "Karnaprayag, Chamoli", tags: [{ text: "Audio", bg: "#E0F2FE", color: "#0369A1" }], user: { name: "Rahul Negi", color: "#F59E0B", rating: 4.8 } },
  ];

  useEffect(() => {
    const mapToCard = (entity, type) => {
      const image =
        entity.image ||
        (Array.isArray(entity.images) && entity.images[0]?.url) ||
        "https://via.placeholder.com/300";
      const price =
        typeof entity.price === "number"
          ? `₹${entity.price.toLocaleString('en-IN')}`
          : entity.price || (entity.rent ? `₹${Number(entity.rent).toLocaleString('en-IN')}/month` : "");
      const location = normalizeLocation(entity.location);
      const title =
        entity.title ||
        (type === "job" ? `${entity.companyName || "Company"} – ${entity.jobType || ""}` : "Untitled");
      const user = entity.user || entity.seller || entity.provider || entity.postedBy || {};
      const userName = user?.name || "Seller";
      const userColor = user?.color || "#3b82f6";
      const rawRating = user?.rating ?? entity.rating;
      const rating =
        typeof rawRating === "object"
          ? (rawRating.average ?? "New")
          : (rawRating ?? "New");

      return {
        image,
        title,
        price,
        oldPrice: entity.oldPrice,
        location,
        tags: Array.isArray(entity.tags)
          ? entity.tags.map((t) =>
              typeof t === "string" ? { text: t, bg: "#F1F5F9", color: "#475569" } : t
            )
          : [],
        user: { name: userName, color: userColor, rating },
        createdAt: entity.createdAt || new Date().toISOString(),
      };
    };

    const run = async () => {
      setLoadingProducts(true);
      try {
        const productsRes = await axios.get("/api/products", { params: { limit: 8, sort: "createdAt_desc" } });
        const products = Array.isArray(productsRes.data?.products)
          ? productsRes.data.products
          : (Array.isArray(productsRes.data?.data) ? productsRes.data.data : []);
        const mapped = products.map((p) => mapToCard(p, "product"));
        let sorted = mapped.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Ensure at least 4 items for a full row if data is sparse
        if (sorted.length > 0 && sorted.length < 4) {
           const placeholders = fallbackCards.slice(0, 4 - sorted.length);
           sorted = [...sorted, ...placeholders];
        } else if (sorted.length > 4 && sorted.length < 8) {
           const placeholders = fallbackCards.slice(0, 8 - sorted.length);
           sorted = [...sorted, ...placeholders];
        }

        setItems(sorted.slice(0, 8)); // increased to 8 for 4-column grid
      } catch (e) {
        console.error(e);
        setItems(fallbackCards);
      } finally {
        setLoadingProducts(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    const mapRoom = (entity) => {
      const image =
        entity.image ||
        (Array.isArray(entity.images) && entity.images[0]?.url) ||
        "https://via.placeholder.com/300";
      const price = entity.rent ? `₹${Number(entity.rent).toLocaleString('en-IN')}/month` : "";
      const location = normalizeLocation(entity.location);
      const title = entity.title || "Room";
      const user = entity.seller || {};
      const ratingRaw = user?.rating ?? entity.rating;
      const rating =
        typeof ratingRaw === "object"
          ? (ratingRaw?.average ?? "New")
          : (ratingRaw ?? "New");
      return {
        image,
        title,
        price,
        location,
        tags: Array.isArray(entity.tags)
          ? entity.tags.map((t) =>
              typeof t === "string" ? { text: t, bg: "#F1F5F9", color: "#475569" } : t
            )
          : [],
        user: { name: user?.name || "Seller", color: user?.color || "#3b82f6", rating },
        createdAt: entity.createdAt || new Date().toISOString(),
      };
    };
    const runRooms = async () => {
      setLoadingRooms(true);
      try {
        const res = await axios.get("/api/rooms", { params: { page: 1, limit: 8 } });
        let list = Array.isArray(res.data?.data) ? res.data.data : [];
        let mapped = list.map(mapRoom).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Ensure at least 4 items for a full row if data is sparse
        if (mapped.length > 0 && mapped.length < 4) {
           const placeholders = fallbackCards.slice(0, 4 - mapped.length).map(c => ({...c, price: "₹12,000/month"}));
           mapped = [...mapped, ...placeholders];
        }

        setRooms(mapped.slice(0, 8));
      } catch (e) {
        console.error(e);
        // Fallback for rooms if API fails
        setRooms(fallbackCards.map(c => ({...c, price: "₹15,000/month"})));
      } finally {
        setLoadingRooms(false);
      }
    };
    runRooms();
  }, []);

  const ListingSection = ({ title, subtitle, link, linkText, data, loading }) => (
    <div style={{ marginBottom: "60px" }}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.sectionTitle}>{title}</h2>
          <p style={styles.sectionSubtitle}>{subtitle}</p>
        </div>
        <a 
          href={link} 
          style={styles.viewAllBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F1F5F9";
            e.currentTarget.style.borderColor = "#CBD5E1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "#E2E8F0";
          }}
        >
          {linkText}
        </a>
      </div>
      <div style={styles.grid}>
        {loading 
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : data.map((item, index) => (
          <div
            key={index}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              e.currentTarget.querySelector('img').style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)";
              e.currentTarget.querySelector('img').style.transform = "scale(1)";
            }}
          >
            <div style={styles.imageBox}>
              <img src={item.image} alt={item.title} style={styles.image} />
            </div>

            <div style={styles.content}>
              <div style={styles.priceRow}>
                <span style={styles.price}>{item.price}</span>
                {item.oldPrice && <span style={styles.oldPrice}>{item.oldPrice}</span>}
              </div>
              
              <h3 style={styles.title}>{item.title}</h3>
              
              <div style={styles.location}>
                <i className="fa-solid fa-location-dot" style={{ color: "#94A3B8" }}></i>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.location}
                </span>
              </div>

              <div style={styles.tags}>
                {item.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} style={styles.tag(tag.bg, tag.color)}>
                    {tag.text}
                  </span>
                ))}
              </div>
              
              <div style={styles.footer}>
                <div style={styles.user}>
                  <div style={styles.avatar(item.user.color)}>
                    {item.user.name.charAt(0)}
                  </div>
                  <span style={styles.userName}>
                    {item.user.name.split(' ')[0]}
                  </span>
                </div>
                <div style={styles.rating}>
                  <i className="fa-solid fa-star"></i>
                  {item.user.rating}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.wrapper}>
      <ListingSection 
        title="Fresh Recommendations" 
        subtitle="Based on your search history"
        link="/browse?sort=newest" 
        linkText="View all listings" 
        data={items}
        loading={loadingProducts}
      />
      
      <ListingSection 
        title="Rooms & Flats" 
        subtitle="Verified spaces near you"
        link="/rooms" 
        linkText="Browse all spaces" 
        data={rooms}
        loading={loadingRooms}
      />
    </div>
  );
}

export default LatestListings;

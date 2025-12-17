import React, { useEffect, useState } from "react";
import axios from "../../../lib/axios";
import { useUserStore } from "../../../store/userStore";

function NearYou() {
  const { user } = useUserStore.getState();
  const [city, setCity] = useState("");
  const [items, setItems] = useState([]);

  const formatTimeAgo = (iso) => {
    if (!iso) return "";
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    let resolved = "";
    const fromProfile = user?.location || "";
    if (fromProfile) {
      resolved = String(fromProfile).split(",")[0].trim();
    }
    if (!resolved && typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => { setCity("Chamoli"); },
        () => { setCity("Chamoli"); },
        { timeout: 3000 }
      );
    } else {
      setCity(resolved || "Chamoli");
    }
  }, [user]);

  useEffect(() => {
    if (!city) return;
    const mapCard = (entity, type) => {
      const img =
        entity.image ||
        (Array.isArray(entity.images) && entity.images[0]?.url) ||
        "https://via.placeholder.com/300";
      let price = "";
      if (type === "product" && entity.type === "rent") {
          price = `₹${entity.rentalPrice || entity.price}/${entity.rentalPeriod || "mo"}`;
      } else if (typeof entity.price === "number") {
          price = `₹${entity.price}`;
      } else if (entity.price) {
          price = entity.price;
      } else if (entity.rent) {
          price = `₹${entity.rent}/month`;
      }
      const loc =
        entity.location?.city ||
        entity.location?.area ||
        entity.location ||
        "Near you";
      const title =
        entity.title ||
        (type === "job" ? `${entity.companyName || "Company"} – ${entity.jobType || ""}` : "Untitled");
      const rawRating = entity.user?.rating ?? entity.seller?.rating ?? entity.provider?.rating ?? entity.rating;
      const rating = typeof rawRating === "object"
        ? (rawRating?.average ?? "New")
        : (rawRating ?? "New");
      const tag =
        type === "product" ? (entity.category?.name || entity.category || "Product")
        : type === "room" ? "Real Estate"
        : type === "service" ? (entity.category || "Service")
        : "Job";

      return {
        image: img,
        distance: "•",
        title,
        price,
        oldPrice: entity.oldPrice,
        location: loc,
        time: formatTimeAgo(entity.createdAt),
        tag,
        rating,
      };
    };

    const run = async () => {
      try {
        const [pRes, rRes, sRes, jRes] = await Promise.all([
          axios.get("/api/products", { params: { location: city, limit: 6 } }),
          axios.get("/api/rooms/filter", { params: { city, limit: 6, sort: "createdAt_desc" } }),
          axios.get("/api/services/filter", { params: { city, limit: 6 } }),
          axios.get("/api/jobs/filter", { params: { location: city, limit: 6 } }),
        ]);
        const products = Array.isArray(pRes.data?.products) ? pRes.data.products : (Array.isArray(pRes.data?.data) ? pRes.data.data : []);
        const rooms = Array.isArray(rRes.data?.data) ? rRes.data.data : [];
        const services = Array.isArray(sRes.data?.data) ? sRes.data.data : [];
        const jobs = Array.isArray(jRes.data?.jobs) ? jRes.data.jobs : [];

        const combined = [
          ...products.map((e) => mapCard(e, "product")),
          ...rooms.map((e) => mapCard(e, "room")),
          ...services.map((e) => mapCard(e, "service")),
          ...jobs.map((e) => mapCard(e, "job")),
        ];
        
        // Fill to ensure full rows (professional look)
        if (combined.length > 0 && combined.length < 4) {
           // Add placeholders if very few items
        }
        setItems(combined.slice(0, 8));
      } catch (err) {
        console.error(err);
      }
    };
    run();
  }, [city]);

  // Responsive logic
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : isTablet ? "repeat(2, 1fr)" : "repeat(1, 1fr)",
    gap: "24px",
    width: "100%",
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 24px",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
  };

  const imageBox = {
    position: "relative",
    width: "100%",
    paddingTop: "60%", // Aspect ratio
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
  };

  const imageStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const distanceStyle = {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "600",
    padding: "4px 8px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    backdropFilter: "blur(4px)",
  };

  const heartStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    color: "#fff",
    fontSize: "18px",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
    cursor: "pointer",
  };

  const contentStyle = {
    padding: "16px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  const titleStyle = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const priceStyle = {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: "18px",
    marginBottom: "8px",
  };

  const oldPriceStyle = {
    textDecoration: "line-through",
    color: "#94A3B8",
    fontSize: "13px",
    fontWeight: "400",
    marginLeft: "8px",
  };

  const locTimeStyle = {
    fontSize: "13px",
    color: "#64748B",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "12px",
  };

  const bottomRow = {
    marginTop: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #F1F5F9",
    paddingTop: "12px",
  };

  const tagBox = {
    backgroundColor: "#F1F5F9",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "600",
    padding: "4px 8px",
    borderRadius: "6px",
    textTransform: "uppercase",
  };

  const ratingStyle = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#FBBF24",
    fontSize: "13px",
    fontWeight: "600",
  };
  const cards = items;

  return (
    <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#F8FAFF", padding: "40px 0" }}>
      <div style={{ width: "100%", maxWidth: "1280px", margin: "0 auto", padding: "0 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#1E293B" }}>Near You</p>
          <p style={{ color: "#64748B", marginTop: 6, fontSize: "16px" }}>Items and services available in {city}</p>
        </div>
        <a href="/browse" style={{ background: "#fff", border: "1px solid #E2E8F0", color: "#1E293B", padding: "10px 20px", borderRadius: "10px", textDecoration: "none", fontWeight: 600, fontSize: "14px", transition: "0.2s" }}>
          View Map
        </a>
      </div>
      
      <div style={containerStyle}>
        {cards.map((item, index) => (
          <div
            key={index}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
            }}
          >
            <div style={imageBox}>
              <img src={item.image} alt={item.title} style={imageStyle} />
              <div style={distanceStyle}>
                <i className="fa-solid fa-location-arrow" /> {item.distance}
              </div>
              <i className="fa-regular fa-heart" style={heartStyle}></i>
            </div>

            <div style={contentStyle}>
              <div style={priceStyle}>
                {item.price}
                {item.oldPrice && <span style={oldPriceStyle}>{item.oldPrice}</span>}
              </div>
              <div style={titleStyle}>{item.title}</div>

              <div style={locTimeStyle}>
                <i className="fa-solid fa-location-dot" style={{ color: "#94A3B8" }}></i> 
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "120px" }}>{item.location}</span>
                <span style={{ margin: "0 4px" }}>•</span>
                <span>{item.time}</span>
              </div>

              <div style={bottomRow}>
                <span style={tagBox}>{item.tag}</span>
                <div style={ratingStyle}>
                  <i className="fa-solid fa-star"></i> {item.rating}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NearYou;

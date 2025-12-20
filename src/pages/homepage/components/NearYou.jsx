import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJsApiLoader } from '@react-google-maps/api';
import axios from "../../../lib/axios";
import { useUserStore } from "../../../store/userStore";
import Skeleton from "../../../components/Skeleton";

const SpotlightCard = ({ children, style, ...props }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = (e) => {
    setOpacity(1);
    if (props.onMouseEnter) props.onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    setOpacity(0);
    if (props.onMouseLeave) props.onMouseLeave(e);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
      }}
      {...props}
    >
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity,
          transition: 'opacity 0.3s',
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.1), transparent 40%)`,
          zIndex: 10,
        }}
      />
      {children}
    </div>
  );
};

const libraries = ['places', 'geometry'];

function NearYou() {
  const navigate = useNavigate();
  const { user } = useUserStore.getState();
  const [city, setCity] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      libraries
  });

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
    
    if (!resolved && typeof navigator !== "undefined" && navigator.geolocation && isLoaded) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            
            // --- GOOGLE MAPS REVERSE GEOCODING ---
            const geocoder = new window.google.maps.Geocoder();
            const res = await geocoder.geocode({ location: { lat: latitude, lng: longitude } });
            
            if (res.results && res.results.length > 0) {
                 const result = res.results[0];
                 // Extract city from address components
                 let cityName = "Chamoli";
                 for (let comp of result.address_components) {
                     if (comp.types.includes("locality")) {
                         cityName = comp.long_name;
                         break;
                     } else if (comp.types.includes("administrative_area_level_2")) {
                         cityName = comp.long_name;
                     }
                 }
                 setCity(cityName);
                 return;
            }

            // --- BACKUP: PHOTON (COMMENTED) ---
            /*
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const photonBase = `${API_BASE}/api/geo/photon`;
            const r = await fetch(`${photonBase}/reverse?lat=${latitude}&lon=${longitude}`, { headers: { Accept: 'application/json' } });
            if (r.ok) {
              const d = await r.json();
              const f = Array.isArray(d.features) ? d.features[0] : null;
              const p = f?.properties || {};
              // Try to find the most relevant city/town name
              const cityName = p.city || p.town || p.village || p.county || p.state || "Chamoli";
              setCity(cityName);
              return;
            }
            */
          } catch (e) {
            console.warn("Reverse geocoding failed", e);
          }
          // Fallback if reverse geocoding fails but we have coords (maybe backend supports coords?)
          // For now, default to Chamoli
          setCity("Chamoli");
        },
        (err) => { 
          console.warn("Geolocation failed", err);
          setCity("Chamoli"); 
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    } else {
      setCity(resolved || "Chamoli");
    }
  }, [user, isLoaded]);

  useEffect(() => {
    if (!city) return;
    const mapCard = (entity, type) => {
      const img =
        entity.image ||
        (Array.isArray(entity.images) && entity.images[0]?.url) ||
        "https://via.placeholder.com/300";
      let price = "";
      if (type === "product" && entity.type === "rent") {
          price = `₹${Number(entity.rentalPrice || entity.price || 0).toLocaleString('en-IN')}/${entity.rentalPeriod || "mo"}`;
      } else if (typeof entity.price === "number") {
          price = `₹${Number(entity.price).toLocaleString('en-IN')}`;
      } else if (entity.price) {
          price = entity.price;
      } else if (entity.rent) {
          price = `₹${Number(entity.rent).toLocaleString('en-IN')}/month`;
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
        id: entity._id,
        kind: type,
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
      setLoading(true);
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
      } finally {
        setLoading(false);
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
        {loading ? (
          Array(4).fill(0).map((_, i) => (
             <div key={i} style={{ ...cardStyle, cursor: 'default', boxShadow: 'none' }}>
               <div style={{ ...imageBox, backgroundColor: '#f1f5f9' }}>
                 <Skeleton width="100%" height="100%" style={{ position: 'absolute', top: 0 }} />
               </div>
               <div style={contentStyle}>
                 <Skeleton width="40%" height="24px" style={{ marginBottom: '8px' }} />
                 <Skeleton width="80%" height="20px" style={{ marginBottom: '12px' }} />
                 <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                   <Skeleton width="30%" height="16px" />
                   <Skeleton width="30%" height="16px" />
                 </div>
                 <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                   <Skeleton width="60px" height="20px" />
                   <Skeleton width="40px" height="20px" />
                 </div>
               </div>
             </div>
          ))
        ) : cards.length > 0 ? (
          cards.map((item, index) => (
            <SpotlightCard
              key={index}
              style={cardStyle}
              onClick={() => {
                if (item.id) {
                  if (item.kind === 'product') navigate(`/product/${item.id}`);
                  else if (item.kind === 'room') navigate(`/rooms/${item.id}`);
                  else if (item.kind === 'service') navigate(`/services/${item.id}`);
                  else if (item.kind === 'job') navigate(`/jobs/${item.id}`);
                } else {
                  if (item.kind === 'product') navigate('/browse?tab=Products');
                  else if (item.kind === 'room') navigate('/browse?tab=Rooms');
                  else if (item.kind === 'service') navigate('/browse?tab=Services');
                  else if (item.kind === 'job') navigate('/browse?tab=Jobs');
                  else navigate('/browse');
                }
              }}
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
            </SpotlightCard>
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", backgroundColor: "#fff", borderRadius: "16px", border: "1px dashed #E2E8F0" }}>
            <p style={{ fontSize: "20px", color: "#1E293B", fontWeight: "600", marginBottom: "8px" }}>No items found near {city}</p>
            <p style={{ color: "#64748B", fontSize: "15px" }}>We couldn't find any listings in your area yet. Try changing your location or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NearYou;

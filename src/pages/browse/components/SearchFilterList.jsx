import React from "react";
import ProductCard from "../../../components/product/productCard";
import JobCard from "../../../components/product/JobCard";
import TransportCard from "../../../components/product/TransportCard";
import Skeleton from "../../../components/Skeleton";
import { formatSeller } from "../../../utils/formatDisplay";

// ------------------------------
// UNIVERSAL LOCATION NORMALIZER
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

// ------------------------------
// MAIN COMPONENT
// ------------------------------
const SearchFilterList = ({ products, loading, error, type = "Products", query }) => {
  const displayList = Array.isArray(products) ? products : [];

  const styles = {
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "24px",
      padding: "20px 40px",
      width: "100%",
      boxSizing: "border-box",
      backgroundColor: "#f8fafc",
    },
    listContainer: {
      padding: "20px 40px",
      width: "100%",
      boxSizing: "border-box",
      backgroundColor: "#f8fafc",
    },
    noResults: {
      textAlign: "center",
      padding: "40px",
      color: "#64748b",
    },
  };

  if (loading) {
    return (
      <div style={styles.gridContainer}>
        {Array(8).fill(0).map((_, i) => (
          <div key={i} style={{ width: '100%', height: '350px', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Skeleton width="100%" height="200px" />
            <div style={{ padding: '16px' }}>
              <Skeleton width="80%" height="24px" style={{ marginBottom: '8px' }} />
              <Skeleton width="40%" height="20px" style={{ marginBottom: '16px' }} />
              <Skeleton width="100%" height="36px" borderRadius="18px" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (error) return <div style={styles.noResults}>{error}</div>;

  const formatPrice = (p) => {
    if (typeof p === 'number') return `₹ ${p.toLocaleString('en-IN')}`;
    if (!p) return "₹ Not provided";
    const num = Number(p);
    if (!isNaN(num) && p !== "") return `₹ ${num.toLocaleString('en-IN')}`;
    return p;
  };

  if (type === "Jobs") {
    return (
      <div style={styles.listContainer}>
        {displayList.length > 0 ? (
          displayList.map((item, index) => {
            let salary = "₹ Not provided";
            if (item.salary !== undefined && item.salary !== null) {
              salary = formatPrice(item.salary);
            }

            const uiItem = {
              id: item._id,
              title: item.title,
              price: salary,
              seller: item.companyName || "Company",
              location: normalizeLocation(item.location || item.address || item.city),
              date: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-IN")
                : "Recently",
            };

            return <JobCard key={uiItem.id || index} job={uiItem} />;
          })
        ) : (
          <div style={styles.noResults}>
            No {type.toLowerCase()} found{query ? ` for "${query}"` : ""}.
            <div style={{ fontSize: "14px", marginTop: "8px" }}>Try adjusting your search or filters.</div>
          </div>
        )}
      </div>
    );
  }

  // ------------------------------
  // TRANSPORT
  // ------------------------------
  if (type === "Transport") {
    return (
      <div style={styles.gridContainer}>
        {displayList.length > 0 ? (
          displayList.map((item, index) => {
            const uiItem = {
              id: item._id,
              vehicleName: item.vehicleName,
              vehicleType: item.vehicleType,
              price: formatPrice(item.price),
              from: typeof item.from === 'object' ? (item.from.city || item.from.address) : item.from,
              to: typeof item.to === 'object' ? (item.to.city || item.to.address) : item.to,
              departureTime: item.departureTime,
              frequency: item.frequency,
              date: item.departureDate ? new Date(item.departureDate).toLocaleDateString("en-IN") : "Daily",
              seatsAvailable: item.seatsAvailable,
              driverName: item.driver?.name || "Driver",
              isVerified: item.driver?.isVerified,
              image: item.images?.[0]?.url,
              status: item.status
            };
            return <TransportCard key={uiItem.id || index} transport={uiItem} />;
          })
        ) : (
          <div style={styles.noResults}>
            No drivers found{query ? ` for "${query}"` : ""}.
            <div style={{ fontSize: "14px", marginTop: "8px" }}>Try adjusting your search or filters.</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.gridContainer}>
      {displayList.length > 0 ? (
        displayList.map((item, index) => {
          let uiItem = {};

          // ------------------------------
          // ROOMS
          // ------------------------------
          if (type === "Rooms") {
            uiItem = {
              id: item._id,
              title: item.title,
              price: formatPrice(item.rent),
              image: item?.images?.[0]?.url || item?.images?.[0] || "https://picsum.photos/seed/room/600/400",
              seller: formatSeller(item.seller, "Seller"),
              condition: item.furnished || "Unknown",
              location: normalizeLocation(item.location),
              date: item.availableFrom
                ? new Date(item.availableFrom).toLocaleDateString("en-IN")
                : "Recently",
              roomType: item.roomType || "",
              bhk: item.bhk || "",
              features: item.features || {},
              rules: item.rules || {},
              type: "Room",
            };
          }

          // ------------------------------
          // SERVICES
          // ------------------------------
          else if (type === "Services") {
            const firstImage =
              Array.isArray(item?.images) && item.images.length > 0
                ? (typeof item.images[0] === "string" ? item.images[0] : (item.images[0]?.url || item.image))
                : (item?.image || "https://picsum.photos/seed/service/600/400");
            uiItem = {
              id: item._id,
              title: item.title,
              price: formatPrice(item.price),
              image: firstImage,
              seller: formatSeller(item.provider || item.seller, "Provider"),
              condition: item.category || item.serviceType || "Service",
              location: normalizeLocation(item.location),
              date: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-IN")
                : "Recently",
              negotiable: item.negotiable || false,
              type: "Service",
            };
          }

          // ------------------------------
          // PRODUCTS
          // ------------------------------
          else {
            uiItem = {
              id: item._id,
              title: item.title,
              price: formatPrice(item.price),
              image: item?.images?.[0]?.url || item?.image || "https://picsum.photos/seed/product/600/400",
              seller: formatSeller(item.seller, "Seller"),
              condition: item.condition || "Unknown",
              location: normalizeLocation(item.location),
              date: item.postedTime || item.date || "Recently",
              negotiable: item.negotiable || false,
              type: "Product",
            };
          }

          return <ProductCard key={uiItem.id || index} product={uiItem} />;
        })
      ) : (
        <div style={styles.noResults}>
          No {type.toLowerCase()} found{query ? ` for "${query}"` : ""}.
          <div style={{ fontSize: "14px", marginTop: "8px" }}>Try adjusting your search or filters.</div>
          {type === "Products" && (
            <button
              type="button"
              onClick={() => window.location.assign("/sell-item")}
              style={{
                marginTop: "16px",
                padding: "10px 20px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              List your first product
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilterList;

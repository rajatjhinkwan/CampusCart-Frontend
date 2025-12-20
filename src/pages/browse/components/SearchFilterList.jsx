import React from "react";
import ProductCard from "../../../components/product/productCard";
import JobCard from "../../../components/product/JobCard";
import Skeleton from "../../../components/Skeleton";

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
const SearchFilterList = ({ products, loading, error, type = "Products" }) => {
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
          <div style={styles.noResults}>No {type.toLowerCase()} found.</div>
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
              image: item?.images?.[0]?.url || "https://via.placeholder.com/300",
              seller: item.seller?.name || "User",
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
                : (item?.image || "https://via.placeholder.com/300");
            uiItem = {
              id: item._id,
              title: item.title,
              price: formatPrice(item.price),
              image: firstImage,
              seller: item.provider?.name || item.seller?.name || "User",
              condition: item.condition || "Unknown",
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
              image: item?.images?.[0]?.url || item?.image || "https://via.placeholder.com/300",
              seller: item.seller?.name || item.seller || "User",
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
        <div style={styles.noResults}>No {type.toLowerCase()} found.</div>
      )}
    </div>
  );
};

export default SearchFilterList;

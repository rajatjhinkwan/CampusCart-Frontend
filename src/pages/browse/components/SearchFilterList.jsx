import React from "react";
import ProductCard from "../../../components/product/productCard";
import JobCard from "../../../components/product/JobCard";

// ------------------------------
// UNIVERSAL LOCATION NORMALIZER
// ------------------------------
const normalizeLocation = (loc) => {
  if (!loc) return "Unknown";

  if (typeof loc === "string") return loc;

  if (typeof loc === "object") {
    const { address, area, city, state, pincode } = loc;
    return [address, area, city, state, pincode].filter(Boolean).join(", ");
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

  if (loading) return <div style={styles.noResults}>Loading {type.toLowerCase()}...</div>;
  if (error) return <div style={styles.noResults}>{error}</div>;

  if (type === "Jobs") {
    return (
      <div style={styles.listContainer}>
        {displayList.length > 0 ? (
          displayList.map((item, index) => {
            let salary = "₹ Not provided";
            if (item.salary !== undefined && item.salary !== null) {
              if (typeof item.salary === "number") {
                salary = `₹ ${item.salary.toLocaleString("en-IN")}`;
              } else if (typeof item.salary === "string" && item.salary.trim() !== "") {
                salary = item.salary;
              }
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
              price: item.rent
                ? `₹ ${item.rent.toLocaleString("en-IN")}`
                : "₹ Not provided",
              image: item?.images?.[0]?.url || "https://via.placeholder.com/300",
              seller: item.seller || "User",
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
            uiItem = {
              id: item._id,
              title: item.title,
              price:
                typeof item.price === "number"
                  ? `₹ ${item.price.toLocaleString("en-IN")}`
                  : item.price || "₹ Not provided",
              image: item?.images?.[0] || item?.image || "https://via.placeholder.com/300",
              seller: item.provider || item.seller?.name || "User",
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
              price:
                typeof item.price === "number"
                  ? `₹ ${item.price.toLocaleString("en-IN")}`
                  : item.price || "₹ Not provided",
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

import React, { useState, useEffect } from "react";
import {
  Filter, MapPin, Tag, Calendar,
  RotateCcw, Search
} from "lucide-react";

// This component receives 'filters' and 'setFilters' from the parent
const SearchFilter = ({ filters = {}, setFilters }) => {
  // --- Local State (UI) ---
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [conditions, setConditions] = useState([]);
  const [datePosted, setDatePosted] = useState("");

  // --- Static Data (Could be passed as props too) ---
  const categories = ["Electronics", "Vehicles", "Property", "Jobs", "Services", "Fashion"];
  const locations = ["Kuthiyal-Sain", "Chamoli", "Gopeshwar", "Mandal", "Nandprayag", "Pursadi"];
  const conditionOptions = ["New", "Like New", "Used"];

  // Sync local UI state when parent filters change (so UI reflects applied filters)
  useEffect(() => {
    if (!filters || Object.keys(filters).length === 0) {
      // nothing applied
      setCategory("");
      setLocation("");
      setMinPrice("");
      setMaxPrice("");
      setConditions([]);
      setDatePosted("");
      return;
    }

    // Populate local values from filters (defensive)
    setCategory(filters.category || "");
    setLocation(filters.location || "");
    setMinPrice(filters.minPrice ?? "");
    setMaxPrice(filters.maxPrice ?? "");

    // conditions might be comma-separated string or array
    if (filters.conditions) {
      if (Array.isArray(filters.conditions)) {
        setConditions(filters.conditions);
      } else if (typeof filters.conditions === "string") {
        setConditions(filters.conditions.split(",").filter(Boolean));
      } else {
        setConditions([]);
      }
    } else {
      setConditions([]);
    }

    // map numeric datePosted to UI select values (if possible)
    if (filters.datePosted) {
      const days = Number(filters.datePosted);
      if (days <= 1) setDatePosted("today");
      else if (days <= 7) setDatePosted("this_week");
      else if (days <= 30) setDatePosted("this_month");
      else setDatePosted(String(days));
    } else {
      setDatePosted("");
    }
  }, [filters]);

  // --- Handlers ---
  const handleConditionChange = (condition) => {
    if (conditions.includes(condition)) {
      setConditions(conditions.filter((c) => c !== condition));
    } else {
      setConditions([...conditions, condition]);
    }
  };

  const clearAllFilters = () => {
    setCategory("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setConditions([]);
    setDatePosted("");
    // notify parent
    if (typeof setFilters === "function") setFilters({});
  };

  const mapDatePostedToDays = (value) => {
    // backend expects number of days (e.g. 1, 7, 30)
    if (!value) return undefined;
    if (value === "today") return 1;
    if (value === "this_week") return 7;
    if (value === "this_month") return 30;
    // if user provided numeric string, try to use it
    const n = Number(value);
    return Number.isNaN(n) ? undefined : n;
  };

  const handleApplyFilters = () => {
    const applied = {};

    if (category) applied.category = category;
    if (location) applied.location = location;
    if (minPrice !== "" && minPrice !== null) applied.minPrice = minPrice;
    if (maxPrice !== "" && maxPrice !== null) applied.maxPrice = maxPrice;
    if (conditions && conditions.length > 0) applied.conditions = conditions.join(","); // backend expects comma-separated string
    const days = mapDatePostedToDays(datePosted);
    if (days !== undefined) applied.datePosted = days;

    // update parent filters
    if (typeof setFilters === "function") setFilters(applied);
  };

  // --- Styles ---
  const styles = {
    container: {
      width: "100%",
      maxWidth: "300px",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "20px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.13)",
      border: "1px solid #e2e8f0",
      height: "fit-content",
    },
    headerRow: {
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9",
    },
    title: { fontSize: "18px", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" },
    clearBtn: { fontSize: "12px", color: "#ef4444", cursor: "pointer", background: "none", border: "none", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" },
    section: { marginBottom: "24px" },
    label: { fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" },
    input: {
      width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1",
      fontSize: "14px", color: "#1e293b", outline: "none", backgroundColor: "#f8fafc", boxSizing: "border-box",
    },
    priceGroup: { display: "flex", gap: "10px", alignItems: "center" },
    checkboxGroup: { display: "flex", flexDirection: "column", gap: "8px" },
    checkboxLabel: { display: "flex", alignItems: "center", fontSize: "14px", color: "#475569", cursor: "pointer" },
    checkbox: { marginRight: "8px", accentColor: "#2563eb", width: "16px", height: "16px", cursor: "pointer" },
    applyBtn: {
      width: "100%", padding: "12px", backgroundColor: "#2563eb", color: "#ffffff",
      border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "14px", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
      transition: "background-color 0.2s",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div style={styles.title}><Filter size={20} /> Filters</div>
        <button onClick={clearAllFilters} style={styles.clearBtn} type="button">
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Category */}
      <div style={styles.section}>
        <label style={styles.label}><Tag size={14} /> Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input}>
          <option value="">All Categories</option>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Location */}
      <div style={styles.section}>
        <label style={styles.label}><MapPin size={14} /> Location</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)} style={styles.input}>
          <option value="">All Locations</option>
          {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
        </select>
      </div>

      {/* Price Range */}
      <div style={styles.section}>
        <label style={styles.label}>Price Range (₹)</label>
        <div style={styles.priceGroup}>
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ ...styles.input, flex: 1 }} />
          <span style={{ color: "#94a3b8" }}>-</span>
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ ...styles.input, flex: 1 }} />
        </div>
      </div>

      {/* Condition */}
      <div style={styles.section}>
        <label style={styles.label}>Condition</label>
        <div style={styles.checkboxGroup}>
          {conditionOptions.map((cond) => (
            <label key={cond} style={styles.checkboxLabel}>
              <input type="checkbox" checked={conditions.includes(cond)} onChange={() => handleConditionChange(cond)} style={styles.checkbox} />
              {cond}
            </label>
          ))}
        </div>
      </div>

      {/* Date Posted */}
      <div style={styles.section}>
        <label style={styles.label}><Calendar size={14} /> Date Posted</label>
        <select value={datePosted} onChange={(e) => setDatePosted(e.target.value)} style={styles.input}>
          <option value="">Any time</option>
          <option value="today">Last 24 hours</option>
          <option value="this_week">Last 7 days</option>
          <option value="this_month">Last 30 days</option>
        </select>
      </div>

      {/* Apply Button */}
      <button onClick={handleApplyFilters} style={styles.applyBtn} type="button">
        <Search size={16} /> Apply Filters
      </button>
    </div>
  );
};

export default SearchFilter;

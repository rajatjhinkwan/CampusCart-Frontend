import React, { useState, useEffect } from "react";
import axios from "../../../lib/axios";
import {
  Filter, MapPin, Tag, Calendar,
  RotateCcw, Search
} from "lucide-react";

// This component receives 'filters' and 'setFilters' from the parent
// Add 'type' to adapt filters for Products, Rooms, Services
const SearchFilter = ({ filters = {}, setFilters, type = "Products" }) => {
  // --- Local State (UI) ---
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [conditions, setConditions] = useState([]);
  const [datePosted, setDatePosted] = useState("");
  // Rooms-specific
  const [roomType, setRoomType] = useState("");
  const [furnished, setFurnished] = useState("");
  const [bhk, setBhk] = useState("");
  // Services-specific
  const [searchText, setSearchText] = useState("");
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const isMobile = width < 640;

  // --- Static Data (Could be passed as props too) ---
  const [productCategories, setProductCategories] = useState([]);
  const locations = ["Kuthiyal-Sain", "Chamoli", "Gopeshwar", "Mandal", "Nandprayag", "Pursadi"];
  const conditionOptions = ["New", "Like New", "Used"];
  const roomTypes = ["Single Room", "Double Room", "1BHK", "2BHK", "Hostel Bed", "PG", "Short-Term Stay", "Other"];
  const furnishingOptions = ["Furnished", "Semi-Furnished", "Unfurnished"];

  // Fetch categories for Products tab
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (type !== "Products") return;
      try {
        const res = await axios.get("/api/categories", { params: { type: "product" } });
        const cats = res.data?.categories || res.data?.data || [];
        if (mounted) setProductCategories(cats);
      } catch {
        // fallback: empty list
        if (mounted) setProductCategories([]);
      }
    })();
    return () => { mounted = false; };
  }, [type]);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
    setLocation(filters.location || filters.city || "");
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
    // Rooms-specific
    setRoomType(filters.roomType || "");
    setFurnished(filters.furnished || "");
    setBhk(filters.bhk ?? "");
    // Services-specific
    setSearchText(filters.search || "");
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

    if (type === "Products") {
      if (category) applied.category = category;
      // products controller expects condition (singular). Use first selected
      if (conditions && conditions.length > 0) applied.condition = conditions[0];
      if (location) applied.location = location;
      if (minPrice !== "" && minPrice !== null) applied.minPrice = minPrice;
      if (maxPrice !== "" && maxPrice !== null) applied.maxPrice = maxPrice;
      const days = mapDatePostedToDays(datePosted);
      if (days !== undefined) applied.datePosted = days;
    } else if (type === "Rooms") {
      if (location) applied.city = location;
      if (minPrice !== "" && minPrice !== null) applied.minPrice = minPrice;
      if (maxPrice !== "" && maxPrice !== null) applied.maxPrice = maxPrice;
      if (roomType) applied.roomType = roomType;
      if (furnished) applied.furnished = furnished;
      if (bhk !== "" && bhk !== null) applied.bhk = bhk;
      const days = mapDatePostedToDays(datePosted);
      if (days !== undefined) applied.datePosted = days;
    } else if (type === "Services") {
      if (category) applied.category = category;
      if (location) applied.city = location;
      if (minPrice !== "" && minPrice !== null) applied.minPrice = minPrice;
      if (maxPrice !== "" && maxPrice !== null) applied.maxPrice = maxPrice;
      if (searchText) applied.search = searchText;
    } else {
      if (category) applied.category = category;
      if (location) applied.location = location;
      if (minPrice !== "" && minPrice !== null) applied.minPrice = minPrice;
      if (maxPrice !== "" && maxPrice !== null) applied.maxPrice = maxPrice;
    }

    if (typeof setFilters === "function") setFilters(applied);
  };

  // --- Styles ---
  const styles = {
    container: {
      width: "100%",
      maxWidth: isMobile ? "100%" : "300px",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: isMobile ? "14px" : "20px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.13)",
      border: "1px solid #e2e8f0",
      height: "fit-content",
    },
    headerRow: {
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: isMobile ? "14px" : "20px", paddingBottom: isMobile ? "12px" : "16px", borderBottom: "1px solid #f1f5f9",
    },
    title: { fontSize: isMobile ? "16px" : "18px", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" },
    clearBtn: { fontSize: isMobile ? "11px" : "12px", color: "#ef4444", cursor: "pointer", background: "none", border: "none", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" },
    section: { marginBottom: isMobile ? "18px" : "24px" },
    label: { fontSize: isMobile ? "12px" : "13px", fontWeight: "600", color: "#334155", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" },
    input: {
      width: "100%", padding: isMobile ? "8px 10px" : "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1",
      fontSize: isMobile ? "13px" : "14px", color: "#1e293b", outline: "none", backgroundColor: "#f8fafc", boxSizing: "border-box",
    },
    priceGroup: { display: "flex", gap: isMobile ? "8px" : "10px", alignItems: "center" },
    checkboxGroup: { display: "flex", flexDirection: "column", gap: isMobile ? "6px" : "8px" },
    checkboxLabel: { display: "flex", alignItems: "center", fontSize: isMobile ? "13px" : "14px", color: "#475569", cursor: "pointer" },
    checkbox: { marginRight: "8px", accentColor: "#2563eb", width: isMobile ? "14px" : "16px", height: isMobile ? "14px" : "16px", cursor: "pointer" },
    applyBtn: {
      width: "100%", padding: isMobile ? "10px" : "12px", backgroundColor: "#2563eb", color: "#ffffff",
      border: "none", borderRadius: "8px", fontWeight: "600", fontSize: isMobile ? "13px" : "14px", cursor: "pointer",
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

      {/* Category (Products only) */}
      {type === "Products" && (
        <div style={styles.section}>
          <label style={styles.label}><Tag size={14} /> Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input}>
            <option value="">All Categories</option>
            {productCategories.map((cat) => (
              <option key={cat._id || cat.id} value={cat._id || cat.id}>
                {cat.title || cat.name || "Category"}
              </option>
            ))}
          </select>
        </div>
      )}

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

      {/* Condition (Products only) */}
      {type === "Products" && (
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
      )}

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

      {/* Rooms specific filters */}
      {type === "Rooms" && (
        <>
          <div style={styles.section}>
            <label style={styles.label}>Room Type</label>
            <select value={roomType} onChange={(e) => setRoomType(e.target.value)} style={styles.input}>
              <option value="">Any</option>
              {roomTypes.map((rt) => <option key={rt} value={rt}>{rt}</option>)}
            </select>
          </div>
          <div style={styles.section}>
            <label style={styles.label}>Furnished</label>
            <select value={furnished} onChange={(e) => setFurnished(e.target.value)} style={styles.input}>
              <option value="">Any</option>
              {furnishingOptions.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div style={styles.section}>
            <label style={styles.label}>BHK</label>
            <input type="number" placeholder="e.g., 1 or 2" value={bhk} onChange={(e) => setBhk(e.target.value)} style={styles.input} />
          </div>
        </>
      )}

      {/* Services specific filters */}
      {type === "Services" && (
        <div style={styles.section}>
          <label style={styles.label}>Search</label>
          <input
            type="text"
            placeholder="e.g., plumber, tutor"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={styles.input}
          />
        </div>
      )}

      {/* Apply Button */}
      <button onClick={handleApplyFilters} style={styles.applyBtn} type="button">
        <Search size={16} /> Apply Filters
      </button>
    </div>
  );
};

export default SearchFilter;

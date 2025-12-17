import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../../lib/axios";
import Navbar from "../../components/navbar.jsx";
import SearchFilterList from "../browse/components/SearchFilterList.jsx";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Products");

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";
  const [searchText, setSearchText] = useState(q);
  const [searchLocation, setSearchLocation] = useState(location);
  const [selectedCategory, setSelectedCategory] = useState(category);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        let apiUrl = "/api/products";
        let params = {};

        if (activeTab === "Products") {
          apiUrl = "/api/products";
          params = {
            query: q,
            ...(category && { category }),
            ...(location && { location }),
          };
        } else if (activeTab === "Rooms") {
          apiUrl = "/api/rooms";
          params = {
            query: q,
            ...(location && { city: location }),
          };
        } else if (activeTab === "Services") {
          apiUrl = "/api/services";
          params = {
            query: q,
            ...(location && { city: location }),
          };
        } else if (activeTab === "Jobs") {
          apiUrl = "/api/jobs";
          params = {
            query: q,
            ...(location && { location }),
          };
        }

        const hasFilters = Object.values(params).some(
          (v) => v !== "" && v !== null && v !== undefined
        );
        const url = hasFilters ? `${apiUrl}/filter` : apiUrl;
        const res = await axios.get(url, { params });

        let fetched = [];
        if (activeTab === "Products") fetched = res.data?.products || [];
        else if (activeTab === "Rooms") fetched = res.data?.data || [];
        else if (activeTab === "Services") fetched = res.data?.data || [];
        else if (activeTab === "Jobs") fetched = res.data?.jobs || [];

        setItems(fetched);
      } catch (e) {
        setError("Failed to load search results");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [q, category, location, activeTab]);

  const styles = {
    page: { paddingTop: 70 },
    container: { padding: "0 0 20px 0" },
    tabs: { display: "flex", gap: "10px", marginBottom: "16px" },
    tab: {
      padding: "8px 12px",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      background: "#fff",
      cursor: "pointer",
      fontSize: 14,
    },
    tabActive: {
      background: "#2563eb",
      color: "#fff",
      borderColor: "#2563eb",
    },
    header: { fontSize: 20, fontWeight: 600, marginBottom: 8 },
    sub: { color: "#6b7280", fontSize: 14 },
    hero: {
      width: "100%",
      background: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 60%, #14B8A6 100%)",
      padding: "50px 20px 30px",
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      marginBottom: 20,
    },
    heroInner: { width: "100%", maxWidth: 1000, textAlign: "center" },
    heroTitle: { fontSize: 30, fontWeight: 800, marginBottom: 6 },
    heroSub: { fontSize: 15, opacity: 0.9, marginBottom: 16 },
    searchRow: {
      display: "grid",
      gridTemplateColumns: "1fr 220px auto",
      gap: 12,
      background: "#ffffff",
      padding: 10,
      borderRadius: 999,
      boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
    },
    searchInput: {
      border: "none",
      outline: "none",
      padding: "12px 16px",
      borderRadius: 999,
      fontSize: 15,
      color: "#0f172a",
      background: "#f8fafc",
    },
    searchButton: {
      padding: "12px 20px",
      borderRadius: 999,
      border: "none",
      background: "#1e293b",
      color: "#ffffff",
      fontWeight: 700,
      cursor: "pointer",
    },
    chipRow: {
      marginTop: 16,
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
      justifyContent: "center",
    },
    chip: {
      background: "rgba(255,255,255,0.18)",
      color: "#ffffff",
      border: "1px solid rgba(255,255,255,0.35)",
      borderRadius: 999,
      padding: "8px 14px",
      fontSize: 13,
      cursor: "pointer",
      backdropFilter: "blur(2px)",
    },
  };

  const heroText = {
    Products: { title: "Find Great Deals", sub: "Search verified items from your campus community" },
    Rooms: { title: "Find Your Perfect Room", sub: "Browse verified accommodations near campus" },
    Services: { title: "Hire Trusted Services", sub: "Find tutors, cleaning, repair and more" },
    Jobs: { title: "Discover Jobs & Internships", sub: "Flexible roles tailored for students" },
  }[activeTab];

  const popularChips = {
    Products: ["Electronics", "Furniture", "Books", "Sports"],
    Rooms: ["Single Room", "Shared", "Apartment", "< ₹500", "Furnished", "Available Now"],
    Services: ["Plumbing", "Electrical", "Tutoring", "Web Dev"],
    Jobs: ["Internship", "Part-time", "Remote", "On-site"],
  }[activeTab];

  const applyChip = (label) => {
    if (activeTab === "Products") {
      setSelectedCategory(label === "< ₹500" ? "" : label);
      if (label === "< ₹500") setSearchParams({ q: q, location, category: "" });
      else setSearchParams({ q: q, location, category: label });
    } else {
      const nextQ = label === "< ₹500" ? "" : label;
      setSearchText(nextQ);
    }
  };

  const onSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.set("q", searchText || "");
    params.set("location", searchLocation || "");
    if (activeTab === "Products") {
      params.set("category", selectedCategory || "");
    }
    setSearchParams(params);
  };

  const TabButton = ({ label }) => (
    <button
      onClick={() => setActiveTab(label)}
      style={{
        ...styles.tab,
        ...(activeTab === label ? styles.tabActive : {}),
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroTitle}>{heroText.title}</div>
          <div style={styles.heroSub}>{heroText.sub}</div>
          <div style={styles.searchRow}>
            <input
              style={styles.searchInput}
              placeholder={activeTab === "Rooms" ? "Search location…" : "Search keyword…"}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <input
              style={styles.searchInput}
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <button style={styles.searchButton} onClick={onSearch}>Search</button>
          </div>
          <div style={styles.chipRow}>
            {popularChips.map((c) => (
              <button key={c} style={styles.chip} onClick={() => applyChip(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: "0 40px 10px" }}>
        <div style={styles.tabs}>
          <TabButton label="Products" />
          <TabButton label="Rooms" />
          <TabButton label="Services" />
          <TabButton label="Jobs" />
        </div>
      </div>
      <SearchFilterList products={items} loading={loading} error={error} type={activeTab} />
    </div>
  );
};

export default Index;

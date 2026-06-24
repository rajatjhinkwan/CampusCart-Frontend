import React, { useMemo, useState } from "react";
import axios from "../../lib/axios";
import Navbar from "../../components/navbar.jsx";
import SearchFilterList from "../browse/components/SearchFilterList.jsx";

const CONFIG = {
  mobiles: {
    label: "Mobiles",
    brands: {
      Apple: ["iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14"],
      Samsung: ["Galaxy S21", "Galaxy S22", "Galaxy A52"],
      Xiaomi: ["Redmi Note 10", "Redmi Note 11", "Redmi Note 12"],
    },
  },
  cars: {
    label: "Cars",
    brands: {
      Tata: ["Tiago", "Altroz", "Nexon"],
      Maruti: ["Swift", "Baleno", "Dzire"],
      Hyundai: ["i20", "Creta", "Venue"],
    },
  },
  bikes: {
    label: "Bikes",
    brands: {
      Hero: ["Splendor", "Passion Pro", "HF Deluxe"],
      Honda: ["Activa", "Shine", "CB Unicorn"],
      TVS: ["Apache", "Jupiter", "Ntorq"],
    },
  },
};

const RecommendationPage = () => {
  const [categoryKey, setCategoryKey] = useState("mobiles");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [condition, setCondition] = useState("Used");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState(null);

  const brandOptions = useMemo(() => {
    if (!categoryKey) return [];
    const entry = CONFIG[categoryKey];
    return entry ? Object.keys(entry.brands) : [];
  }, [categoryKey]);

  const modelOptions = useMemo(() => {
    if (!categoryKey || !brand) return [];
    const entry = CONFIG[categoryKey];
    if (!entry) return [];
    return entry.brands[brand] || [];
  }, [categoryKey, brand]);

  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = currentYear; y >= currentYear - 15; y -= 1) {
      years.push(y);
    }
    return years;
  }, [currentYear]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!brand || !model || !year) {
      setError("Please select brand, model and year.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        brand,
        model,
        yearOfPurchase: Number(year),
        condition,
      };
      if (maxPrice) {
        payload.maxPrice = Number(maxPrice);
      }
      const res = await axios.post("/api/products/recommend", payload);
      const data = res.data || {};
      setResults(Array.isArray(data.products) ? data.products : []);
      setMeta({
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 20,
        targetPrice: data.targetPrice || null,
      });
    } catch (err) {
      setError("Could not load recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: { paddingTop: 70 },
    hero: {
      width: "100%",
      background: "linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 50%, #22c55e 100%)",
      padding: "48px 16px 32px",
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      marginBottom: 24,
    },
    heroInner: { width: "100%", maxWidth: 960 },
    heroTitle: { fontSize: 28, fontWeight: 800, marginBottom: 8 },
    heroSub: { fontSize: 15, opacity: 0.92, marginBottom: 20 },
    formCard: {
      background: "#ffffff",
      borderRadius: 20,
      padding: 20,
      color: "#0f172a",
      boxShadow: "0 18px 45px rgba(15,23,42,0.25)",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: 16,
      marginBottom: 16,
    },
    label: { fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#475569" },
    select: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 999,
      border: "1px solid #e5e7eb",
      fontSize: 14,
      background: "#f9fafb",
      outline: "none",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 999,
      border: "1px solid #e5e7eb",
      fontSize: 14,
      background: "#f9fafb",
      outline: "none",
    },
    submitRow: {
      marginTop: 8,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap",
    },
    submitButton: {
      padding: "10px 22px",
      borderRadius: 999,
      border: "none",
      background: "#111827",
      color: "#ffffff",
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
    },
    metaText: { fontSize: 13, color: "#64748b" },
    error: { color: "#b91c1c", fontSize: 13, marginTop: 8 },
  };

  const selectedConfig = CONFIG[categoryKey];

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroTitle}>Smart product recommendations</div>
          <div style={styles.heroSub}>
            Choose company, exact model and purchase year. We use this to find the most relevant listings and an ideal price range for you.
          </div>
          <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setCategoryKey(key);
                  setBrand("");
                  setModel("");
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.5)",
                  background: categoryKey === key ? "#ffffff" : "transparent",
                  color: categoryKey === key ? "#0f172a" : "#ffffff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {cfg.label}
              </button>
            ))}
          </div>
          <form onSubmit={onSubmit} style={styles.formCard}>
            <div style={styles.formGrid}>
              <div>
                <div style={styles.label}>Brand</div>
                <select
                  style={styles.select}
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setModel("");
                  }}
                >
                  <option value="">Select brand</option>
                  {brandOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div style={styles.label}>Model</div>
                <select
                  style={styles.select}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!brand}
                >
                  <option value="">Select model</option>
                  {modelOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div style={styles.label}>Year of purchase</div>
                <select
                  style={styles.select}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="">Select year</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div style={styles.label}>Condition</div>
                <select
                  style={styles.select}
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Used">Used</option>
                </select>
              </div>
              <div>
                <div style={styles.label}>Maximum price (optional)</div>
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  placeholder="Budget in ₹"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            <div style={styles.submitRow}>
              <button type="submit" style={styles.submitButton} disabled={loading}>
                {loading ? "Finding recommendations…" : "Get recommendations"}
              </button>
              {meta && (
                <div style={styles.metaText}>
                  {meta.total} matching listings
                  {meta.targetPrice ? ` • Suggested price around ₹${Math.round(meta.targetPrice)}` : ""}
                </div>
              )}
            </div>
            {error && <div style={styles.error}>{error}</div>}
          </form>
        </div>
      </div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px 32px" }}>
        <SearchFilterList products={results} loading={loading} error={error} type="Products" />
      </div>
    </div>
  );
};

export default RecommendationPage;


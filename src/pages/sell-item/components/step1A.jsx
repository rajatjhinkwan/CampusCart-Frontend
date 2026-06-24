import { useState, useEffect, useMemo } from "react";
import axios from "../../../lib/axios";
import { resolveCategoryId } from "../../../utils/categoryResolve";
import {
  Smartphone, Shirt, Laptop, Sofa, Camera, Dumbbell, BookMarked, Bike,
  LampDesk, Gamepad2, Headphones, Monitor, ShoppingBasket, Guitar,
} from "lucide-react";
import ProgressBar from "./progressBar";

const iconMap = {
  "Mobiles": Smartphone,
  "Fashion": Shirt,
  "Laptops": Laptop,
  "Furniture": Sofa,
  "Cameras": Camera,
  "Fitness": Dumbbell,
  "Books": BookMarked,
  "Bikes": Bike,
  "Study Table & Lamps": LampDesk,
  "Gaming Consoles": Gamepad2,
  "Headphones & Earbuds": Headphones,
  "Monitors & Screens": Monitor,
  "Kitchen & Utensils": ShoppingBasket,
  "Musical Instruments": Guitar,
};

const DEFAULT_PRODUCT_SUBS = [
  "Mobiles",
  "Fashion",
  "Laptops",
  "Furniture",
  "Cameras",
  "Fitness",
  "Books",
  "Bikes",
  "Study Table & Lamps",
  "Gaming Consoles",
  "Headphones & Earbuds",
  "Monitors & Screens",
  "Kitchen & Utensils",
  "Musical Instruments",
];

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

export default function Step1A({ onSelect, onBack, categories = [] }) {
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [extraSubs, setExtraSubs] = useState([]);

  useEffect(() => {
    if (categories.length > 0) return undefined;
    let cancelled = false;

    const fetchSubcategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        const allCategories = Array.isArray(res.data?.categories) ? res.data.categories : [];
        if (!cancelled) setFetchedCategories(allCategories);
      } catch (err) {
        console.error("Error fetching product subcategories, using defaults:", err);
      }
    };

    fetchSubcategories();
    return () => { cancelled = true; };
  }, [categories.length]);

  const allCategories = categories.length > 0 ? categories : fetchedCategories;

  useEffect(() => {
    if (!allCategories.length) return;

    const productCategory = allCategories.find((cat) => cat.title === "Product");
    if (!productCategory) return;

    const productId = normalizeId(productCategory._id);
    const productSubs = allCategories.filter(
      (cat) => normalizeId(cat.parent) === productId && cat.title
    );

    const defaultLower = DEFAULT_PRODUCT_SUBS.map((t) => t.toLowerCase());
    const extras = productSubs
      .map((cat) => cat.title)
      .filter((title) => !defaultLower.includes(title.toLowerCase()));
    setExtraSubs(extras);
  }, [allCategories]);

  const subcategories = useMemo(
    () => [...DEFAULT_PRODUCT_SUBS, ...extraSubs],
    [extraSubs]
  );

  const handleSelect = (title) => {
    const categoryId = resolveCategoryId(title, allCategories, "product");
    onSelect(title, categoryId);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>STEP 1A</h2>
        <p style={styles.subheading}>Choose Your Product Type</p>

        <ProgressBar currentStep={1} totalSteps={6} />

        <div style={styles.grid}>
          {subcategories.map((title, i) => {
            const Icon = iconMap[title] || Smartphone;
            return (
              <div
                key={`${title}-${i}`}
                style={styles.card}
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(title)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleSelect(title);
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <Icon size={36} strokeWidth={1.6} color="#334155" />
                <span style={styles.label}>{title}</span>
              </div>
            );
          })}
        </div>

        {onBack && (
          <button type="button" style={styles.backBtn} onClick={onBack}>
            Back to Categories
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "40px 20px 120px",
  },
  container: {
    textAlign: "center",
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily: "Inter, sans-serif",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f172a",
  },
  subheading: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "25px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
    justifyContent: "center",
  },
  card: {
    padding: "22px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
    cursor: "pointer",
    transition: "transform 0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "150px",
    boxSizing: "border-box",
  },
  label: {
    marginTop: "12px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#0f172a",
    textAlign: "center",
  },
  backBtn: {
    marginTop: "24px",
    padding: "12px 24px",
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

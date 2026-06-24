import React from "react";
import ProgressBar from "./progressBar";
import { resolveCategoryId } from "../../../utils/categoryResolve";
import { Briefcase, Code, Video, Palette, UserCheck, Camera, Megaphone, Package } from "lucide-react";

// Map service titles to icons
const iconMap = {
    "Video Editing": Video,
    "Website Designing": Code,
    "Graphic Designing": Palette,
    "UI/UX Designing": Palette,
    "Data Analysis": UserCheck,
    "Freelance Coding": Code,
    "Social Media Management": Megaphone,
    "Photography & Shoots": Camera,
    "Tutoring / Teaching": UserCheck,
    "Household Helpers (Shifting / Packing)": Package,
};

export default function Step1D({ onSelect, onBack, categories, allCategories = [] }) {
    // Static list of granular service types (guarantees beautiful icons and offline support)
    const defaultServices = [
        { title: "Video Editing" },
        { title: "Website Designing" },
        { title: "Graphic Designing" },
        { title: "UI/UX Designing" },
        { title: "Data Analysis" },
        { title: "Freelance Coding" },
        { title: "Social Media Management" },
        { title: "Photography & Shoots" },
        { title: "Tutoring / Teaching" },
        { title: "Household Helpers (Shifting / Packing)" }
    ];

    // Fallback to static services if database is empty/loading
    const services = (categories && categories.length > 0)
        ? categories
        : defaultServices;

    const renderCard = (service, i) => {
        const title = service.title || service.name || "";
        const Icon = iconMap[title] || Briefcase; // fallback icon
        const categoryId = resolveCategoryId(title, allCategories.length ? allCategories : services, "service");
        return (
            <div
                key={i}
                style={styles.card}
                onClick={() => onSelect(title, categoryId)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
                <Icon size={36} strokeWidth={1.6} />
                <span style={styles.label}>{title}</span>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>STEP 1D</h2>
            <p style={styles.subheading}>Choose Your Service Type</p>

            <ProgressBar currentStep={1} totalSteps={6} />

            <div style={styles.grid}>
                {services.map(renderCard)}
            </div>

            {onBack && (
                <button type="button" style={styles.backBtn} onClick={onBack}>
                    Back to Categories
                </button>
            )}
        </div>
    );
}

const styles = {
    container: { textAlign: "center", width: "80vw", margin: "0 auto", padding: "20px", fontFamily: "Inter, sans-serif" },
    heading: { fontSize: "26px", fontWeight: "700", color: "#0f172a" },
    subheading: { fontSize: "15px", color: "#64748b", marginBottom: "25px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "30px", marginBottom: "40px" },
    card: { padding: "22px", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)", cursor: "pointer", transition: "transform 0.2s", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "150px", boxSizing: "border-box" },
    label: { marginTop: "12px", fontWeight: "600", fontSize: "14px", color: "#0f172a", textAlign: "center" },
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

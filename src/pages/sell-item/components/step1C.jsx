import React from "react";
import ProgressBar from "./progressBar";
import { resolveCategoryId } from "../../../utils/categoryResolve";
import { Briefcase, FileText, Code, Video, Palette, UserCheck, Camera, Megaphone, Package } from "lucide-react";

// Map job roles to icons
const iconMap = {
    "Campus Ambassador": Briefcase,
    "Data Entry Assistant": FileText,
    "Junior Web Developer": Code,
    "Video Editing Intern": Video,
    "Graphic Design Intern": Palette,
    "Tutoring (Any Subject)": UserCheck,
    "Photography Assistant": Camera,
    "Social Media Intern": Megaphone,
    "Store Helper / Packing Work": Package,
};

export default function Step1C({ onSelect, onBack, categories, allCategories = [] }) {
    // Static list of job roles
    const defaultJobRoles = [
        { title: "Campus Ambassador" },
        { title: "Data Entry Assistant" },
        { title: "Junior Web Developer" },
        { title: "Video Editing Intern" },
        { title: "Graphic Design Intern" },
        { title: "Tutoring (Any Subject)" },
        { title: "Photography Assistant" },
        { title: "Social Media Intern" },
        { title: "Store Helper / Packing Work" },
    ];

    // Fallback to static job roles if database is empty/loading
    const roles = (categories && categories.length > 0)
        ? categories
        : defaultJobRoles;

    const renderCard = (role, i) => {
        const title = role.title || role.name || "";
        const Icon = iconMap[title] || Briefcase; // fallback icon
    const categoryId = resolveCategoryId(title, allCategories.length ? allCategories : roles, "job");
        return (
            <div
                key={i}
                style={styles.card}
                onClick={() => onSelect(title, categoryId)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
                <Icon size={34} strokeWidth={1.6} />
                <span style={styles.label}>{title}</span>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>STEP 1C</h2>
            <p style={styles.subheading}>Choose Job / Internship Role</p>

            <ProgressBar currentStep={1} totalSteps={6} />

            <div style={styles.grid}>
                {roles.map(renderCard)}
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
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "50px", justifyContent: "center", marginTop: "20px" },
    card: { padding: "22px", background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 14px rgba(0,0,0,0.05)", cursor: "pointer", transition: "transform 0.2s", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "150px", boxSizing: "border-box" },
    label: { marginTop: "12px", fontWeight: "600", color: "#0f172a", textAlign: "center", fontSize: "14px" },
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

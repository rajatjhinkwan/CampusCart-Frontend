// STEP 1 — MAIN CATEGORY GRID

import { Smartphone, Bed, FileText, Briefcase } from "lucide-react";
import ProgressBar from "./progressBar";

const categories = [
    { name: "Product", icon: Smartphone },
    { name: "Room", icon: Bed },
    { name: "Job", icon: FileText },
    { name: "Service", icon: Briefcase },
];

export default function CategoryGrid({ onSelect }) {
    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>STEP 1</h2>
            <p style={styles.subheading}>Choose Main Category</p>

            <ProgressBar currentStep={1} totalSteps={6} />

            <div style={styles.grid}>
                {categories.map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                        <div
                            key={i}
                            style={styles.card}
                            onClick={() => onSelect(cat.name)}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "translateY(-5px)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "translateY(0)")
                            }
                        >
                            <Icon size={36} strokeWidth={1.6} />
                            <span style={styles.label}>{cat.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const styles = {
    container: {
        textAlign: "center",
        width: "80vw",
        fontFamily: "Inter, sans-serif",
        margin: "0 auto",
        padding: "20px",
    },
    heading: {
        fontSize: "26px",
        marginBottom: "4px",
        fontWeight: "700",
        color: "#0f172a",
    },
    subheading: {
        fontSize: "15px",
        marginBottom: "28px",
        color: "#64748b",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: "50px",
        justifyContent: "center",
    },
    card: {
        padding: "22px",
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
        cursor: "pointer",
        transition: "0.2s",
        fontSize: "14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "150px",
        width: "200px",
    },
    label: {
        marginTop: "12px",
        fontWeight: "600",
        color: "#0f172a",
    }
};

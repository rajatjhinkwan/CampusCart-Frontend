import { useState, useEffect } from "react";
import axios from "../../../lib/axios";
import ProgressBar from "./progressBar";
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

export default function Step1D({ onSelect }) {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get("/api/categories");
                const allCategories = res.data.categories || [];

                // Filter only service subcategories (type: service & has a parent)
                const serviceSubs = allCategories.filter(
                    (c) => c.type === "service" && c.parent
                );

                setServices(serviceSubs);
            } catch (err) {
                console.error("Error fetching services:", err);
            }
        };

        fetchServices();
    }, []);

    const renderCard = (service, i) => {
        const Icon = iconMap[service.title] || Briefcase; // fallback icon
        return (
            <div
                key={i}
                style={styles.card}
                onClick={() => onSelect(service.title)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
                <Icon size={36} strokeWidth={1.6} />
                <span style={styles.label}>{service.title}</span>
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
};

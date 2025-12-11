import { useState, useEffect } from "react";
import axios from "axios";

// Import icons from lucide-react (only the ones used in products)
import { Smartphone, Shirt, Laptop, Sofa, Camera, Dumbbell, BookMarked, Bike, LampDesk, Gamepad2, Headphones, Monitor, ShoppingBasket, Guitar } from "lucide-react";
import ProgressBar from "./progressBar";

// Map product names to icons
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

export default function Step1A({ onSelect }) {
    const [subcategories, setSubcategories] = useState([]);

    // Fetch subcategories dynamically from backend
    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/categories");
                const allCategories = res.data.categories || [];

                // Find Product main category ID
                const productCategory = allCategories.find(cat => cat.title === "Product");
                if (!productCategory) return;

                // Filter only product subcategories
                const productSubs = allCategories.filter(cat => cat.parent === productCategory._id);
                setSubcategories(productSubs);
            } catch (err) {
                console.error("Error fetching product subcategories:", err);
            }
        };

        fetchSubcategories();
    }, []);

    // Render each card
    const renderCard = (cat, i) => {
        const Icon = iconMap[cat.title] || Smartphone; // fallback icon
        return (
            <div
                key={i}
                style={styles.card}
                onClick={() => onSelect(cat.title)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
                <Icon size={36} strokeWidth={1.6} />
                <span style={styles.label}>{cat.title}</span>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>STEP 1A</h2>
            <p style={styles.subheading}>Choose Your Product Type</p>

            <ProgressBar currentStep={1} totalSteps={6} />

            <div style={styles.grid}>
                {subcategories.map(renderCard)}
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

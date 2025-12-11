// STEP 1C — JOB / INTERNSHIP ROLES

import {
    Briefcase,
    FileText,
    Code,
    Video,
    Palette,
    UserCheck,
    Camera,
    Megaphone,
    Package
} from "lucide-react";

import ProgressBar from "./progressBar";

export default function Step1C({ onSelect }) {
    // Subcategories for Jobs
    const jobRoles = [
        { name: "Campus Ambassador", icon: Briefcase },
        { name: "Data Entry Assistant", icon: FileText },
        { name: "Junior Web Developer", icon: Code },
        { name: "Video Editing Intern", icon: Video },
        { name: "Graphic Design Intern", icon: Palette },
        { name: "Tutoring (Any Subject)", icon: UserCheck },
        { name: "Photography Assistant", icon: Camera },
        { name: "Social Media Intern", icon: Megaphone },
        { name: "Store Helper / Packing Work", icon: Package },
    ];

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>STEP 1C</h2>
            <p style={styles.subheading}>Choose Job / Internship Role</p>

            <ProgressBar currentStep={1} totalSteps={6} />

            <div style={styles.grid}>
                {jobRoles.map((role, i) => {
                    const Icon = role.icon;
                    return (
                        <div
                            key={i}
                            style={styles.card}
                            onClick={() => onSelect(role.name)}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "translateY(-5px)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "translateY(0)")
                            }
                        >
                            <Icon size={34} strokeWidth={1.6} />
                            <span style={styles.label}>{role.name}</span>
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
        marginTop: "20px",
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
        textAlign: "center",
    },
};

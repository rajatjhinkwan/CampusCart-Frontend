// STEP 1C — ROOM SUBCATEGORIES

import React, { useState, useEffect } from 'react';
import { Home, Users, Bed, CalendarDays } from "lucide-react";
import ProgressBar from "./progressBar";

const styles = {
    container: {
        textAlign: 'center',
        width: '80%',
        margin: '0 auto',
        fontFamily: "'Inter', sans-serif",
        padding: '20px',
    },
    heading: {
        fontSize: '1.875rem',
        fontWeight: 700,
        marginBottom: '0.25rem',
        color: '#0f172a',
    },
    subheading: {
        fontSize: '0.875rem',
        marginBottom: '1.75rem',
        color: '#64748b',
    },
    grid: {
        display: 'grid',
        gap: '2rem',
        justifyContent: 'center',
        marginTop: '1.25rem',
        // gridTemplateColumns handled dynamically
    },
    card: {
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        cursor: 'pointer',
        transition: 'all 200ms',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '9rem',
        width: '12rem',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        backgroundColor: '#3b82f6',
        color: 'white',
        fontSize: '0.75rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '9999px',
        fontWeight: 600,
    },
    icon: {
        color: '#334155',
    },
    cardText: {
        marginTop: '0.75rem',
        fontWeight: 600,
        color: '#0f172a',
        textAlign: 'center',
    },
};

export default function Step1C({ onSelect }) {
    // Room types for the subcategory
    const roomTypes = [
        { name: "Single Room", icon: Home, badge: null },
        { name: "Double Room", icon: Users, badge: null },
        { name: "1BHK", icon: Home, badge: "1BHK" },
        { name: "2BHK", icon: Home, badge: "2BHK" },
        { name: "Hostel Bed", icon: Bed, badge: null },
        { name: "PG", icon: Bed, badge: null },
        { name: "Short-Term Stay", icon: CalendarDays, badge: null },
    ];

    const [columns, setColumns] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= 1024) setColumns(4);
            else if (width >= 768) setColumns(3);
            else if (width >= 640) setColumns(2);
            else setColumns(1);
        };
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>STEP 1C</h2>
            <p style={styles.subheading}>Choose Room Type</p>

            {/* Progress Bar showing current step */}
            <ProgressBar currentStep={1} totalSteps={6} />

            {/* Room Grid */}
            <div style={{ ...styles.grid, gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                {roomTypes.map((room, i) => {
                    const Icon = room.icon;
                    return (
                        <div
                            key={i}
                            style={styles.card}
                            onClick={() => onSelect(room.name)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-0.25rem)';
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                            }}
                        >
                            {room.badge && (
                                <span style={styles.badge}>
                                    {room.badge}
                                </span>
                            )}
                            <Icon size={34} strokeWidth={1.6} style={styles.icon} />
                            <span style={styles.cardText}>{room.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// STEP 1C — ROOM SUBCATEGORIES

import { Home, Users, Bed, CalendarDays } from "lucide-react";
import ProgressBar from "./progressBar";

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

    return (
        <div className="text-center w-4/5 mx-auto font-inter p-5">
            <h2 className="text-3xl font-bold mb-1 text-slate-900">STEP 1C</h2>
            <p className="text-sm mb-7 text-slate-500">Choose Room Type</p>

            {/* Progress Bar showing current step */}
            <ProgressBar currentStep={1} totalSteps={6} />

            {/* Room Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center mt-5">
                {roomTypes.map((room, i) => {
                    const Icon = room.icon;
                    return (
                        <div
                            key={i}
                            className="p-6 bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 hover:-translate-y-1 flex flex-col items-center justify-center h-36 w-48 relative"
                            onClick={() => onSelect(room.name)}
                        >
                            {room.badge && (
                                <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                    {room.badge}
                                </span>
                            )}
                            <Icon size={34} strokeWidth={1.6} className="text-slate-700" />
                            <span className="mt-3 font-semibold text-slate-900 text-center">{room.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

import React, { useState } from "react";
import { ArrowLeft, Car, Bus, Truck, Bike } from "lucide-react";
import ProgressBar from "./progressBar";

export default function Step1E({ onNext, onBack }) {
  const [data, setData] = useState({
    vehicleName: "",
    vehicleType: "Car",
    vehicleNumber: "",
    seatsAvailable: 4,
    departureTime: "",
    frequency: "One-time",
    toCity: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.vehicleName || !data.departureTime || !data.toCity) {
      alert("Please fill all required fields");
      return;
    }
    onNext(data);
  };

  const vehicleTypes = [
    { name: "Car", icon: Car },
    { name: "Bus", icon: Bus },
    { name: "Taxi", icon: Car },
    { name: "Bike", icon: Bike },
    { name: "Auto", icon: Car },
    { name: "Truck", icon: Truck }
  ];

  return (
    <div style={styles.container}>
      <ProgressBar currentStep={1} totalSteps={6} />
      
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={styles.heading}>Transport Details</h2>
      </div>
      <p style={styles.subheading}>Tell us about your vehicle and route.</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* Vehicle Type */}
        <div style={styles.section}>
          <label style={styles.label}>Vehicle Type</label>
          <div style={styles.typeGrid}>
            {vehicleTypes.map((t) => (
              <div
                key={t.name}
                onClick={() => setData({ ...data, vehicleType: t.name })}
                style={{
                  ...styles.typeCard,
                  borderColor: data.vehicleType === t.name ? "#2563eb" : "#e2e8f0",
                  backgroundColor: data.vehicleType === t.name ? "#eff6ff" : "#fff"
                }}
              >
                <t.icon size={24} color={data.vehicleType === t.name ? "#2563eb" : "#64748b"} />
                <span style={{ fontSize: "12px", marginTop: "5px" }}>{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Name & Number */}
        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Vehicle Model Name</label>
            <input
              type="text"
              name="vehicleName"
              placeholder="e.g. Mahindra Bolero"
              value={data.vehicleName}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Vehicle Number (Optional)</label>
            <input
              type="text"
              name="vehicleNumber"
              placeholder="e.g. UK07 AB 1234"
              value={data.vehicleNumber}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        {/* Route Details */}
        <div style={styles.section}>
          <label style={styles.label}>Destination City (To)</label>
          <input
            type="text"
            name="toCity"
            placeholder="e.g. Dehradun"
            value={data.toCity}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <p style={styles.hint}>You will set the "From" location in Step 5.</p>
        </div>

        {/* Timing */}
        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Departure Time</label>
            <input
              type="time"
              name="departureTime"
              value={data.departureTime}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Frequency</label>
            <select
              name="frequency"
              value={data.frequency}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="One-time">One-time</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
        </div>

        {/* Seats */}
        <div style={styles.section}>
          <label style={styles.label}>Seats Available</label>
          <input
            type="number"
            name="seatsAvailable"
            min="1"
            max="50"
            value={data.seatsAvailable}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <button type="submit" style={styles.nextButton}>
          Next Step
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Inter, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "5px",
  },
  backButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "5px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
  },
  subheading: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "30px",
    marginLeft: "40px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  row: {
    display: "flex",
    gap: "15px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    backgroundColor: "#fff",
  },
  typeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },
  typeCard: {
    padding: "15px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    transition: "0.2s",
  },
  hint: {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "4px",
  },
  nextButton: {
    marginTop: "20px",
    padding: "14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

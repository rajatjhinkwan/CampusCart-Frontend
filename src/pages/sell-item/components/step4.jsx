import React, { useState } from "react";
import ProgressBar from "./progressBar";

export default function Step4({ data = {}, onNext, onBack, categoryType, jobType }) {
  // 1. Initialize local state from props (if data exists when coming back to this step)
  const [form, setForm] = useState({
    mode: data.mode || "",
    price: data.price || "",
    minPrice: data.minPrice || "",
    rent: data.rent || "",
    salary: data.salary || "",
    rate: data.rate || "",
    jobType: jobType || "",
    experience: data.experience || "",
    skills: data.skills || [],
    
    // 🆕 RENTAL FIELDS
    transactionType: data.transactionType || "sell",
    rentalPeriod: data.rentalPeriod || "Monthly",
    securityDeposit: data.securityDeposit || "",
  });

  // 2. Handle local input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // 3. Handle Next button click
  const handleNextClick = () => {
    onNext(form);
  };

  // Validation based on category
  let isNextDisabled = false;
  if (categoryType === "Job") {
    isNextDisabled = !form.salary || !form.jobType;
  } else if (categoryType === "Room") {
    isNextDisabled = !form.rent;
  } else if (categoryType === "Service") {
    isNextDisabled = !form.rate;
  } else {
    // Product validation
    if (form.transactionType === "rent") {
        isNextDisabled = !form.price || !form.rentalPeriod; // reusing 'price' for rental price
    } else {
        isNextDisabled = !form.mode || !form.price;
    }
  }

  return (
    <div style={styles.container}>
      <ProgressBar currentStep={4} totalSteps={6} />
      <h2 style={styles.heading}>STEP 4</h2>
      <p style={styles.subheading}>
        {categoryType === "Job" ? "Job Details" : categoryType === "Room" ? "Room Details" : categoryType === "Service" ? "Service Details" : "Pricing Details"}
      </p>

      {/* --- INPUTS --- */}

      {categoryType === "Job" ? (
        <>
          {/* Job-specific fields */}
          <div style={styles.field}>
            <label style={styles.label}>Salary</label>
            <input
              type="text"
              name="salary"
              placeholder="e.g. 10k-15k, Negotiable"
              value={form.salary}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Job Type</label>
            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Job Type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Experience Required</label>
            <input
              type="text"
              name="experience"
              placeholder="e.g. 2-3 years, Fresher"
              value={form.experience}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Skills Required</label>
            <input
              type="text"
              name="skills"
              placeholder="e.g. JavaScript, React, Node.js"
              value={form.skills.join(", ")}
              onChange={(e) => setForm(prev => ({ ...prev, skills: e.target.value.split(", ").filter(s => s.trim()) }))}
              style={styles.input}
            />
          </div>
        </>
      ) : categoryType === "Room" ? (
        <>
          {/* Room-specific fields */}
          <div style={styles.field}>
            <label style={styles.label}>Rent (₹)</label>
            <input
              type="number"
              name="rent"
              placeholder="Enter monthly rent"
              value={form.rent}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </>
      ) : categoryType === "Service" ? (
        <>
          {/* Service-specific fields */}
          <div style={styles.field}>
            <label style={styles.label}>Rate (₹)</label>
            <input
              type="number"
              name="rate"
              placeholder="Enter service rate"
              value={form.rate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </>
      ) : (
        <>
          {/* Product pricing fields */}
          <div style={styles.field}>
            <label style={styles.label}>I want to:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, transactionType: 'sell' }))}
                style={{
                  ...styles.typeButton,
                  backgroundColor: form.transactionType === 'sell' ? '#000' : '#f3f4f6',
                  color: form.transactionType === 'sell' ? '#fff' : '#000',
                }}
              >
                Sell
              </button>
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, transactionType: 'rent' }))}
                style={{
                  ...styles.typeButton,
                  backgroundColor: form.transactionType === 'rent' ? '#000' : '#f3f4f6',
                  color: form.transactionType === 'rent' ? '#fff' : '#000',
                }}
              >
                Rent
              </button>
            </div>
          </div>

          {form.transactionType === 'sell' ? (
            <>
              <div style={styles.fieldRelative}>
                <label style={styles.label}>Pricing Mode</label>
                <select
                  name="mode"
                  value={form.mode}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select Pricing Mode</option>
                  <option value="Negotiable">Negotiable</option>
                  <option value="Fixed">Fixed Price</option>
                </select>
                {form.mode === "Negotiable" && (
                  <span style={styles.negotiableBadge}>
                    Negotiable
                  </span>
                )}
              </div>

              {/* 2. Price Input (Shows only if mode is selected) */}
              {form.mode && (
                <div style={styles.field}>
                  <label style={styles.label}>
                    {form.mode === "Negotiable" ? "Expected Price (₹)" : "Price (₹)"}
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    value={form.price}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              )}

              {/* 3. Minimum Price Input (Shows only if mode is Negotiable) */}
              {form.mode === "Negotiable" && (
                <div style={styles.field}>
                  <label style={styles.label}>Minimum Accepted Price (₹)</label>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Optional"
                    value={form.minPrice}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {/* RENTAL FIELDS */}
              <div style={styles.field}>
                <label style={styles.label}>Rental Price (₹)</label>
                <input
                  type="number"
                  name="price" // reusing 'price' field for rental price
                  placeholder="e.g. 500"
                  value={form.price}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Per</label>
                <select
                  name="rentalPeriod"
                  value={form.rentalPeriod}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="Daily">Day</option>
                  <option value="Weekly">Week</option>
                  <option value="Monthly">Month</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Security Deposit (₹) (Optional)</label>
                <input
                  type="number"
                  name="securityDeposit"
                  placeholder="e.g. 1000"
                  value={form.securityDeposit}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </>
          )}
        </>
      )}

      {/* --- BUTTONS --- */}
      <div style={styles.buttonRow}>
        <button style={styles.backButton} onClick={onBack}>
          Back
        </button>

        <button
          style={isNextDisabled ? styles.nextButtonDisabled : styles.nextButton}
          onClick={handleNextClick}
          disabled={isNextDisabled}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "80vw",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "32px",
    fontFamily: "'Inter', sans-serif",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px -5px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
  },
  typeButton: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  heading: {
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "8px",
    color: "#1e293b",
    textAlign: "center",
  },
  subheading: {
    fontSize: "16px",
    marginBottom: "32px",
    color: "#64748b",
    textAlign: "center",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "24px",
  },
  fieldRelative: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "24px",
    position: "relative",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "8px",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "15px",
    background: "#f8fafc",
    transition: "all 0.2s ease",
    outline: "none",
    boxSizing: "border-box",
  },
  negotiableBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#ffffff",
    fontSize: "11px",
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "40px",
    gap: "16px",
  },
  backButton: {
    flex: 1,
    padding: "14px 20px",
    background: "#f1f5f9",
    color: "#475569",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  nextButton: {
    flex: 1,
    padding: "14px 20px",
    background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 16px rgba(14, 165, 233, 0.3)",
  },
  nextButtonDisabled: {
    flex: 1,
    padding: "14px 20px",
    background: "#cbd5e1",
    color: "#94a3b8",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "not-allowed",
    boxShadow: "none",
  },
};

import ProgressBar from "./progressBar";

export default function StepTwoBasicDetails({ form, onChange, onNext, onBack }) {
  return (
    <div style={styles.container}>
      {/* Heading */}
      <h2 style={styles.heading}>STEP 2</h2>
      <p style={styles.subheading}>Tell Us About The Item</p>

      {/* Progress Bar */}
      <ProgressBar currentStep={2} totalSteps={6} />

      {/* Item Title */}
      <div style={styles.field}>
        <label style={styles.label}>Item Title</label>
        <input
          style={styles.input}
          placeholder="e.g. iPhone 14 Pro"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>

      {/* Description */}
      <div style={styles.field}>
        <label style={styles.label}>Description</label>
        <textarea
          style={styles.textarea}
          placeholder="Describe the item..."
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      {/* Condition */}
      <div style={styles.field}>
        <label style={styles.label}>Condition</label>
        <select
          style={styles.input}
          value={form.condition}
          onChange={(e) => onChange("condition", e.target.value)}
        >
          <option value="">Select Condition</option>
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Used">Used</option>
        </select>
      </div>

      {/* Contact Number (for Rooms) */}
      {form.categoryType === "Room" && (
        <div style={styles.field}>
          <label style={styles.label}>Contact Number</label>
          <input
            style={styles.input}
            placeholder="Enter contact number"
            value={form.contactNumber}
            onChange={(e) => onChange("contactNumber", e.target.value)}
          />
        </div>
      )}

      {/* Service Type (for Services) */}
      {form.categoryType === "Service" && (
        <div style={styles.field}>
          <label style={styles.label}>Service Type</label>
          <input
            style={styles.input}
            placeholder="e.g. Plumbing, Electrical"
            value={form.serviceType}
            onChange={(e) => onChange("serviceType", e.target.value)}
          />
        </div>
      )}

      {/* Buttons */}
      <div style={styles.buttonRow}>
        <button style={styles.backButton} onClick={onBack}>
          Back
        </button>

        <button style={styles.nextButton} onClick={onNext}>
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
  textarea: {
    width: "100%",
    padding: "14px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    minHeight: "140px",
    fontSize: "15px",
    background: "#f8fafc",
    transition: "all 0.2s ease",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "inherit",
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
};

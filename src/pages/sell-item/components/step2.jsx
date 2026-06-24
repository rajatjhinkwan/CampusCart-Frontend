import ProgressBar from "./progressBar";

export default function StepTwoBasicDetails({ form, onChange, onNext, onBack }) {
  // Helper to check category
  const category = (form.category || "").toLowerCase();
  const isMobile = /mobile|phone|iphone|android/i.test(category);
  const isVehicle = /car|bike|scooter|vehicle|cycle/i.test(category);
  const isBook = /book|novel|textbook|study/i.test(category);
  const isClothing = /cloth|fashion|wear|shirt|pant|dress/i.test(category);
  const isLaptop = /laptop|computer/i.test(category);
  const isFurniture = /furniture|sofa|table|chair/i.test(category);
  const isCamera = /camera|lens/i.test(category);
  const isInstrument = /guitar|music|instrument/i.test(category);

  // Dynamic Labels
  const brandLabel = isBook ? "Publisher" : "Brand";
  const modelLabel = isBook ? "Author" : isClothing ? "Size" : "Model";

  // Dynamic Placeholders
  const getPlaceholders = () => {
    if (isMobile) return {
      title: "e.g. iPhone 14 Pro Max 256GB",
      desc: "Mention battery health, scratches, accessories...",
      brand: "e.g. Apple, Samsung",
      model: "e.g. iPhone 13"
    };
    if (isVehicle) return {
      title: "e.g. 2018 Maruti Swift VXI",
      desc: "Mention km driven, insurance status, service history...",
      brand: "e.g. Maruti, Hyundai, Hero",
      model: "e.g. Swift, Splendor"
    };
    if (isBook) return {
      title: "e.g. Rich Dad Poor Dad (Hardcover)",
      desc: "Mention edition, condition, highlighted pages...",
      brand: "e.g. Penguin, Oxford",
      model: "e.g. Robert Kiyosaki"
    };
    if (isClothing) return {
      title: "e.g. Zara Denim Jacket (Blue)",
      desc: "Mention material, fit, usage...",
      brand: "e.g. Zara, H&M",
      model: "e.g. M, L, 32"
    };
    if (isLaptop) return {
      title: "e.g. MacBook Air M1 2020",
      desc: "Mention RAM, storage, battery cycle count...",
      brand: "e.g. Apple, Dell, HP",
      model: "e.g. MacBook Air, Inspiron"
    };
    if (isFurniture) return {
      title: "e.g. Wooden 4-Seater Dining Table",
      desc: "Mention dimensions, material, age...",
      brand: "e.g. IKEA, Urban Ladder",
      model: "e.g. N/A"
    };
    if (isCamera) return {
      title: "e.g. Canon EOS 1500D with Lens",
      desc: "Mention shutter count, lens condition...",
      brand: "e.g. Canon, Nikon",
      model: "e.g. EOS 1500D"
    };
    if (isInstrument) return {
      title: "e.g. Yamaha F310 Acoustic Guitar",
      desc: "Mention strings condition, bag inclusion...",
      brand: "e.g. Yamaha, Fender",
      model: "e.g. F310"
    };
    
    // Default
    return {
      title: "e.g. Item Name",
      desc: "Describe the item...",
      brand: "e.g. Brand Name",
      model: "e.g. Model Name"
    };
  };

  const placeholders = getPlaceholders();
  
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
          placeholder={placeholders.title}
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Description</label>
        <textarea
          style={styles.textarea}
          placeholder={placeholders.desc}
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

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

      {form.categoryType === "Product" && (
        <>
          <div style={styles.field}>
            <label style={styles.label}>{brandLabel}</label>
            <input
              style={styles.input}
              placeholder={placeholders.brand}
              value={form.brand}
              onChange={(e) => onChange("brand", e.target.value)}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>{modelLabel}</label>
            <input
              style={styles.input}
              placeholder={placeholders.model}
              value={form.model}
              onChange={(e) => onChange("model", e.target.value)}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Year of Purchase</label>
            <input
              style={styles.input}
              type="number"
              placeholder="e.g. 2021"
              value={form.yearOfPurchase}
              onChange={(e) => onChange("yearOfPurchase", e.target.value)}
            />
          </div>
          
          {isMobile && (
            <div style={styles.field}>
              <label style={styles.label}>Phone IMEI (optional)</label>
              <input
                style={styles.input}
                placeholder="Enter 15-digit IMEI (optional)"
                value={form.imei}
                onChange={(e) => onChange("imei", e.target.value)}
              />
            </div>
          )}

          {isVehicle && (
            <div style={styles.field}>
              <label style={styles.label}>Vehicle Number (optional)</label>
              <input
                style={styles.input}
                placeholder="e.g. MH12AB1234 (optional)"
                value={form.vehicleNumber}
                onChange={(e) => onChange("vehicleNumber", e.target.value)}
              />
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Product Video Link (optional)</label>
            <input
              style={styles.input}
              placeholder="Paste 360° or walkaround video link (optional)"
              value={form.videoUrl}
              onChange={(e) => onChange("videoUrl", e.target.value)}
            />
          </div>
        </>
      )}

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
          <label style={styles.label}>Service Type (optional — pre-filled from your selection)</label>
          <input
            style={styles.input}
            placeholder="e.g. Plumbing, Electrical"
            value={form.serviceType || form.category || ""}
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

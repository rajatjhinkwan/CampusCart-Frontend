import React from "react";
import { MapPin, AlertCircle } from "lucide-react";

const Step5Form = ({ formData, handleChange, isInputsDisabled, pincodeMissingWarning, categoryType }) => {
  // Choose style based on disabled state
  const inputStyle = isInputsDisabled ? styles.inputDisabled : styles.input;
  const textareaStyle = isInputsDisabled ? styles.textareaDisabled : styles.textarea;

  return (
    <div style={styles.formContainer}>
      {/* Area (for Rooms & Jobs) */}
      {(categoryType === "Room" || categoryType === "Job") && (
        <div style={styles.inputWrapper}>
          <label style={styles.label}>Area <span style={styles.required}>*</span></label>
          <input
            style={inputStyle}
            name="area"
            value={formData.area || ""}
            onChange={handleChange}
            disabled={isInputsDisabled}
            placeholder="e.g. Andheri, Bandra"
          />
        </div>
      )}

      {/* City & State */}
      <div style={styles.flexRow}>
        <div style={styles.inputWrapper}>
          <label style={styles.label}>City <span style={styles.required}>*</span></label>
          <input
            style={inputStyle}
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={isInputsDisabled}
            placeholder="e.g. Mumbai"
          />
        </div>
        <div style={styles.inputWrapper}>
          <label style={styles.label}>State <span style={styles.required}>*</span></label>
          <input
            style={inputStyle}
            name="state"
            value={formData.state}
            onChange={handleChange}
            disabled={isInputsDisabled}
            placeholder="Maharashtra"
          />
        </div>
      </div>

      {/* Pincode Section with Warning */}
      <div style={styles.inputWrapper}>
        <label style={styles.label}>Pincode <span style={styles.required}>*</span></label>
        <input
          style={pincodeMissingWarning ? styles.inputWarning : inputStyle}
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          disabled={isInputsDisabled}
          placeholder="e.g. 400001"
          type="number"
        />
        {/* Show warning if auto-detect found city/state but missed pincode */}
        {pincodeMissingWarning && !formData.pincode && (
           <div style={styles.warningBox}>
             <AlertCircle size={14} style={{marginRight: 6}}/>
             We couldn't detect the exact pincode. Please enter it manually.
           </div>
        )}
      </div>

      {/* Address */}
      <div style={styles.inputWrapper}>
        <label style={styles.label}>
          Specific Address <span style={styles.optionalLabel}>(Recommended)</span>
        </label>
        <textarea
          style={textareaStyle}
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={isInputsDisabled}
          placeholder="Flat No., Building Name, Street, nearby landmark..."
        />
      </div>

      {/* Google Maps Link */}
      <div style={styles.inputWrapper}>
        <label style={styles.label}>
          <MapPin size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
          Google Maps Link <span style={styles.optionalLabel}>(Auto-filled or Optional)</span>
        </label>
        <input
          style={inputStyle}
          name="mapLink"
          value={formData.mapLink}
          onChange={handleChange}
          disabled={isInputsDisabled}
          placeholder="https://maps.google.com/..."
        />
      </div>
    </div>
  );
};

// --- STYLES ---
// Fixed CSS: Using explicit border properties to avoid React warnings
const baseInputStyles = {
  width: "100%", padding: "12px 14px", borderRadius: "8px", borderWidth: "1px", borderStyle: "solid", borderColor: "#cbd5e1", fontSize: "15px", color: "#0f172a", background: "#fff", outline: "none", boxSizing: "border-box", transition: "all 0.2s",
};

const styles = {
  formContainer: { display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px" },
  flexRow: { display: "flex", gap: "16px" },
  inputWrapper: { flex: 1, display: "flex", flexDirection: "column" },
  label: { fontSize: "14px", fontWeight: 600, color: "#334155", marginBottom: "6px" },
  required: { color: "#ef4444" },
  optionalLabel: { fontWeight: 400, color: "#94a3b8", fontSize: "13px" },

  input: { ...baseInputStyles, ':focus': { borderColor: '#3b82f6' } },
  // Style for when inputs are disabled during loading
  inputDisabled: { ...baseInputStyles, background: "#f1f5f9", color: "#94a3b8", cursor: "not-allowed", borderColor: "#e2e8f0" },
  // Style for when pincode was missed by auto-detect
  inputWarning: { ...baseInputStyles, borderColor: "#f59e0b", background: "#fffbeb" },

  textarea: { ...baseInputStyles, minHeight: "80px", resize: "vertical", fontFamily: "inherit" },
  textareaDisabled: { ...baseInputStyles, minHeight: "80px", resize: "vertical", fontFamily: "inherit", background: "#f1f5f9", color: "#94a3b8", cursor: "not-allowed", borderColor: "#e2e8f0" },

  warningBox: { marginTop: '6px', fontSize: '13px', color: '#b45309', display: 'flex', alignItems: 'center' }
};

export default Step5Form;
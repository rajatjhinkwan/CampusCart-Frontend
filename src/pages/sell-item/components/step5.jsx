import React, { useState, useEffect, useCallback } from "react";
import ProgressBar from "./progressBar";
import { Navigation, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

// Import split components
import useStep5Geolocation from "./use-step5-geolocation";
import Step5Map from "./step5-map";
import Step5Form from "./step5-form";

export default function Step5({ form = {}, onNext, onBack, categoryType }) {
  // --- 1. Form Data State ---
  const [formData, setFormData] = useState({
    city: form.city || "",
    state: form.state || "",
    pincode: form.pincode || "",
    address: form.address || "",
    mapLink: form.mapLink || "",
  });

  // --- 2. Geolocation & API Hooks/States ---
  const { position, geoStatus, geoError, getPosition, resetGeo } = useStep5Geolocation();

  // Overall process status for UI feedback
  // 'idle' | 'loading_geo' | 'loading_api' | 'success' | 'success_partial' | 'error'
  const [mainStatus, setMainStatus] = useState("idle");
  const [apiError, setApiError] = useState(null);


  // --- EFFECT 2: Monitor Hardware Geolocation Status ---
  // This ensures hook order is maintained. We react to status changes.
  useEffect(() => {
    if (geoStatus === "loading") setMainStatus("loading_geo");
    if (geoStatus === "error") setMainStatus("error");
    // If geoStatus is 'success', the next effect (monitoring 'position') will naturally kick in.
  }, [geoStatus]);


  // --- EFFECT 3: Fetch Address from API when Coordinates are found ---
  useEffect(() => {
    // Only proceed if we have valid coordinates from the hook
    if (!position || !position.lat || !position.lng) return;

    const fetchAddressFromAPI = async () => {
      setMainStatus("loading_api");
      setApiError(null);

      try {
        // Using BigDataCloud free API (CORS-friendly)
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.lat}&longitude=${position.lng}&localityLanguage=en`
        );

        if (!response.ok) throw new Error("Failed to connect to address service.");
        const data = await response.json();

        // --- ROBUST DATA MAPPING ---
        // Try multiple fields because free APIs are inconsistent.
        const detectedCity = data.city || data.locality || data.town || "";
        const detectedState = data.principalSubdivision || data.region || "";
        // Look for postcode in multiple places (zipcode is often used by this API)
        const detectedPincode = data.postcode || data.zipcode || "";

        const gMapsLink = `https://www.google.com/maps?q=${position.lat},${position.lng}`;

        // Update form with whatever we found
        setFormData((prev) => ({
          ...prev,
          city: detectedCity,
          state: detectedState,
          pincode: detectedPincode,
          mapLink: gMapsLink,
        }));

        // Determine success type based on whether we found the essential data
        if (detectedCity && detectedState && detectedPincode) {
            // Perfect scenario
            setMainStatus("success");
        } else if (detectedCity && detectedState) {
            // We got city/state, but missed pincode. Still useful, but partial.
            // This triggers the yellow warning in the form.
            setMainStatus("success_partial");
        } else {
            // API returned coordinates but data was unusable
            throw new Error("API returned coordinates but could not determine City or State.");
        }

        // Reset status back to idle after 5s so messages disappear
        setTimeout(() => {
            setMainStatus(prev => (prev.startsWith('success') ? 'idle' : prev));
        }, 5000);

      } catch (err) {
        console.error("API Error:", err);
        setApiError(err.message || "Failed to fetch address details.");
        setMainStatus("error");
        resetGeo(); // Clear map position on API error
      }
    };

    fetchAddressFromAPI();
  }, [position, resetGeo]);


  // --- EVENT HANDLERS ---
  const handleManualChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // If user types, clear error states
    if (mainStatus === 'error') setMainStatus('idle');
    // If they type in the pincode box, remove the partial success warning
    if (mainStatus === 'success_partial' && e.target.name === 'pincode') setMainStatus('idle');
  }, [mainStatus]);

  const handleDetectClick = () => {
      setApiError(null);
      // This starts the chain reaction in the custom hook
      getPosition();
  };


  // --- RENDER HELPERS ---
  const isLoading = mainStatus === "loading_geo" || mainStatus === "loading_api";
  const combinedError = geoError || apiError;
  // Can proceed if City, State, and Pincode are filled (either automatically or manually)
  // For Rooms and Jobs, also require area
  const isFormValid = formData.city.trim() && formData.state.trim() && formData.pincode.toString().trim() &&
    ((categoryType === "Room" || categoryType === "Job") ? formData.area?.trim() : true);

  return (
    <div style={styles.container}>
      <ProgressBar currentStep={5} totalSteps={6} />
      <h2 style={styles.heading}>Location Details</h2>

      {/* --- HERO SECTION (Buttons & Status Messages) --- */}
      <div style={styles.heroSection}>
        <button
          onClick={handleDetectClick}
          disabled={isLoading}
          style={isLoading ? { ...styles.detectButton, ...styles.detectButtonDisabled } : styles.detectButton}
        >
          {isLoading ? (
            <Loader2 className="spin-animation" size={20} style={{ marginRight: 10 }} />
          ) : (
            <Navigation size={20} style={{ marginRight: 10 }} />
          )}
          {mainStatus === 'loading_geo' ? "Acquiring GPS..." :
           mainStatus === 'loading_api' ? "Fetching address..." :
           "Detect My Current Location"}
        </button>

        {/* Messages based on Main Status */}
        {mainStatus === "error" && combinedError && (
          <div style={styles.errorBox}>
            <AlertCircle size={18} style={{ marginRight: 8, flexShrink: 0 }} />
            <span>{combinedError}</span>
          </div>
        )}

        {mainStatus === "success" && (
          <div style={styles.successBox}>
            <CheckCircle2 size={18} style={{ marginRight: 8, flexShrink: 0 }} />
            <span>Location and Pincode detected successfully!</span>
          </div>
        )}

         {mainStatus === "success_partial" && (
          <div style={styles.warningBox}>
            <AlertCircle size={18} style={{ marginRight: 8, flexShrink: 0 }} />
            <span>Found City and State, but could not detect exact Pincode. Please enter it below.</span>
          </div>
        )}
      </div>

      {/* --- MAP --- */}
      <Step5Map position={position} />

      {/* --- DIVIDER --- */}
      <div style={styles.divider}>
        <div style={styles.dividerLine}></div>
        <span style={{ margin: "0 10px", whiteSpace: 'nowrap' }}>or enter manually</span>
        <div style={styles.dividerLine}></div>
      </div>

      {/* --- FORM INPUTS --- */}
      <Step5Form
        formData={formData}
        handleChange={handleManualChange}
        // Only disable inputs totally while loading.
        isInputsDisabled={isLoading}
        // Pass warning flag if we got partial success
        pincodeMissingWarning={mainStatus === 'success_partial' && !formData.pincode}
        categoryType={categoryType}
      />

      {/* --- FOOTER BUTTONS --- */}
      <div style={styles.buttonRow}>
        <button style={styles.backButton} onClick={onBack} disabled={isLoading}>
          Back
        </button>
        <button
          style={isLoading || !isFormValid ? { ...styles.nextButton, ...styles.nextButtonDisabled } : styles.nextButton}
          onClick={() => onNext(formData)}
          disabled={isLoading || !isFormValid}
        >
          Next step
        </button>
      </div>

      <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// --- STYLES ---
const styles = {
  container: {
    width: "80vw",
    maxWidth: "650px",
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
  // Hero Section
  heroSection: {
    background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center",
    border: "2px solid #e2e8f0",
    marginBottom: "32px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
  },
  detectButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "16px 24px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 6px 20px rgba(37, 99, 235, 0.3)",
  },
  detectButtonDisabled: {
    background: "#94a3b8",
    cursor: "not-allowed",
    boxShadow: "none",
    transform: "none",
  },

  // Message Boxes
  errorBox: {
    marginTop: "20px",
    padding: "16px",
    background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
    border: "2px solid #fecaca",
    borderRadius: "12px",
    color: "#b91c1c",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    textAlign: "left",
    boxShadow: "0 4px 16px rgba(185, 28, 28, 0.1)",
  },
  successBox: {
    marginTop: "20px",
    padding: "16px",
    background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    border: "2px solid #bbf7d0",
    borderRadius: "12px",
    color: "#15803d",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    textAlign: "left",
    boxShadow: "0 4px 16px rgba(21, 128, 61, 0.1)",
  },
  warningBox: {
    marginTop: "20px",
    padding: "16px",
    background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    border: "2px solid #fcd34d",
    borderRadius: "12px",
    color: "#b45309",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    textAlign: "left",
    boxShadow: "0 4px 16px rgba(180, 83, 9, 0.1)",
  },

  // Divider
  divider: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "14px",
    marginBottom: "24px",
  },
  dividerLine: {
    flex: 1,
    borderBottom: "2px solid #e2e8f0",
  },

  // Footer Buttons
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "40px",
    paddingTop: "24px",
    borderTop: "2px solid #f1f5f9",
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
    background: "#cbd5e1",
    boxShadow: "none",
    cursor: "not-allowed",
    transform: "none",
  },
};

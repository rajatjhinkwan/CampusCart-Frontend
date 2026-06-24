import React from "react";

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.label}>
        Step {currentStep} of {totalSteps}
      </div>
      <div style={styles.track}>
        <div
          style={{ ...styles.bar, width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: "24px",
    textAlign: "center",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    marginBottom: "8px",
  },
  track: {
    width: "100%",
    height: "6px",
    backgroundColor: "#e2e8f0",
    borderRadius: "3px",
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    backgroundColor: "#0ea5e9",
    borderRadius: "3px",
    transition: "width 0.3s ease-in-out",
  },
};

export default ProgressBar;
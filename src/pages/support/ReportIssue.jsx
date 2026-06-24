import React from "react";

const ReportIssue = () => {
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      color: "#1f2937",
      lineHeight: 1.6,
    },
    heading: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#0f172a",
    },
    paragraph: {
      marginBottom: "16px",
      fontSize: "14px",
    },
    sectionTitle: {
      marginTop: "24px",
      marginBottom: "8px",
      fontWeight: "600",
      fontSize: "16px",
      color: "#111827",
    },
    list: {
      marginLeft: "20px",
      marginBottom: "16px",
      fontSize: "14px",
    },
    highlight: {
      fontWeight: "600",
      color: "#1d4ed8",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Report an Issue</h1>
      <p style={styles.paragraph}>
        If you notice a problem with a listing, user, payment, or any other part of the platform,
        you can report it here so our team can review and take action.
      </p>

      <h2 style={styles.sectionTitle}>What you can report</h2>
      <ul style={styles.list}>
        <li>Suspicious or fraudulent listings</li>
        <li>Abusive or inappropriate messages</li>
        <li>Scams, spam, or misleading information</li>
        <li>Safety or privacy concerns</li>
        <li>Technical problems with the website</li>
      </ul>

      <h2 style={styles.sectionTitle}>How to report a listing or user</h2>
      <p style={styles.paragraph}>
        On product, room, service, job, or ride pages you may see options in the interface
        to contact support or flag a listing. Use those options whenever possible so we
        receive the correct details automatically.
      </p>

      <h2 style={styles.sectionTitle}>Report a general issue</h2>
      <p style={styles.paragraph}>
        For general problems that are not tied to a specific listing, please share the
        following details with us:
      </p>
      <ul style={styles.list}>
        <li>The page where the issue happened</li>
        <li>A short description of what went wrong</li>
        <li>Any screenshots or error messages you saw</li>
        <li>The time and date when it happened</li>
      </ul>
      <p style={styles.paragraph}>
        You can send this information through the contact options listed in the{" "}
        <span style={styles.highlight}>Help Center</span> or other support channels provided
        on the site.
      </p>
    </div>
  );
};

export default ReportIssue;


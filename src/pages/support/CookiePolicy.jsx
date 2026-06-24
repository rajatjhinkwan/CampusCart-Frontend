import React from "react";

const CookiePolicy = () => {
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
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Cookie Policy</h1>
      <p style={styles.paragraph}>
        CampusCart uses cookies to enhance your browsing experience. Cookies help us understand user behavior, remember preferences, and improve our platform.
      </p>
      <p style={styles.paragraph}>
        By using our website, you consent to the use of cookies. You can manage cookie preferences through your browser settings.
      </p>
      <p style={styles.paragraph}>
        Cookies are essential for the proper functioning of CampusCart and for providing a seamless user experience.
      </p>
    </div>
  );
};

export default CookiePolicy;

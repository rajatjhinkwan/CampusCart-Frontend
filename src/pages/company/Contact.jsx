import React from "react";

const Contact = () => {
  const styles = {
    container: { maxWidth: "900px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif", color: "#1f2937", lineHeight: 1.6 },
    heading: { fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", color: "#0f172a" },
    paragraph: { marginBottom: "16px", fontSize: "14px" },
    form: { display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" },
    input: { padding: "12px", fontSize: "14px", borderRadius: "6px", border: "1px solid #ccc" },
    textarea: { padding: "12px", fontSize: "14px", borderRadius: "6px", border: "1px solid #ccc", resize: "vertical" },
    button: { padding: "12px 18px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Contact Us</h1>
      <p style={styles.paragraph}>
        Have questions or feedback? Reach out to our support team and we’ll get back to you as soon as possible.
      </p>
      <form style={styles.form}>
        <input type="text" placeholder="Your Name" style={styles.input} />
        <input type="email" placeholder="Your Email" style={styles.input} />
        <textarea placeholder="Your Message" rows={5} style={styles.textarea}></textarea>
        <button type="submit" style={styles.button}>Send Message</button>
      </form>
    </div>
  );
};

export default Contact;

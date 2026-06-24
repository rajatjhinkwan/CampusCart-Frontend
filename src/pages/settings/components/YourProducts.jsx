import React from "react";

export default function YourProducts() {
  const products = [
    {
      id: 1,
      title: "HP Pavilion Laptop",
      price: "₹28,000",
      location: "Campus Hostel A",
      image: "https://via.placeholder.com/160",
      status: "Active",
    },
    {
      id: 2,
      title: "Study Table + Chair",
      price: "₹3,500",
      location: "Block C, Room 112",
      image: "https://via.placeholder.com/160",
      status: "Inactive",
    },
  ];

  const container = {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  };

  const title = {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
  };

  const card = {
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    overflow: "hidden",
    background: "#f8fafc",
  };

  const imgBox = {
    width: "100%",
    height: "150px",
    background: "#e2e8f0",
  };

  const info = {
    padding: "14px",
  };

  const productTitle = {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "6px",
  };

  const price = {
    fontSize: "15px",
    fontWeight: "500",
    color: "#2563eb",
    marginBottom: "4px",
  };

  const small = {
    fontSize: "13px",
    color: "#64748b",
  };

  const statusPill = (state) => ({
    display: "inline-block",
    padding: "4px 10px",
    fontSize: "12px",
    borderRadius: "20px",
    background: state === "Active" ? "#d1fae5" : "#fee2e2",
    color: state === "Active" ? "#065f46" : "#991b1b",
    marginTop: "8px",
  });

  return (
    <div style={container}>
      <h2 style={title}>Your Products</h2>

      {products.length === 0 ? (
        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          You haven’t listed any products yet.
        </p>
      ) : (
        <div style={grid}>
          {products.map((item) => (
            <div key={item.id} style={card}>
              <div style={imgBox}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div style={info}>
                <div style={productTitle}>{item.title}</div>
                <div style={price}>{item.price}</div>
                <div style={small}>{item.location}</div>

                <div style={statusPill(item.status)}>{item.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

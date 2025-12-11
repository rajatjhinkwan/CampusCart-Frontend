import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

function Categories() {
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFF",
    padding: "1px",
    borderRadius: "12px",
    width: "90%",
    margin: "20px auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "16px",
    width: "250px",
    minheight: "160px",
    margin: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  };

  const cardHover = {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
  };

  const iconBox = (bgColor) => ({
    backgroundColor: bgColor,
    color: "#fff",
    borderRadius: "12px",
    width: "55px",
    height: "55px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10px",
  });

  const cardText = {
    display: 'flex',
    justifyContent: "flexstart",
    alignItems: "center",
    flexDirection: 'column',
    border: '2px solid black'
  }

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: "4px",
  };

  const subTextStyle = {
    fontSize: "14px",
    color: "#64748B",
    marginBottom: "8px",
  };

  const countStyle = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#2563EB",
  };

  // Data for cards
  const cards = [
    { icon: "fa-car", title: "Vehicles", desc: "Cars, Bikes, Trucks", color: "#2563EB", count: "125,430" },
    { icon: "fa-house", title: "Real Estate", desc: "Houses, Apartments, Land", color: "#10B981", count: "89,250" },
    { icon: "fa-mobile-screen", title: "Electronics", desc: "Phones, Laptops, Gadgets", color: "#8B5CF6", count: "234,180" },
    { icon: "fa-briefcase", title: "Jobs", desc: "Full-time, Part-time, Freelance", color: "#F97316", count: "45,670" },
    { icon: "fa-screwdriver-wrench", title: "Services", desc: "Repair, Cleaning, Tutoring", color: "#EF4444", count: "67,890" },
    { icon: "fa-shirt", title: "Fashion", desc: "Clothing, Shoes, Accessories", color: "#EC4899", count: "156,340" },
    { icon: "fa-tree", title: "Home & Garden", desc: "Furniture, Decor, Plants", color: "#22C55E", count: "78,920" },
    { icon: "fa-dumbbell", title: "Sports", desc: "Equipment, Fitness, Outdoor", color: "#06B6D4", count: "34,560" },
  ];

  // ✅ Fetch categories only once using useEffect
  const [categories, setCategories] = useState([]);

  if (categories.length === 0) {
    console.log("Categories state is empty.");
    setCategories(cards); // Set default cards if API data is not yet available
  }

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((response) => {
        console.log("Fetching categories from API...");
        console.log("API Response:", response.data.categories);
        // FIXED: set only the array, not the whole object
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []); // run only once

  return (
    <div style={containerStyle}>
      {categories.map((item, index) => (
        <div
          key={index}
          style={cardStyle}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, cardHover);
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, cardStyle);
          }}
        >
          <div style={iconBox(item.color)}>
            <i
              className={`fa-solid ${item.icon}`}
              style={{ fontSize: "24px" }}
            ></i>
          </div>

          <div style={{ cardText }}>
            <h2 style={titleStyle}>{item.name}</h2>
            <p style={subTextStyle}>{item.desc}</p>
            <p style={countStyle}>
              {item.count}{" "}
              <span style={{ color: "#94A3B8", fontSize: "14px" }}>ads</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );

}

export default Categories;
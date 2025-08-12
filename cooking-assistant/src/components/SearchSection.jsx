import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";

const popularSearches = [
  "Biryani",
  "Chicken",
  "Pizza",
  "Milkshakes",
  "Pancakes",
  "Cookies",
  "Desert",
  "Handi",
  "Karahi",
  "BBQ",
];

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/recipes?q=${encodeURIComponent(searchTerm.trim())}&from=manual`);
  };

  const handlePopularClick = (term) => {
    navigate(`/recipes?q=${encodeURIComponent(term)}&from=manual`);
  };

  return (
    <section
      style={{
        padding: "40px 20px",
        textAlign: "center",
        background: "#F3D4AD",
      }}
    >
      {/* 🔥 Title with icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <FaUtensils size={32} color="#ff5722" />
        <h2 style={{ fontSize: "28px", margin: 0 }}>
          What would you like to cook?
        </h2>
      </div>

      {/* 🔍 Search bar */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Search here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "300px",
            padding: "12px 16px",
            borderRadius: "30px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#ff5722",
            border: "none",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "30px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {/* ⭐ Popular searches */}
      <h4 style={{ marginBottom: "15px", fontSize: "20px", color: "#333" }}>
        Popular Searches
      </h4>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {popularSearches.map((item) => (
          <button
            key={item}
            onClick={() => handlePopularClick(item)}
            style={{
              padding: "10px 16px",
              borderRadius: "20px",
              border: "1px solid #ddd",
              background: "#f5f5f5",
              cursor: "pointer",
              fontSize: "15px",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "#e9a540ff")
            }
            onMouseOut={(e) => (e.currentTarget.style.background = "#f5f5f5")}
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
};

export default SearchSection;

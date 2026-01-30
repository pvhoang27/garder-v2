import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const DynamicSection = ({ id, title, type, paramValue }) => {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    if (type === "manual") {
      axiosClient
        .get(`/layout/${id}/plants`)
        .then((res) => setPlants(res.data))
        .catch((err) => console.error(err));
      return;
    }

    if (type === "category") {
      axiosClient.get("/plants").then((res) => {
        let data = res.data;
        if (paramValue) {
          data = data.filter((p) => p.category_id == paramValue);
        }
        setPlants(data.slice(0, 8));
      });
    }
  }, [id, type, paramValue]);

  if (plants.length === 0) return null;

  return (
    <div className="container" style={{ marginTop: "40px" }}>
      <h2 className="section-heading" style={{ color: "#2e7d32", borderBottom: "2px solid #2e7d32", marginBottom: "20px", display: "inline-block" }}>
        {title}
      </h2>
      <div
        className="plant-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {plants.map((plant) => (
          <div
            key={plant.id}
            className="plant-card"
            style={{
              background: "white",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "0.3s",
            }}
          >
            <Link
              to={`/plant/${plant.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={{ height: "200px", overflow: "hidden" }}>
                <img
                  src={`http://localhost:3000${plant.thumbnail}`}
                  alt={plant.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "0.3s",
                  }}
                  onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                  onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "15px" }}>
                <h4
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "1.1rem",
                    color: "#333",
                  }}
                >
                  {plant.name}
                </h4>
                <p style={{ margin: 0, color: "#d32f2f", fontWeight: "bold" }}>
                  {Number(plant.price).toLocaleString()} đ
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicSection;
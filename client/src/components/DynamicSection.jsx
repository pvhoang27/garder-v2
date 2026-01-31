import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { FaLeaf, FaArrowRight } from "react-icons/fa";

const DynamicSection = ({ id, title, type, paramValue, categories, index }) => {
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

  const getImageUrl = (path) => {
    if (!path)
      return "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    if (path.startsWith("http")) return path;
    return `http://localhost:3000${path}`;
  };

  const getCategoryName = (catId) => {
    if (!categories || categories.length === 0) return "Cây cảnh";
    const cat = categories.find((c) => c.id == catId);
    return cat ? cat.name : "Cây cảnh";
  };

  if (plants.length === 0) return null;

  // --- LOGIC THẨM MỸ (AESTHETIC LOGIC) ---
  // Section trước đó (Featured) là màu XÁM (bg-secondary).
  // Vì vậy: 
  // - index 0 (Section đầu tiên): Nên là TRẮNG để tách biệt.
  // - index 1 (Section thứ hai): Nên là XÁM để đổi gió.
  // - index 2: TRẮNG...
  // Logic: Nếu index là số lẻ (1, 3, 5...) -> Thêm class bg-secondary.
  
  const sectionClass = index % 2 !== 0 ? "section bg-secondary" : "section";
  
  // Điều chỉnh style phụ trợ để nút bấm và badge hài hòa trên nền xám
  const badgeStyle = index % 2 !== 0 ? { background: "white", marginBottom: "10px" } : { marginBottom: "10px" };
  const btnStyle = index % 2 !== 0 ? { background: "white" } : {};

  return (
    <section className={sectionClass}>
      <div className="container">
        {/* Header Section */}
        <div className="section-header flex-between">
          <div>
            <div className="badge" style={badgeStyle}>
              <FaLeaf /> Bộ sưu tập
            </div>
            <h2 className="section-title">{title}</h2>
          </div>
          <Link
            to={
              type === "category" && paramValue
                ? `/?category_id=${paramValue}`
                : "/gallery"
            }
            className="btn btn-outline"
            style={btnStyle}
          >
            Xem tất cả <FaArrowRight />
          </Link>
        </div>

        {/* Plant Grid - Chuẩn class của HomePage để tái sử dụng CSS */}
        <div className="plant-grid">
          {plants.map((plant) => (
            <Link
              key={plant.id}
              to={`/plant/${plant.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="plant-item-card">
                <div className="plant-img-wrapper">
                  <img
                    src={getImageUrl(plant.thumbnail)}
                    alt={plant.name}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </div>
                <div className="plant-content">
                  <span className="plant-category">
                    {getCategoryName(plant.category_id)}
                  </span>
                  <h4 className="plant-title">{plant.name}</h4>
                  <div className="plant-price">
                    {Number(plant.price).toLocaleString()} ₫
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicSection;
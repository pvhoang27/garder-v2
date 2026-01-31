import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { FaLeaf, FaArrowRight } from "react-icons/fa";

const DynamicSection = ({ id, title, type, paramValue, categories }) => {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    // Logic fetch dữ liệu giữ nguyên
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
        setPlants(data.slice(0, 8)); // Lấy tối đa 8 cây
      });
    }
  }, [id, type, paramValue]);

  // Helper xử lý ảnh (copy từ HomePage để đảm bảo hiển thị đúng)
  const getImageUrl = (path) => {
    if (!path)
      return "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    if (path.startsWith("http")) return path;
    return `http://localhost:3000${path}`;
  };

  // Helper lấy tên danh mục
  const getCategoryName = (catId) => {
    if (!categories || categories.length === 0) return "Cây cảnh";
    const cat = categories.find((c) => c.id == catId);
    return cat ? cat.name : "Cây cảnh";
  };

  if (plants.length === 0) return null;

  return (
    // Sử dụng class 'section' để đồng bộ style padding/margin với trang chủ
    <section className="section">
      <div className="container">
        {/* Header Section: Badge + Title + Button 'Xem tất cả' */}
        <div className="section-header flex-between">
          <div>
            <div className="badge" style={{ marginBottom: "10px" }}>
              <FaLeaf /> Bộ sưu tập
            </div>
            <h2 className="section-title">{title}</h2>
          </div>
          {/* Nút xem tất cả (điều hướng sang gallery hoặc search theo category) */}
          <Link
            to={
              type === "category" && paramValue
                ? `/?category_id=${paramValue}`
                : "/gallery"
            }
            className="btn btn-outline"
          >
            Xem tất cả <FaArrowRight />
          </Link>
        </div>

        {/* Grid hiển thị cây: Sử dụng class 'plant-grid' của HomePage */}
        <div className="plant-grid">
          {plants.map((plant) => (
            <Link
              key={plant.id}
              to={`/plant/${plant.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {/* Sử dụng đúng cấu trúc class 'plant-item-card' */}
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
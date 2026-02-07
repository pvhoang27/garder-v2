import React from "react";
import { Link } from "react-router-dom";
import { FaSpa, FaArrowRight } from "react-icons/fa";
import PlantCard from "./PlantCard";

const FeaturedSection = ({ loading, featuredPlants, categories }) => {
  return (
    <section className="section bg-secondary">
      <div className="container">
        {/* 1. HEADER: Xóa flex-between và xóa nút Link ở đây */}
        <div className="section-header">
          <div>
            <div
              className="badge"
              style={{ marginBottom: "10px", background: "white" }}
            >
              <FaSpa /> Nổi bật
            </div>
            <h2 className="section-title">Cây cảnh tiêu biểu</h2>
          </div>
        </div>

        {/* CONTENT GRID */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="plant-grid">
            {featuredPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} categories={categories} />
            ))}
          </div>
        )}

        {/* 2. FOOTER: Đưa nút Xem tất cả xuống dưới cùng cho đồng bộ */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link
            to="/?is_featured=true"
            className="btn btn-outline"
            style={{ background: "white" }}
          >
            Xem tất cả <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
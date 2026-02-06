import React from "react";
import { FaEye, FaComment } from "react-icons/fa";
import PlantCard from "./PlantCard";

const TrendingSection = ({
  trendingPlants,
  loadingTrending,
  trendingFilter,
  setTrendingFilter,
  categories,
}) => {
  return (
    <section
      className="section bg-light-green"
      style={{ background: "#f9fcf5" }}
    >
      <div className="container">
        <div
          className="section-header flex-between"
          style={{ alignItems: "center" }}
        >
          <div>
            <h2 className="section-title">Xu hướng quan tâm</h2>
            <p className="section-desc">
              Những tác phẩm thu hút sự chú ý của cộng đồng
            </p>
          </div>

          {/* Bộ lọc Views/Comments */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              background: "#fff",
              padding: "5px",
              borderRadius: "30px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            }}
          >
            <button
              onClick={() => setTrendingFilter("views")}
              style={{
                border: "none",
                background:
                  trendingFilter === "views" ? "#4ca771" : "transparent",
                color: trendingFilter === "views" ? "#fff" : "#666",
                padding: "8px 20px",
                borderRadius: "25px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <FaEye /> Xem nhiều nhất
            </button>
            <button
              onClick={() => setTrendingFilter("comments")}
              style={{
                border: "none",
                background:
                  trendingFilter === "comments" ? "#4ca771" : "transparent",
                color: trendingFilter === "comments" ? "#fff" : "#666",
                padding: "8px 20px",
                borderRadius: "25px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <FaComment /> Thảo luận sôi nổi
            </button>
          </div>
        </div>

        {loadingTrending ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Đang tải xu hướng...
          </div>
        ) : (
          <div className="plant-grid">
            {trendingPlants.length > 0 ? (
              trendingPlants.map((plant) => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  categories={categories}
                  showStats={true}
                  trendingFilter={trendingFilter}
                />
              ))
            ) : (
              <p style={{ width: "100%", textAlign: "center", color: "#888" }}>
                Chưa có dữ liệu xu hướng
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingSection;
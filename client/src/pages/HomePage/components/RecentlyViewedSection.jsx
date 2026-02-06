import React, { useEffect, useState } from "react";
import PlantCard from "./PlantCard";
import { FaHistory } from "react-icons/fa";

const RecentlyViewedSection = ({ categories }) => {
  const [viewedPlants, setViewedPlants] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage khi component mount
    const stored = localStorage.getItem("recently_viewed");
    if (stored) {
      setViewedPlants(JSON.parse(stored));
    }
  }, []);

  // Nếu chưa xem gì thì không hiển thị section này
  if (viewedPlants.length === 0) return null;

  return (
    <section className="section bg-light-green" style={{ background: "#fdfdfd", borderTop: "1px solid #eee" }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaHistory style={{ color: "#4ca771" }} /> 
            Đã xem gần đây
          </h2>
          <p className="section-desc">
            Tiếp tục khám phá những loại cây bạn đang quan tâm
          </p>
        </div>

        <div className="plant-grid">
          {viewedPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              categories={categories}
              // Có thể ẩn stats nếu muốn gọn, hoặc để true
              showStats={false} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
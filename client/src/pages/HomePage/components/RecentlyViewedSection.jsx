import React, { useEffect, useState } from "react";
import PlantCard from "./PlantCard";
import { FaHistory } from "react-icons/fa";

const RecentlyViewedSection = ({ categories, data }) => {
  const [viewedPlants, setViewedPlants] = useState([]);

  useEffect(() => {
    // Nếu có data từ props (HomePage truyền xuống) thì dùng luôn
    if (data) {
      setViewedPlants(data);
    } else {
      // Fallback: Nếu không truyền props thì tự lấy từ localStorage (như code cũ)
      const stored = localStorage.getItem("recently_viewed");
      if (stored) {
        setViewedPlants(JSON.parse(stored));
      }
    }
  }, [data]);

  // Nếu chưa xem gì thì không hiển thị section này
  if (viewedPlants.length === 0) return null;

  return (
    // Xóa class bg-light-green và style background để Section có nền Trắng (mặc định)
    // Để tương phản với FeaturedSection (Nền Xanh) ở trên
    <section className="section" style={{ borderTop: "1px solid #eee" }}>
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
              showStats={false}
              // TRUYỀN MÀU NỀN CHO CARD:
              // Vì Section nền Trắng, nên Card phải nền Xanh (#f7fee7) để Zigzag
              cardStyle={{ background: "#f7fee7" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
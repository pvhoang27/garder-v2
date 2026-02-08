import React from "react";
import { Link } from "react-router-dom";
import { FaEye, FaComment } from "react-icons/fa";

const PlantCard = ({ plant, categories, showStats = false, trendingFilter = 'views', cardStyle = {} }) => {
  const catName = categories.find((c) => c.id === plant.category_id)?.name || "Indoor";

  const getImageUrl = (path) => {
    if (!path)
      return "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    if (path.startsWith("http")) return path;
    return `http://localhost:3000${path}`;
  };

  return (
    <Link
      to={`/plant/${plant.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="plant-item-card" style={cardStyle}>
        <div className="plant-img-wrapper">
          <img
            src={getImageUrl(plant.thumbnail)}
            alt={plant.name}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
            }}
          />
          {/* Nếu showStats = true thì hiển thị icon tương ứng */}
          {showStats && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "20px",
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              {trendingFilter === "views" ? <FaEye /> : <FaComment />}
              <span>
                {trendingFilter === "views"
                  ? plant.view_count || 0
                  : plant.comment_count || 0}
              </span>
            </div>
          )}
        </div>
        <div className="plant-content">
          <span className="plant-category">{catName}</span>
          {/* Thêm title={plant.name} ở đây để hiện tooltip khi hover */}
          <h4 className="plant-title" title={plant.name}>{plant.name}</h4>
          <div className="plant-price">
            {Number(plant.price).toLocaleString()} ₫
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlantCard;
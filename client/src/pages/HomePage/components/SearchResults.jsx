import React from "react";
import { Link } from "react-router-dom";
import PlantCard from "./PlantCard";

const SearchResults = ({
  filteredPlants,
  loading,
  t,
  getResultTitle,
  categories,
  isShowAll,
  layoutIdParam,
  isFeatured,
}) => {
  return (
    <div className="container section">
      <div className="section-header">
        <h2 className="section-title">{getResultTitle()}</h2>
        <p className="section-desc">
          Tìm thấy {filteredPlants.length} kết quả phù hợp
        </p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Đang tải dữ liệu...</p>
      ) : filteredPlants.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
          <p>{t("home.no_plants")}</p>
        </div>
      ) : (
        <div className="plant-grid">
          {filteredPlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} categories={categories} />
          ))}
        </div>
      )}

      {(isShowAll || layoutIdParam || isFeatured) && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link to="/" className="btn btn-outline">
            Quay lại trang chủ
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
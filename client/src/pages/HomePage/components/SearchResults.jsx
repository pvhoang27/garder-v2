import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PlantCard from "./PlantCard";
import { API_URL } from "../../../config";

const SearchResults = ({
  filteredPlants,
  filteredNews = [], // Nhận thêm tin tức đã lọc
  loading,
  t,
  getResultTitle,
  categories,
  isShowAll,
  layoutIdParam,
  isFeatured,
}) => {
  const navigate = useNavigate();

  // Hàm helper để xử lý URL ảnh tin tức
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x200?text=No+Image";
    return imagePath.startsWith("http") ? imagePath : `${API_URL}${imagePath}`;
  };

  const totalResults = filteredPlants.length + filteredNews.length;

  return (
    <div className="container section">
      <div className="section-header">
        <h2 className="section-title">{getResultTitle()}</h2>
        <p className="section-desc">
          Tìm thấy {totalResults} kết quả phù hợp
        </p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Đang tải dữ liệu...</p>
      ) : totalResults === 0 ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
          <p>{t("home.no_plants") || "Không tìm thấy kết quả nào"}</p>
        </div>
      ) : (
        <>
          {/* Hiển thị kết quả tìm kiếm Cây cảnh */}
          {filteredPlants.length > 0 && (
            <div style={{ marginBottom: filteredNews.length > 0 ? "50px" : "0" }}>
              {filteredNews.length > 0 && (
                <h3 style={{ marginBottom: "20px", fontSize: "24px", color: "#2c3e50" }}>Cây cảnh</h3>
              )}
              <div className="plant-grid">
                {filteredPlants.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} categories={categories} />
                ))}
              </div>
            </div>
          )}

          {/* Hiển thị kết quả tìm kiếm Tin tức */}
          {filteredNews.length > 0 && (
            <div>
              <h3 style={{ marginBottom: "20px", fontSize: "24px", color: "#2c3e50" }}>Tin tức</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {filteredNews.map((news) => (
                  <div 
                    key={news.id} 
                    style={{ 
                      backgroundColor: "#fff", 
                      borderRadius: "12px", 
                      overflow: "hidden", 
                      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                      cursor: "pointer",
                      transition: "transform 0.3s ease",
                      border: "1px solid #eee"
                    }}
                    onClick={() => navigate(`/news/${news.id}`)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <img 
                      src={getImageUrl(news.image)} 
                      alt={news.title} 
                      style={{ width: "100%", height: "200px", objectFit: "cover" }} 
                    />
                    <div style={{ padding: "20px" }}>
                      <span style={{ fontSize: "12px", color: "#888", marginBottom: "8px", display: "block" }}>
                        {new Date(news.created_at).toLocaleDateString("vi-VN")}
                      </span>
                      <h4 style={{ margin: "0 0 10px 0", fontSize: "18px", color: "#2c3e50", lineHeight: "1.4" }}>
                        {news.title}
                      </h4>
                      <p style={{ margin: "0", fontSize: "14px", color: "#666", lineHeight: "1.6", display: "-webkit-box", WebkitLineClamp: "3", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {news.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
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
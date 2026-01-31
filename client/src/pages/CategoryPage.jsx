import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import { FaArrowRight, FaLeaf } from "react-icons/fa";
import "./CategoryPage.css"; // Import file CSS mới tạo

// Đường dẫn gốc chứa ảnh trên server
const IMAGE_BASE_URL = "http://localhost:3000/uploads/";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosClient.get("/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Đang tải danh mục...</p>
      </div>
    );
  }

  return (
    <div className="category-page-container">
      {/* Header Section - Giống repo phụ */}
      <section className="category-header-section">
        <div className="category-header-content">
          <h1 className="category-title">
            Danh mục cây cảnh
          </h1>
          <p className="category-subtitle">
            Khám phá bộ sưu tập phong phú với nhiều loại cây cảnh được phân loại 
            theo đặc tính và ý nghĩa riêng biệt, giúp bạn dễ dàng tìm thấy màu xanh phù hợp cho không gian sống.
          </p>
        </div>
      </section>

      {/* Grid Section - Hiển thị danh sách categories */}
      <section className="category-content-section">
        <div className="category-grid-container">
          {categories.length > 0 ? (
            <div className="category-grid">
              {categories.map((cat) => (
                <div key={cat.id} className="category-item">
                  {/* Card với hiệu ứng hình ảnh và gradient */}
                  <Link 
                    to={`/?category_id=${cat.id}`} 
                    className="category-card"
                  >
                    {/* Phần Ảnh */}
                    <div className="category-img-wrapper">
                      {cat.image ? (
                        <img
                          src={`${IMAGE_BASE_URL}${cat.image}`}
                          alt={cat.name}
                          className="category-img"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      
                      {/* Placeholder nếu ảnh lỗi hoặc không có */}
                      <div 
                        className="image-placeholder"
                        style={{ display: cat.image ? "none" : "flex" }}
                      >
                         <FaLeaf size={40} />
                      </div>
                    </div>

                    {/* Lớp phủ Gradient tối màu ở dưới chân ảnh */}
                    <div className="category-overlay" />

                    {/* Nội dung đè lên ảnh (Tên + Mũi tên) */}
                    <div className="category-card-content">
                      <div className="category-info">
                        <h3>{cat.name}</h3>
                        <p>Xem chi tiết</p> 
                      </div>
                      <div className="category-icon-wrapper">
                        <FaArrowRight className="category-arrow-icon" />
                      </div>
                    </div>
                  </Link>

                  {/* Phần mô tả nằm dưới Card */}
                  <p className="category-desc-text">
                    {cat.description || "Một lựa chọn tuyệt vời cho không gian xanh của bạn."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-container">
              <FaLeaf size={40} style={{ marginBottom: "1rem", opacity: 0.5 }} />
              <p>Chưa có danh mục nào được tạo.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
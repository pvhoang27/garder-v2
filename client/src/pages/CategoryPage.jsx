import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import { FaLeaf, FaArrowRight } from "react-icons/fa";

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
      <div className="container" style={{ padding: "50px", textAlign: "center" }}>
        <p>Đang tải danh mục...</p>
      </div>
    );
  }

  return (
    <div className="category-page" style={{ background: "#f9f9f9", minHeight: "100vh", paddingBottom: "50px" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
          padding: "60px 20px",
          textAlign: "center",
          color: "white",
          marginBottom: "40px",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", fontWeight: "bold" }}>
          Khám Phá Các Loại Cây
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
          Tìm kiếm loại cây phù hợp với không gian của bạn
        </p>
      </div>

      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "30px",
            padding: "0 20px",
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                background: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
              className="category-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
              }}
            >
              {/* Phần Ảnh Danh Mục */}
              <div style={{ height: "200px", overflow: "hidden", background: "#eee", position: "relative" }}>
                {cat.image ? (
                  <img
                    src={`${IMAGE_BASE_URL}${cat.image}`}
                    alt={cat.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                    onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                    onError={(e) => {
                        e.target.style.display = 'none'; // Ẩn ảnh lỗi
                        e.target.nextSibling.style.display = 'flex'; // Hiện placeholder
                    }}
                  />
                ) : null}
                
                {/* Placeholder khi không có ảnh hoặc ảnh lỗi */}
                <div 
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: cat.image ? "none" : "flex", // Chỉ hiện khi ko có image
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#e8f5e9",
                        color: "#2e7d32",
                        flexDirection: "column"
                    }}
                >
                    <FaLeaf size={50} />
                </div>
              </div>

              {/* Phần Nội Dung */}
              <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ margin: "0 0 10px", color: "#2e7d32", fontSize: "1.4rem" }}>
                  {cat.name}
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                    marginBottom: "20px",
                    flex: 1,
                  }}
                >
                  {cat.description || "Danh mục các loại cây xanh tuyệt đẹp dành cho bạn."}
                </p>

                <Link
                  to={`/?category_id=${cat.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#2e7d32",
                    fontWeight: "bold",
                    textDecoration: "none",
                    alignSelf: "flex-start",
                    padding: "8px 0",
                    borderBottom: "2px solid transparent",
                    transition: "border-color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.borderBottom = "2px solid #2e7d32")}
                  onMouseLeave={(e) => (e.target.style.borderBottom = "2px solid transparent")}
                >
                  Xem cây thuộc loại này <FaArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && !loading && (
          <div style={{ textAlign: "center", marginTop: "50px", color: "#777" }}>
            <FaLeaf size={40} style={{ marginBottom: "15px", opacity: 0.5 }} />
            <p>Chưa có danh mục nào được tạo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
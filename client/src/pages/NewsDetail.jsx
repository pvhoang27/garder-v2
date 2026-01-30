import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const res = await axiosClient.get(`/news/${id}`);
        setNews(res.data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết tin tức:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [id]);

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Đang tải...</div>;
  if (!news) return <div style={{ textAlign: "center", marginTop: "50px" }}>Không tìm thấy bài viết!</div>;

  return (
    <div className="container" style={{ marginTop: "30px", maxWidth: "800px", paddingBottom: "50px" }}>
      {/* Nút Quay lại */}
      <button 
        onClick={() => navigate("/news")}
        style={{
          background: "transparent",
          border: "none",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          cursor: "pointer",
          color: "#666",
          fontSize: "1rem",
          marginBottom: "20px"
        }}
      >
        <FaArrowLeft /> Quay lại tin tức
      </button>

      <article style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <h1 style={{ color: "#2e7d32", fontSize: "2rem", marginBottom: "15px" }}>{news.title}</h1>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#888", marginBottom: "20px", fontSize: "0.9rem" }}>
          <FaCalendarAlt />
          <span>{new Date(news.created_at).toLocaleDateString('vi-VN')}</span>
        </div>

        {/* Ảnh bìa lớn */}
        {news.image && (
          <div style={{ marginBottom: "30px", borderRadius: "8px", overflow: "hidden" }}>
            <img 
              src={news.image.startsWith('http') ? news.image : `http://localhost:3000${news.image}`} 
              alt={news.title}
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Tóm tắt (in đậm) */}
        <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "20px", color: "#444", borderLeft: "4px solid #2e7d32", paddingLeft: "15px" }}>
          {news.summary}
        </div>

        {/* Nội dung chi tiết */}
        <div style={{ 
          fontSize: "1rem", 
          lineHeight: "1.8", 
          color: "#333",
          whiteSpace: "pre-wrap" // Giữ nguyên định dạng xuống dòng của văn bản
        }}>
          {news.content}
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;
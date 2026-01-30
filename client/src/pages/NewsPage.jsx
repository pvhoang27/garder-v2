import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axiosClient from "../api/axiosClient";

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axiosClient.get("/news");
        setNewsList(res.data);
      } catch (error) {
        console.error("Lỗi tải tin tức:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="container" style={{ marginTop: "30px", paddingBottom: "50px" }}>
      <h1 style={{ textAlign: "center", color: "#2e7d32", marginBottom: "10px" }}>
        Tin Tức & Kiến Thức Cây Cảnh
      </h1>
      <p style={{ textAlign: "center", marginBottom: "40px", color: "#666" }}>
        Chia sẻ kinh nghiệm chăm sóc và xu hướng mới nhất từ Green Garden
      </p>

      {loading ? (
        <p style={{ textAlign: "center" }}>Đang tải tin tức...</p>
      ) : (
        <div className="news-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "30px"
        }}>
          {newsList.map((news) => (
            <div key={news.id} className="news-card" style={{
              background: "white",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.3s"
            }}>
              <div 
                style={{ height: "200px", overflow: "hidden", cursor: "pointer" }}
                onClick={() => navigate(`/news/${news.id}`)} 
              >
                <img 
                  src={news.image ? (news.image.startsWith('http') ? news.image : `http://localhost:3000${news.image}`) : 'https://via.placeholder.com/300x200?text=No+Image'} 
                  alt={news.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "0.3s" }}
                  onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                />
              </div>
              <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.85rem", color: "#999", marginBottom: "5px" }}>
                    {new Date(news.created_at).toLocaleDateString('vi-VN')}
                </span>
                
                <h3 
                    style={{ margin: "0 0 10px 0", fontSize: "1.2rem", color: "#333", cursor: "pointer" }}
                    onClick={() => navigate(`/news/${news.id}`)}
                >
                    {news.title}
                </h3>
                
                <p style={{ color: "#555", fontSize: "0.95rem", lineHeight: "1.5", flex: 1 }}>
                  {news.summary}
                </p>
                <button style={{
                  marginTop: "15px",
                  background: "transparent",
                  border: "1px solid #2e7d32",
                  color: "#2e7d32",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  alignSelf: "flex-start"
                }}
                onClick={() => navigate(`/news/${news.id}`)} 
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && newsList.length === 0 && <p style={{textAlign:'center'}}>Chưa có tin tức nào.</p>}
    </div>
  );
};

export default NewsPage;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "./NewsPage.css";
import { API_URL } from "../config";

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

  // Hàm helper để xử lý URL ảnh
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x200?text=No+Image";
    return imagePath.startsWith("http") ? imagePath : `${API_URL}${imagePath}`;
  };

  return (
    <div className="news-page-container">
      <div className="news-header">
        <h1 className="news-title">Tin Tức & Kiến Thức</h1>
        <p className="news-subtitle">
          Khám phá những kinh nghiệm chăm sóc cây cảnh hữu ích và cập nhật những
          xu hướng không gian xanh mới nhất từ Green Garden.
        </p>
      </div>

      {loading ? (
        <div className="loading-state">Đang tải tin tức...</div>
      ) : (
        <>
          <div className="news-grid">
            {newsList.map((news) => (
              <div key={news.id} className="news-card">
                <div
                  className="news-image-wrapper"
                  onClick={() => navigate(`/news/${news.id}`)}
                >
                  <img
                    src={getImageUrl(news.image)}
                    alt={news.title}
                    className="news-image"
                  />
                </div>

                <div className="news-content">
                  <span className="news-date">
                    {new Date(news.created_at).toLocaleDateString("vi-VN")}
                  </span>

                  <h3
                    className="news-item-title"
                    onClick={() => navigate(`/news/${news.id}`)}
                  >
                    {news.title}
                  </h3>

                  <p className="news-summary">{news.summary}</p>

                  <button
                    className="read-more-btn"
                    onClick={() => navigate(`/news/${news.id}`)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>

          {newsList.length === 0 && (
            <div className="empty-state">
              Chưa có bài viết nào được đăng tải.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsPage;

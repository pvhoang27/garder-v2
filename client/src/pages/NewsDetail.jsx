import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import CommentSection from "../components/CommentSection";
import "./NewsDetail.css";
import { API_URL } from "../config";

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

  if (loading)
    return <div className="loading-message">Đang tải bài viết...</div>;
  if (!news)
    return <div className="error-message">Không tìm thấy bài viết!</div>;

  const imageUrl = news.image
    ? news.image.startsWith("http")
      ? news.image
      : `${API_URL}${news.image}`
    : null;

  return (
    <div className="news-detail-container">
      {/* Nút Quay lại */}
      <button onClick={() => navigate("/news")} className="back-btn">
        <FaArrowLeft /> Quay lại danh sách
      </button>

      <article className="article-content">
        <h1 className="article-title">{news.title}</h1>

        <div className="article-meta">
          <FaCalendarAlt />
          <span>{new Date(news.created_at).toLocaleDateString("vi-VN")}</span>
          {/* Có thể thêm Tác giả nếu API trả về */}
        </div>

        {/* Ảnh bìa */}
        {imageUrl && (
          <img src={imageUrl} alt={news.title} className="article-hero-image" />
        )}

        {/* Tóm tắt nổi bật */}
        {news.summary && <div className="article-summary">{news.summary}</div>}

        {/* Nội dung chi tiết */}
        <div className="article-body">{news.content}</div>
      </article>

      {/* --- PHẦN BÌNH LUẬN --- */}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <CommentSection entityType="news" entityId={news.id} />
      </div>
    </div>
  );
};

export default NewsDetail;

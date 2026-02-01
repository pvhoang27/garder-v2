import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

// Components
import PlantGallery from "../components/PlantGallery";
import PlantInfo from "../components/PlantInfo";
import CommentSection from "../components/CommentSection"; // Import Component Bình luận

// Styles
import "./PlantDetail.css";

const PlantDetail = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const BE_URL = "http://localhost:3000";

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/plants/${id}`)
      .then((res) => {
        setPlant(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải chi tiết cây:", err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="container plant-detail-page">Đang tải dữ liệu...</div>
    );
  if (error || !plant)
    return (
      <div className="container plant-detail-page" style={{ color: "red" }}>
        Không tìm thấy sản phẩm!
      </div>
    );

  // --- LOGIC CHUẨN BỊ DỮ LIỆU MEDIA CHO SLIDER ---
  const isVideo = (url) => {
    if (!url) return false;
    return ["mp4", "mov", "avi", "webm", "mkv"].includes(
      url.split(".").pop().toLowerCase(),
    );
  };

  const slides = [];
  if (plant.thumbnail) slides.push({ type: "image", url: plant.thumbnail });
  if (plant.media && Array.isArray(plant.media)) {
    plant.media.forEach((item) => {
      if (item.image_url) {
        slides.push({
          type: isVideo(item.image_url) ? "video" : "image",
          url: item.image_url,
        });
      }
    });
  }

  return (
    <div className="container plant-detail-page">
      <Link to="/" className="back-link">
        &larr; Quay lại trang chủ
      </Link>

      <div className="detail-container">
        {/* CỘT TRÁI: ẢNH & VIDEO */}
        <div className="detail-left">
          <PlantGallery slides={slides} BE_URL={BE_URL} />
        </div>

        {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
        <PlantInfo plant={plant} />
      </div>

      {/* --- PHẦN BÌNH LUẬN --- */}
      <CommentSection entityType="plant" entityId={plant.id} />
    </div>
  );
};

export default PlantDetail;
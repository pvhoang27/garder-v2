import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { Swiper, SwiperSlide } from "swiper/react";

// Import các file CSS của Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade"; // <-- Thêm CSS hiệu ứng Fade

// Import các modules cần thiết
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules"; // <-- Thêm EffectFade và Autoplay

const PlantDetail = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      <div className="container" style={{ marginTop: "30px" }}>
        Đang tải dữ liệu...
      </div>
    );
  if (error || !plant)
    return (
      <div className="container" style={{ marginTop: "30px", color: "red" }}>
        Không tìm thấy sản phẩm hoặc lỗi kết nối!
      </div>
    );

  // TÁCH RIÊNG ẢNH VÀ VIDEO
  const isVideo = (url) => {
    if (!url) return false;
    // Kiểm tra đuôi file video phổ biến
    return ["mp4", "mov", "avi", "webm", "mkv"].includes(
      url.split(".").pop().toLowerCase(),
    );
  };

  // Danh sách ảnh (Gộp Thumbnail + Ảnh trong Album)
  const images = [];
  // Ưu tiên ảnh thumbnail đưa lên đầu
  if (plant.thumbnail) {
    images.push({ image_url: plant.thumbnail });
  }

  // Lọc ảnh từ album
  if (plant.media && Array.isArray(plant.media)) {
    const albumImages = plant.media.filter(
      (item) => item.image_url && !isVideo(item.image_url),
    );
    images.push(...albumImages);
  }

  // Danh sách Video (Lọc từ album)
  const videos =
    plant.media && Array.isArray(plant.media)
      ? plant.media.filter((item) => item.image_url && isVideo(item.image_url))
      : [];

  // Base URL của server (để load ảnh)
  const BE_URL = "http://localhost:3000";

  return (
    <div
      className="container"
      style={{ marginTop: "30px", paddingBottom: "50px" }}
    >
      <Link
        to="/"
        style={{ color: "#666", display: "inline-block", marginBottom: "15px" }}
      >
        &larr; Quay lại trang chủ
      </Link>

      <div className="detail-container">
        {/* CỘT TRÁI: CHỈ HIỆN ẢNH (SLIDER) */}
        <div className="detail-left" style={{ minWidth: 0 }}>
          {" "}
          {/* Fix lỗi Swiper bị tràn trên flexbox */}
          {images.length > 0 ? (
            <Swiper
              // Cấu hình các modules sử dụng
              modules={[Navigation, Pagination, EffectFade, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              // Thêm hiệu ứng Fade
              effect={"fade"}
              fadeEffect={{ crossFade: true }} // Giúp ảnh không bị chồng chéo
              speed={600} // Tốc độ chuyển ảnh (ms)
              autoplay={{
                delay: 3000, // Tự động chuyển sau 3 giây
                disableOnInteraction: false,
              }}
              style={{ borderRadius: "10px", overflow: "hidden" }}
              spaceBetween={10}
            >
              {images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`${BE_URL}${img.image_url}`}
                    style={{
                      width: "100%",
                      height: "450px",
                      objectFit: "cover",
                      display: "block",
                    }}
                    alt={plant.name}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/450?text=No+Image";
                    }} // Fallback nếu ảnh lỗi
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div
              style={{
                height: "450px",
                background: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                color: "#888",
              }}
            >
              Chưa có hình ảnh
            </div>
          )}
        </div>

        {/* CỘT PHẢI: THÔNG TIN */}
        <div className="detail-right">
          {plant.category_name && (
            <span className="badge">{plant.category_name}</span>
          )}

          <h1 className="detail-title">{plant.name}</h1>

          <div style={{ marginBottom: "15px", color: "#555" }}>
            <p style={{ marginBottom: "5px" }}>
              <strong>Tên khoa học:</strong>{" "}
              {plant.scientific_name || "Đang cập nhật"}
            </p>
            <p>
              <strong>Tuổi đời:</strong>{" "}
              {plant.age ? `${plant.age} năm` : "Chưa rõ"}
            </p>
          </div>

          <div className="section-title">📖 Giới thiệu</div>
          <div
            style={{ lineHeight: "1.6", color: "#444" }}
            dangerouslySetInnerHTML={{
              __html: plant.description || "<p>Chưa có mô tả.</p>",
            }}
          />

          <div className="section-title" style={{ marginTop: "25px" }}>
            💧 Cách chăm sóc
          </div>
          <div
            style={{
              background: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px",
              borderLeft: "5px solid #2e7d32",
              fontStyle: "italic",
              color: "#333",
            }}
          >
            {plant.care_instruction || "Chưa có hướng dẫn chăm sóc."}
          </div>
        </div>
      </div>

      {/* PHẦN DƯỚI: KHU VỰC VIDEO RIÊNG BIỆT */}
      {videos.length > 0 && (
        <div
          style={{
            marginTop: "50px",
            borderTop: "1px solid #eee",
            paddingTop: "30px",
          }}
        >
          <h2
            style={{
              color: "#2e7d32",
              textAlign: "center",
              marginBottom: "30px",
              textTransform: "uppercase",
            }}
          >
            🎬 Video thực tế tại vườn
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "25px",
            }}
          >
            {videos.map((vid, index) => (
              <div
                key={index}
                style={{
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#000",
                }}
              >
                <video
                  controls
                  preload="metadata"
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "contain", // Dùng contain để video không bị cắt
                    display: "block",
                  }}
                >
                  <source src={`${BE_URL}${vid.image_url}`} />
                  Trình duyệt của bạn không hỗ trợ thẻ video.
                </video>
                <div
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#fff",
                    background: "#222",
                  }}
                >
                  Video #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantDetail;

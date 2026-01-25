import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { Swiper, SwiperSlide } from "swiper/react";

// Import các file CSS của Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Import các modules cần thiết
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";

const PlantDetail = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Base URL của server (để load ảnh/video)
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

  // Hàm kiểm tra định dạng video
  const isVideo = (url) => {
    if (!url) return false;
    return ["mp4", "mov", "avi", "webm", "mkv"].includes(
      url.split(".").pop().toLowerCase(),
    );
  };

  // GỘP CHUNG ẢNH VÀ VIDEO VÀO MỘT DANH SÁCH SLIDES
  const slides = [];

  // 1. Ưu tiên ảnh thumbnail đưa lên đầu
  if (plant.thumbnail) {
    slides.push({ type: "image", url: plant.thumbnail });
  }

  // 2. Lấy dữ liệu từ album (cả ảnh và video)
  if (plant.media && Array.isArray(plant.media)) {
    plant.media.forEach((item) => {
      if (item.image_url) {
        if (isVideo(item.image_url)) {
          slides.push({ type: "video", url: item.image_url });
        } else {
          slides.push({ type: "image", url: item.image_url });
        }
      }
    });
  }

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
        {/* CỘT TRÁI: SLIDER CHỨA CẢ ẢNH VÀ VIDEO */}
        <div className="detail-left" style={{ minWidth: 0 }}>
          {slides.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, EffectFade, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              effect={"fade"}
              fadeEffect={{ crossFade: true }}
              speed={600}
              autoplay={{
                delay: 5000, // Tăng thời gian delay lên xíu để người dùng kịp xem nếu là video
                disableOnInteraction: true, // Nên để true để khi user click xem video thì không tự trượt đi nữa
              }}
              style={{ borderRadius: "10px", overflow: "hidden" }}
              spaceBetween={10}
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  {slide.type === "video" ? (
                    // RENDER VIDEO
                    <video
                      controls
                      style={{
                        width: "100%",
                        height: "450px", // Chiều cao cố định giống ảnh
                        objectFit: "contain", // Giữ tỉ lệ video, phần dư sẽ đen
                        display: "block",
                        backgroundColor: "#000",
                      }}
                    >
                      <source src={`${BE_URL}${slide.url}`} />
                      Trình duyệt không hỗ trợ thẻ video.
                    </video>
                  ) : (
                    // RENDER ẢNH
                    <img
                      src={`${BE_URL}${slide.url}`}
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
                      }}
                    />
                  )}
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
              Chưa có hình ảnh/video
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
    </div>
  );
};

export default PlantDetail;

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";

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
      <div className="container" style={{ marginTop: "30px" }}>
        Đang tải dữ liệu...
      </div>
    );
  if (error || !plant)
    return (
      <div className="container" style={{ marginTop: "30px", color: "red" }}>
        Không tìm thấy sản phẩm!
      </div>
    );

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
        {/* SLIDER */}
        <div className="detail-left" style={{ minWidth: 0 }}>
          {slides.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, EffectFade, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              effect={"fade"}
              fadeEffect={{ crossFade: true }}
              speed={600}
              autoplay={{ delay: 5000, disableOnInteraction: true }}
              style={{ borderRadius: "10px", overflow: "hidden" }}
              spaceBetween={10}
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  {slide.type === "video" ? (
                    <video
                      controls
                      style={{
                        width: "100%",
                        height: "450px",
                        objectFit: "contain",
                        backgroundColor: "#000",
                      }}
                    >
                      <source src={`${BE_URL}${slide.url}`} />
                    </video>
                  ) : (
                    <img
                      src={`${BE_URL}${slide.url}`}
                      style={{
                        width: "100%",
                        height: "450px",
                        objectFit: "cover",
                      }}
                      alt={plant.name}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/450?text=No+Image")
                      }
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

        {/* THÔNG TIN CHI TIẾT */}
        <div className="detail-right">
          {plant.category_name && (
            <span className="badge">{plant.category_name}</span>
          )}
          <h1 className="detail-title">{plant.name}</h1>
          
          {/* HIỂN THỊ GIÁ */}
          <div style={{ fontSize: "1.5rem", color: "#d32f2f", fontWeight: "bold", margin: "10px 0" }}>
            {plant.price ? Number(plant.price).toLocaleString() : "Liên hệ"} VNĐ
          </div>

          <div style={{ marginBottom: "20px", color: "#555" }}>
            <p style={{ marginBottom: "5px" }}>
              <strong>Tên khoa học:</strong>{" "}
              {plant.scientific_name || "Đang cập nhật"}
            </p>
            <p>
              <strong>Tuổi đời:</strong>{" "}
              {plant.age ? `${plant.age} năm` : "Chưa rõ"}
            </p>
          </div>

          {/* --- HIỂN THỊ THUỘC TÍNH ĐỘNG --- */}
          {plant.attributes && plant.attributes.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  margin: "0 0 10px 0",
                  color: "#2e7d32",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "5px",
                }}
              >
                Thông số chi tiết
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  fontSize: "0.95rem",
                }}
              >
                {plant.attributes.map((attr, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#f5f5f5",
                      padding: "8px 12px",
                      borderRadius: "5px",
                    }}
                  >
                    <span style={{ fontWeight: "bold", color: "#444" }}>
                      {attr.attr_key}:
                    </span>
                    <span style={{ marginLeft: "5px", color: "#666" }}>
                      {attr.attr_value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
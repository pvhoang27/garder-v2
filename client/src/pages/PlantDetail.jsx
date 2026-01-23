import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const PlantDetail = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  // Hàm tách ID Youtube từ link
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  useEffect(() => {
    axiosClient.get(`/plants/${id}`).then((res) => setPlant(res.data));
  }, [id]);

  if (!plant) return <div className="container">Đang tải...</div>;

  return (
    <div className="container" style={{ marginTop: "30px" }}>
      <Link
        to="/"
        style={{ display: "inline-block", marginBottom: "20px", color: "#666" }}
      >
        &larr; Quay lại
      </Link>

      <div className="detail-container">
        {/* TRÁI: SLIDER ẢNH (SWIPER) */}
        <div className="detail-left" style={{ overflow: "hidden" }}>
          {" "}
          {/* overflow hidden để slider ko bị tràn */}
          {plant.images && plant.images.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              style={{ borderRadius: "10px" }}
            >
              {plant.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`http://localhost:3000${img.image_url}`}
                    alt={plant.name}
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      window.open(
                        `http://localhost:3000${img.image_url}`,
                        "_blank",
                      )
                    } // Click để Zoom (Mở tab mới)
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              src="https://via.placeholder.com/500"
              style={{ width: "100%", borderRadius: "10px" }}
            />
          )}
        </div>

        {/* PHẢI: THÔNG TIN */}
        <div className="detail-right">
          <span className="badge">{plant.category_name}</span>
          <h1 className="detail-title">{plant.name}</h1>

          <div
            style={{ color: "#555", marginBottom: "20px", fontSize: "0.95rem" }}
          >
            <p>
              <strong>🌱 Tên khoa học:</strong>{" "}
              {plant.scientific_name || "Đang cập nhật"}
            </p>
            <p>
              <strong>🗓 Tuổi đời:</strong> {plant.age || "Chưa rõ"}
            </p>
          </div>

          <div className="section-title">📖 Giới thiệu</div>
          {/* Render HTML từ Rich Text Editor */}
          <div
            dangerouslySetInnerHTML={{ __html: plant.description }}
            style={{ lineHeight: "1.6" }}
          />

          <div className="section-title" style={{ marginTop: "20px" }}>
            💧 Cách chăm sóc
          </div>
          <div
            style={{
              background: "#f9f9f9",
              padding: "15px",
              borderRadius: "5px",
              borderLeft: "4px solid #2e7d32",
            }}
          >
            {plant.care_instruction}
          </div>

          {/* VIDEO EMBED */}
          {plant.video_url && (
            <div style={{ marginTop: "30px" }}>
              <div className="section-title">🎬 Video thực tế</div>

              {/* Khung Video Responsive */}
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  borderRadius: "10px",
                  marginTop: "10px",
                }}
              >
                {getYouTubeId(plant.video_url) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(plant.video_url)}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  ></iframe>
                ) : (
                  <p>Link video không đúng định dạng YouTube.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;

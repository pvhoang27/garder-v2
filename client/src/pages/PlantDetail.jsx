import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const PlantDetail = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    axiosClient.get(`/plants/${id}`).then((res) => setPlant(res.data));
  }, [id]);

  if (!plant) return <div className="container">Đang tải...</div>;

  // TÁCH RIÊNG ẢNH VÀ VIDEO
  const isVideo = (url) => {
    if (!url) return false;
    return ["mp4", "mov", "avi", "webm"].includes(
      url.split(".").pop().toLowerCase(),
    );
  };

  // Danh sách ảnh (Gộp Thumbnail + Ảnh trong Album)
  const images = [];
  if (plant.thumbnail) images.push({ image_url: plant.thumbnail });
  if (plant.media) {
    const albumImages = plant.media.filter((item) => !isVideo(item.image_url));
    images.push(...albumImages);
  }

  // Danh sách Video (Lọc từ album)
  const videos = plant.media
    ? plant.media.filter((item) => isVideo(item.image_url))
    : [];

  return (
    <div className="container" style={{ marginTop: "30px" }}>
      <Link to="/" style={{ color: "#666" }}>
        &larr; Quay lại
      </Link>

      <div className="detail-container">
        {/* CỘT TRÁI: CHỈ HIỆN ẢNH (SLIDER) */}
        <div className="detail-left">
          {images.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              style={{ borderRadius: "10px" }}
            >
              {images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`http://localhost:3000${img.image_url}`}
                    style={{
                      width: "100%",
                      height: "450px",
                      objectFit: "cover",
                    }}
                    alt="Plant"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div
              style={{
                height: "450px",
                background: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Chưa có ảnh
            </div>
          )}
        </div>

        {/* CỘT PHẢI: THÔNG TIN */}
        <div className="detail-right">
          <span className="badge">{plant.category_name}</span>
          <h1 className="detail-title">{plant.name}</h1>
          <p>
            <strong>Khoa học:</strong> {plant.scientific_name}
          </p>
          <p>
            <strong>Tuổi đời:</strong> {plant.age}
          </p>

          <div className="section-title">📖 Giới thiệu</div>
          <div dangerouslySetInnerHTML={{ __html: plant.description }} />

          <div className="section-title" style={{ marginTop: "20px" }}>
            💧 Cách chăm sóc
          </div>
          <div
            style={{
              background: "#f9f9f9",
              padding: "15px",
              borderLeft: "4px solid #2e7d32",
            }}
          >
            {plant.care_instruction}
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
            }}
          >
            🎬 VIDEO THỰC TẾ TẠI VƯỜN
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {videos.map((vid, index) => (
              <div
                key={index}
                style={{
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <video
                  controls
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    background: "black",
                  }}
                >
                  <source
                    src={`http://localhost:3000${vid.image_url}`}
                    type="video/mp4"
                  />
                </video>
                <div
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#555",
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

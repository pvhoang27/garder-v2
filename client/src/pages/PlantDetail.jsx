import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { API_URL } from "../config";

// Components
import PlantGallery from "../components/PlantGallery";
import PlantInfo from "../components/PlantInfo";
import CommentSection from "../components/CommentSection";

// Styles
import "./PlantDetail.css";

const PlantDetail = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const BE_URL = API_URL;

  // Ref lưu thời điểm bắt đầu xem
  const startTimeRef = useRef(null);

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

  // --- LOGIC LƯU LỊCH SỬ XEM GẦN ĐÂY ---
  useEffect(() => {
    if (plant) {
      const viewedItems = JSON.parse(
        localStorage.getItem("recently_viewed") || "[]",
      );

      const newItem = {
        id: plant.id,
        name: plant.name,
        thumbnail: plant.thumbnail,
        price: plant.price,
        category_id: plant.category_id,
        view_count: plant.view_count,
      };

      const filteredItems = viewedItems.filter((item) => item.id !== plant.id);
      filteredItems.unshift(newItem);
      const finalItems = filteredItems.slice(0, 8);
      localStorage.setItem("recently_viewed", JSON.stringify(finalItems));
    }
  }, [plant]);

  // --- LOGIC TRACKING THỜI GIAN XEM (MỚI THÊM) ---
  useEffect(() => {
    if (plant) {
      // Ghi nhận mốc thời gian bắt đầu
      startTimeRef.current = Date.now();

      // Hàm tính toán và gửi dữ liệu
      const trackTimeSpent = () => {
        if (startTimeRef.current) {
          const durationSeconds = Math.floor(
            (Date.now() - startTimeRef.current) / 1000
          );

          // Chỉ gửi nếu xem lớn hơn 1 giây để tránh spam
          if (durationSeconds > 0) {
            axiosClient
              .post("/tracking-plant/log", {
                plant_id: plant.id,
                duration_seconds: durationSeconds,
              })
              .catch((err) => console.log("Lỗi gửi tracking thời gian:", err));
          }
        }
      };

      // Bắt sự kiện người dùng đóng tab / reload trình duyệt
      window.addEventListener("beforeunload", trackTimeSpent);

      // Cleanup function chạy khi người dùng chuyển sang trang khác
      return () => {
        trackTimeSpent();
        window.removeEventListener("beforeunload", trackTimeSpent);
      };
    }
  }, [plant]);

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
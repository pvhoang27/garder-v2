import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { API_URL } from "../config";

const PopupBanner = () => {
  const [popups, setPopups] = useState([]);

  useEffect(() => {
    // FIX: Sửa endpoint thành /popups (số nhiều) để khớp với Server
    axiosClient
      .get("/popups")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          // Lọc các popup đã bị đóng trong session
          const activePopups = res.data.filter(
            (p) => !sessionStorage.getItem(`popup_closed_${p.id}`),
          );
          if (activePopups.length > 0) {
            setTimeout(() => setPopups(activePopups), 1000);
          }
        }
      })
      .catch((err) => console.error("Lỗi tải popup:", err));
  }, []);

  const handleClose = (id) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
    sessionStorage.setItem(`popup_closed_${id}`, "true");
  };

  if (popups.length === 0) return null;

  return (
    <>
      <style>{`
        .popup-banner { position: fixed; z-index: 1000; background: white; box-shadow: 0 5px 20px rgba(0,0,0,0.3); border-radius: 8px; overflow: hidden; animation: popupFadeIn 0.5s ease-out; display: flex; flex-direction: column; }
        @keyframes popupFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        /* Vị trí */
        .popup-pos-center { top: 50%; left: 50%; transform: translate(-50%, -50%); animation: popupZoomIn 0.5s; }
        .popup-pos-bottom-right { bottom: 20px; right: 20px; }
        .popup-pos-bottom-left { bottom: 20px; left: 20px; }
        .popup-pos-top-right { top: 20px; right: 20px; }
        .popup-pos-top-left { top: 20px; left: 20px; }
        .popup-pos-top-center { top: 20px; left: 50%; transform: translateX(-50%); }
        .popup-pos-bottom-center { bottom: 20px; left: 50%; transform: translateX(-50%); }
        
        .media-container { position: relative; width: 100%; height: 100%; flex: 1; background: #000; display:flex; align-items:center; justify-content:center;}
        .media-nav-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 10px; cursor: pointer; border-radius: 50%; transition: 0.2s; }
        .media-nav-btn:hover { background: rgba(0,0,0,0.8); }
        .media-prev { left: 10px; }
        .media-next { right: 10px; }
      `}</style>

      {popups.map((popup) => (
        <SinglePopup
          key={popup.id}
          popup={popup}
          onClose={() => handleClose(popup.id)}
        />
      ))}
    </>
  );
};

// Component con hiển thị nội dung từng popup
const SinglePopup = ({ popup, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Parse list media
  let mediaList = [];
  try {
    mediaList = JSON.parse(popup.media_urls || "[]");
  } catch (e) {
    mediaList = popup.image_url ? [popup.image_url] : [];
  }

  const nextSlide = () =>
    setCurrentMediaIndex((prev) => (prev + 1) % mediaList.length);
  const prevSlide = () =>
    setCurrentMediaIndex(
      (prev) => (prev - 1 + mediaList.length) % mediaList.length,
    );

  // Auto slide
  useEffect(() => {
    if (mediaList.length > 1) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [mediaList.length]);

  const currentMedia = mediaList[currentMediaIndex];
  const isVideo = currentMedia && currentMedia.match(/\.(mp4|webm)$/i);

  // Hàm xử lý url ảnh (từ localhost hoặc link ngoài)
  const getMediaUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  return (
    <div
      className={`popup-banner popup-pos-${popup.position || "center"}`}
      style={{
        width: popup.width || "400px",
        height: popup.height === "auto" ? "auto" : popup.height,
        maxHeight: "90vh",
        maxWidth: "90vw",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          cursor: "pointer",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FaTimes />
      </button>

      {/* Media Slider */}
      {mediaList.length > 0 && (
        <div className="media-container" style={{ minHeight: "200px" }}>
          {isVideo ? (
            <video
              src={getMediaUrl(currentMedia)}
              controls
              autoPlay
              muted
              loop
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <img
              src={getMediaUrl(currentMedia)}
              alt={popup.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}

          {mediaList.length > 1 && (
            <>
              <button
                className="media-nav-btn media-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
              >
                <FaChevronLeft />
              </button>
              <button
                className="media-nav-btn media-next"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
      )}

      <div
        style={{ padding: "15px", textAlign: "center", background: "white" }}
      >
        {popup.title && (
          <h4 style={{ color: "#2e7d32", marginBottom: "8px" }}>
            {popup.title}
          </h4>
        )}
        <p style={{ color: "#555", marginBottom: "12px", fontSize: "0.9rem" }}>
          {popup.content}
        </p>
        {popup.link_url && (
          <a
            href={popup.link_url}
            style={{
              display: "inline-block",
              background: "#2e7d32",
              color: "white",
              padding: "8px 20px",
              borderRadius: "20px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Xem Chi Tiết
          </a>
        )}
      </div>
    </div>
  );
};

export default PopupBanner;

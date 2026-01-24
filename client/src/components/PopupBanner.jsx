import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { FaTimes } from "react-icons/fa";

const PopupBanner = () => {
  const [popup, setPopup] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Lấy dữ liệu popup từ server
    axiosClient
      .get("/popup")
      .then((res) => {
        if (res.data && res.data.is_active) {
          setPopup(res.data);

          // Kiểm tra xem người dùng đã tắt popup này chưa (trong phiên làm việc này)
          const isClosed = sessionStorage.getItem("popup_closed");
          if (!isClosed) {
            // Hiện popup sau 1 giây cho mượt
            setTimeout(() => setIsVisible(true), 1000);
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Lưu vào session storage để không hiện lại cho đến khi tắt trình duyệt
    sessionStorage.setItem("popup_closed", "true");
  };

  if (!popup || !isVisible) return null;

  // Style động dựa trên vị trí (center, bottom-right, bottom-left)
  const positionStyles = {
    center: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    "bottom-right": {
      bottom: "20px",
      right: "20px",
    },
    "bottom-left": {
      bottom: "20px",
      left: "20px",
    },
  };

  const currentStyle = positionStyles[popup.position] || positionStyles.center;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        ...currentStyle,
        width: "90%",
        maxWidth: "400px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
        overflow: "hidden",
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      {/* Nút đóng */}
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "rgba(0,0,0,0.5)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FaTimes />
      </button>

      {/* Ảnh */}
      {popup.image_url && (
        <img
          src={`http://localhost:3000${popup.image_url}`}
          alt="Popup"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      )}

      {/* Nội dung */}
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3 style={{ color: "#2e7d32", marginBottom: "10px" }}>
          {popup.title}
        </h3>
        <p style={{ color: "#555", marginBottom: "15px" }}>{popup.content}</p>

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
            Xem Ngay
          </a>
        )}
      </div>
    </div>
  );
};

export default PopupBanner;

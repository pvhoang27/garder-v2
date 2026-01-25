import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { FaTimes } from "react-icons/fa";

const PopupBanner = () => {
  const [popups, setPopups] = useState([]);

  useEffect(() => {
    axiosClient
      .get("/popup")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          // Lọc ra những popup chưa bị tắt trong phiên này
          const activePopups = res.data.filter((p) => {
            const isClosed = sessionStorage.getItem(`popup_closed_${p.id}`);
            return !isClosed;
          });

          // Hiện popup sau 1 giây cho mượt
          if (activePopups.length > 0) {
            setTimeout(() => setPopups(activePopups), 1000);
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleClose = (id) => {
    // Tắt popup cụ thể và lưu vào session
    setPopups((prev) => prev.filter((p) => p.id !== id));
    sessionStorage.setItem(`popup_closed_${id}`, "true");
  };

  if (popups.length === 0) return null;

  return (
    <>
      {popups.map((popup) => (
        <div
          key={popup.id}
          className={`popup-banner popup-pos-${popup.position || "center"}`}
        >
          {/* Nút đóng */}
          <button
            onClick={() => handleClose(popup.id)}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "rgba(0,0,0,0.6)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <FaTimes size={12} />
          </button>

          {/* Ảnh */}
          {popup.image_url && (
            <img
              src={`http://localhost:3000${popup.image_url}`}
              alt={popup.title}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                maxHeight: "200px",
                objectFit: "cover",
              }}
            />
          )}

          {/* Nội dung */}
          <div style={{ padding: "15px", textAlign: "center" }}>
            {popup.title && (
              <h4
                style={{
                  color: "#2e7d32",
                  marginBottom: "8px",
                  fontSize: "1.1rem",
                }}
              >
                {popup.title}
              </h4>
            )}

            <p
              style={{
                color: "#555",
                marginBottom: "12px",
                fontSize: "0.9rem",
              }}
            >
              {popup.content}
            </p>

            {popup.link_url && (
              <a
                href={popup.link_url}
                style={{
                  display: "inline-block",
                  background: "#2e7d32",
                  color: "white",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                }}
              >
                Xem Ngay
              </a>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default PopupBanner;

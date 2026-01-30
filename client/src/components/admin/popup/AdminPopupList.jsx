import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminPopupList = ({ popups, handleEdit, handleDelete }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px",
      }}
    >
      {popups.map((popup) => {
        let mediaList = [];
        try {
          mediaList = JSON.parse(popup.media_urls || "[]");
        } catch (e) {}
        return (
          <div
            key={popup.id}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              borderLeft: popup.is_active
                ? "5px solid #2e7d32"
                : "5px solid #ccc",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <h4 style={{ margin: 0, color: "#333" }}>
                {popup.title || "(Không tiêu đề)"}
              </h4>
              <span
                style={{
                  fontSize: "0.8rem",
                  background: "#eee",
                  padding: "2px 8px",
                  borderRadius: "10px",
                }}
              >
                {popup.position}
              </span>
            </div>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#666",
                margin: "5px 0",
              }}
            >
              Size: {popup.width} x {popup.height}
            </p>

            {/* Preview ảnh đầu tiên trong list */}
            {mediaList.length > 0 && (
              <div
                style={{
                  marginTop: "10px",
                  height: "120px",
                  background: "#f0f0f0",
                  borderRadius: "5px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {mediaList[0].match(/\.(mp4|webm)$/i) ? (
                  <video
                    src={`http://localhost:3000${mediaList[0]}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={`http://localhost:3000${mediaList[0]}`}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
                {mediaList.length > 1 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 5,
                      right: 5,
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      fontSize: "0.7rem",
                    }}
                  >
                    +{mediaList.length - 1}
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => handleEdit(popup)}
                style={{
                  background: "#ff9800",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                <FaEdit /> Sửa
              </button>
              <button
                onClick={() => handleDelete(popup.id)}
                style={{
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                <FaTrash /> Xóa
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminPopupList;
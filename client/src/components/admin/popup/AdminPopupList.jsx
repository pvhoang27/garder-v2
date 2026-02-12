import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./AdminPopup.css";
import { API_URL } from "../../../config";

const AdminPopupList = ({ popups, handleEdit, handleDelete }) => {
  return (
    <div className="popup-list-grid">
      {popups.map((popup) => {
        let mediaList = [];
        try {
          mediaList = JSON.parse(popup.media_urls || "[]");
        } catch (e) {}

        // Xác định class active/inactive
        const cardClass = `popup-card ${popup.is_active ? "active" : "inactive"}`;

        return (
          <div key={popup.id} className={cardClass}>
            <div className="card-header">
              <h4 className="card-title">{popup.title || "(Không tiêu đề)"}</h4>
              <span className="card-badge">{popup.position}</span>
            </div>
            <p className="card-info">
              Size: {popup.width} x {popup.height}
            </p>

            {/* Preview ảnh đầu tiên trong list */}
            {mediaList.length > 0 && (
              <div className="card-media-box">
                {mediaList[0].match(/\.(mp4|webm)$/i) ? (
                  <video
                    src={`${API_URL}${mediaList[0]}`}
                    className="preview-media"
                  />
                ) : (
                  <img
                    src={`${API_URL}${mediaList[0]}`}
                    alt=""
                    className="preview-media"
                  />
                )}
                {mediaList.length > 1 && (
                  <div className="media-count-badge">
                    +{mediaList.length - 1}
                  </div>
                )}
              </div>
            )}

            <div className="card-actions">
              <button
                onClick={() => handleEdit(popup)}
                className="btn-popup btn-edit"
              >
                <FaEdit /> Sửa
              </button>
              <button
                onClick={() => handleDelete(popup.id)}
                className="btn-popup btn-delete"
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

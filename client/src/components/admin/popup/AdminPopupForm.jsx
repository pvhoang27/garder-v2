import React from "react";
import { FaSave, FaTimes, FaImages, FaVideo } from "react-icons/fa";
import "./AdminPopup.css"; // Import CSS

const AdminPopupForm = ({
  config,
  handleChange,
  handleFileChange,
  handleSubmit,
  handleCancel,
  previews,
  isEditing,
}) => {
  // Helper render media preview
  const renderPreviewMedia = (item, index) => {
    const isVideo =
      item.type === "video" ||
      (typeof item.url === "string" && item.url.match(/\.(mp4|webm)$/i));

    return (
      <div key={index} className="preview-item">
        {isVideo ? (
          <video src={item.url} className="preview-media" />
        ) : (
          <img src={item.url} alt="Preview" className="preview-media" />
        )}
        {isVideo && (
          <div className="video-overlay">
            <FaVideo />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-popup-form">
      <h3 className="form-title">
        {config.id ? "Sửa Popup" : "Thêm Popup Mới"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="switch">
            <input
              type="checkbox"
              name="is_active"
              checked={config.is_active}
              onChange={handleChange}
              style={{ marginRight: "10px" }} // Giữ lại chút style nhỏ cho checkbox
            />
            Kích hoạt hiển thị
          </label>
        </div>

        <div className="form-row">
          <div>
            <label className="form-label">Tiêu đề:</label>
            <input
              type="text"
              name="title"
              value={config.title}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div>
            <label className="form-label">Link liên kết (khi bấm vào):</label>
            <input
              type="text"
              name="link_url"
              value={config.link_url}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* CẤU HÌNH KÍCH THƯỚC & VỊ TRÍ */}
        <div className="form-row config-area">
          <div>
            <label className="form-label">Vị trí:</label>
            <select
              name="position"
              value={config.position}
              onChange={handleChange}
              className="form-control"
            >
              <option value="center">Giữa màn hình</option>
              <option value="top-left">Góc trái trên</option>
              <option value="top-right">Góc phải trên</option>
              <option value="bottom-left">Góc trái dưới</option>
              <option value="bottom-right">Góc phải dưới</option>
              <option value="top-center">Giữa trên</option>
              <option value="bottom-center">Giữa dưới</option>
            </select>
          </div>
          <div>
            <label className="form-label">Chiều rộng (px hoặc %):</label>
            <input
              type="text"
              name="width"
              value={config.width}
              onChange={handleChange}
              placeholder="VD: 500px, 80%"
              className="form-control"
            />
          </div>
          <div>
            <label className="form-label">Chiều cao (px hoặc auto):</label>
            <input
              type="text"
              name="height"
              value={config.height}
              onChange={handleChange}
              placeholder="VD: 400px, auto"
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: "15px" }}>
          <label className="form-label">Nội dung text:</label>
          <textarea
            name="content"
            value={config.content}
            onChange={handleChange}
            rows="3"
            className="form-control"
          ></textarea>
        </div>

        {/* UPLOAD MULTIPLE MEDIA */}
        <div className="form-group">
          <label className="upload-label">
            <FaImages /> Hình ảnh / Video (Chọn nhiều):
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*,video/*"
            style={{ display: "block", marginTop: "5px" }}
          />

          {previews.length > 0 && (
            <div className="preview-list">
              {previews.map((item, index) => renderPreviewMedia(item, index))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-popup btn-save">
            <FaSave /> Lưu lại
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn-popup btn-cancel"
          >
            <FaTimes /> Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPopupForm;
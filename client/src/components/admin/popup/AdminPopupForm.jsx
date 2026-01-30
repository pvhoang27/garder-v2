import React from "react";
import { FaSave, FaTimes, FaImages, FaVideo } from "react-icons/fa";

const AdminPopupForm = ({
  config,
  handleChange,
  handleFileChange,
  handleSubmit,
  handleCancel,
  previews,
  isEditing,
}) => {
  // Helper render media preview (chỉ dùng trong form)
  const renderPreviewMedia = (item, index) => {
    const isVideo =
      item.type === "video" ||
      (typeof item.url === "string" && item.url.match(/\.(mp4|webm)$/i));

    return (
      <div
        key={index}
        style={{
          position: "relative",
          width: "100px",
          height: "100px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {isVideo ? (
          <video
            src={item.url}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <img
            src={item.url}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        {isVideo && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.3)",
              color: "white",
            }}
          >
            <FaVideo />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        marginBottom: "30px",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>
        {config.id ? "Sửa Popup" : "Thêm Popup Mới"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label className="switch">
            <input
              type="checkbox"
              name="is_active"
              checked={config.is_active}
              onChange={handleChange}
              style={{ marginRight: "10px" }}
            />
            <b>Kích hoạt hiển thị</b>
          </label>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <label>Tiêu đề:</label>
            <input
              type="text"
              name="title"
              value={config.title}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
              }}
            />
          </div>
          <div>
            <label>Link liên kết (khi bấm vào):</label>
            <input
              type="text"
              name="link_url"
              value={config.link_url}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
              }}
            />
          </div>
        </div>

        {/* CẤU HÌNH KÍCH THƯỚC & VỊ TRÍ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "20px",
            marginTop: "15px",
            background: "#f9f9f9",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <div>
            <label>Vị trí:</label>
            <select
              name="position"
              value={config.position}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
              }}
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
            <label>Chiều rộng (px hoặc %):</label>
            <input
              type="text"
              name="width"
              value={config.width}
              onChange={handleChange}
              placeholder="VD: 500px, 80%"
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
              }}
            />
          </div>
          <div>
            <label>Chiều cao (px hoặc auto):</label>
            <input
              type="text"
              name="height"
              value={config.height}
              onChange={handleChange}
              placeholder="VD: 400px, auto"
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: "15px" }}>
          <label>Nội dung text:</label>
          <textarea
            name="content"
            value={config.content}
            onChange={handleChange}
            rows="3"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          ></textarea>
        </div>

        {/* UPLOAD MULTIPLE MEDIA */}
        <div style={{ marginTop: "15px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
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
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                flexWrap: "wrap",
              }}
            >
              {previews.map((item, index) => renderPreviewMedia(item, index))}
            </div>
          )}
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              background: "#2e7d32",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FaSave /> Lưu lại
          </button>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              background: "#666",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FaTimes /> Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPopupForm;
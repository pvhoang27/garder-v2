import React from "react";
import { FaImage, FaSave } from "react-icons/fa";

const AdminHeroConfig = ({
  heroConfig,
  setHeroConfig,
  previewUrl,
  handleHeroFileChange,
  handleSaveHeroConfig,
}) => {
  // Styles cục bộ cho form (được chuyển từ file cha sang)
  const formGroupStyle = { marginBottom: "15px" };
  const labelStyle = { display: "block", marginBottom: "5px", fontWeight: "bold" };
  const inputStyle = {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div className="admin-card">
      <h3 style={{ marginBottom: "20px", color: "#2e7d32" }}>
        Cấu Hình Banner Đầu Trang (Hero Section)
      </h3>
      <form onSubmit={handleSaveHeroConfig} encType="multipart/form-data">
        <div
          className="form-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
        >
          <div style={formGroupStyle}>
            <label style={labelStyle}>Phần tiêu đề (Đầu):</label>
            <input
              type="text"
              style={inputStyle}
              value={heroConfig.titlePrefix}
              onChange={(e) =>
                setHeroConfig({ ...heroConfig, titlePrefix: e.target.value })
              }
              placeholder="VD: Khám phá vẻ đẹp"
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Phần tiêu đề (Nổi bật):</label>
            <input
              type="text"
              style={inputStyle}
              value={heroConfig.titleHighlight}
              onChange={(e) =>
                setHeroConfig({ ...heroConfig, titleHighlight: e.target.value })
              }
              placeholder="VD: thiên nhiên"
            />
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Phần tiêu đề (Cuối):</label>
          <input
            type="text"
            style={inputStyle}
            value={heroConfig.titleSuffix}
            onChange={(e) =>
              setHeroConfig({ ...heroConfig, titleSuffix: e.target.value })
            }
            placeholder="VD: qua từng tác phẩm"
          />
        </div>

        {/* [MỚI] KHU VỰC UPLOAD ẢNH & PREVIEW */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Hình ảnh Banner:</label>

          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              {/* Input file ẩn, dùng label để style */}
              <label
                style={{
                  display: "inline-block",
                  padding: "10px 15px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginBottom: "10px",
                }}
              >
                <FaImage style={{ marginRight: "5px" }} /> Chọn ảnh mới
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroFileChange}
                  style={{ display: "none" }}
                />
              </label>

              <div style={{ fontSize: "13px", color: "#666", marginTop: "5px" }}>
                {heroConfig.imageFile
                  ? `Đã chọn: ${heroConfig.imageFile.name}`
                  : "Đang dùng ảnh hiện tại"}
              </div>
            </div>

            {/* Khung Preview */}
            <div
              style={{
                width: "300px",
                height: "180px",
                border: "1px dashed #ccc",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fafafa",
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Hero Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "#aaa" }}>Chưa có ảnh</span>
              )}
            </div>
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Mô tả chi tiết:</label>
          <textarea
            style={{ ...inputStyle, height: "100px" }}
            value={heroConfig.description}
            onChange={(e) =>
              setHeroConfig({ ...heroConfig, description: e.target.value })
            }
            placeholder="Nhập nội dung mô tả..."
          ></textarea>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button
            type="submit"
            className="btn-save"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <FaSave /> Lưu Thay Đổi Hero
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminHeroConfig;
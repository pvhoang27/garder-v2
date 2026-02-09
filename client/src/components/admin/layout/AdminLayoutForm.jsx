import React, { useEffect, useState } from "react";
import { FaSave, FaImage } from "react-icons/fa";
import "./AdminLayout.css";

const AdminLayoutForm = ({
  isEditing,
  config,
  setConfig,
  handleSubmit,
  resetForm,
  categories,
  selectedPlantIds,
  togglePlantSelection,
  searchPlant,
  setSearchPlant,
  filteredPlantsForSelection,
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  // Effect để hiển thị ảnh cũ nếu có
  useEffect(() => {
    if (config.type === "hero_config" && config.imageUrl && !config.imageFile) {
      // Logic mới: Kiểm tra xem ảnh là đường dẫn web, Base64 hay đường dẫn local cũ
      const isExternalOrBase64 = 
        config.imageUrl.startsWith("http") || 
        config.imageUrl.startsWith("data:"); // data:image/...
      
      const url = isExternalOrBase64
        ? config.imageUrl
        : `http://localhost:3000${config.imageUrl}`;
      
      setPreviewUrl(url);
    }
  }, [config]);

  // Xử lý khi chọn file ảnh mới
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tạo URL preview tạm thời
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Lưu file vào state config để component cha xử lý gửi đi
      setConfig({ ...config, imageFile: file });
    }
  };

  // Nếu là Hero Config, hiển thị form riêng biệt
  if (config.type === "hero_config") {
    return (
      <div className="layout-form-container">
        <h3>Chỉnh sửa Hero Section (Banner)</h3>
        <form onSubmit={handleSubmit} style={{ marginTop: "15px" }} encType="multipart/form-data">
          <div className="form-grid">
            <div className="form-input-group">
              <label>Tiêu đề (Phần đầu):</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ví dụ: Make your"
                value={config.titlePrefix || ""}
                onChange={(e) => setConfig({ ...config, titlePrefix: e.target.value })}
              />
            </div>
            <div className="form-input-group">
              <label>Tiêu đề (Nổi bật - Xanh):</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ví dụ: home"
                value={config.titleHighlight || ""}
                onChange={(e) => setConfig({ ...config, titleHighlight: e.target.value })}
              />
            </div>
          </div>
          
          <div className="form-grid">
             <div className="form-input-group">
              <label>Tiêu đề (Phần cuối):</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ví dụ: green"
                value={config.titleSuffix || ""}
                onChange={(e) => setConfig({ ...config, titleSuffix: e.target.value })}
              />
            </div>
          </div>

          <div className="form-input-group" style={{ marginTop: "10px" }}>
            <label>Mô tả ngắn:</label>
            <textarea
              className="form-input"
              rows="3"
              value={config.description || ""}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
            ></textarea>
          </div>

          {/* UPLOAD ẢNH */}
          <div className="form-input-group" style={{ marginTop: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Hình ảnh Banner:
            </label>
            
            <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
              <div style={{ flex: 1 }}>
                <label className="custom-file-upload" style={{
                  display: "inline-block",
                  padding: "8px 15px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginBottom: "10px"
                }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{ display: "none" }} 
                  />
                  <FaImage style={{ marginRight: "5px" }} /> Chọn ảnh mới
                </label>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {config.imageFile ? `Đã chọn: ${config.imageFile.name}` : "Chưa chọn file mới"}
                </div>
              </div>

              {/* PREVIEW ẢNH */}
              <div style={{ 
                width: "200px", 
                height: "120px", 
                border: "1px dashed #ccc", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                backgroundColor: "#fafafa",
                overflow: "hidden",
                borderRadius: "8px"
              }}>
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                ) : (
                  <span style={{ color: "#aaa", fontSize: "12px" }}>No Image</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-buttons" style={{ marginTop: "20px" }}>
            <button type="submit" className="btn-submit">
              <FaSave /> Lưu Cấu Hình Hero
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- FORM CŨ CHO CÁC LAYOUT KHÁC (Category/Manual) ---
  return (
    <div className="layout-form-container">
      <h3>
        {isEditing
          ? `Đang chỉnh sửa: ${config.title}`
          : "Thêm Section Nội Dung Mới"}
      </h3>
      <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
        <div className="form-grid">
          <div className="form-input-group">
            <label>Tiêu đề hiển thị:</label>
            <input
              type="text"
              required
              className="form-input"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
            />
          </div>
          <div className="form-input-group">
            <label>Kiểu nội dung:</label>
            <select
              className="form-input"
              value={config.type}
              onChange={(e) => setConfig({ ...config, type: e.target.value })}
            >
              <option value="manual">Tự chọn từng cây (Thủ công)</option>
              <option value="category">Theo Danh Mục Cụ Thể (Tự động)</option>
            </select>
          </div>
        </div>

        {/* CHECKLIST CHỌN CÂY */}
        {config.type === "manual" && (
          <div className="plant-checklist">
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "10px",
              }}
            >
              Chọn cây hiển thị:
            </label>

            <input
              type="text"
              placeholder="🔍 Tìm tên cây..."
              className="plant-search-input"
              value={searchPlant}
              onChange={(e) => setSearchPlant(e.target.value)}
            />

            <div className="plant-list-grid">
              {filteredPlantsForSelection.map((plant) => (
                <label key={plant.id} className="plant-checkbox-item">
                  <input
                    type="checkbox"
                    className="plant-checkbox"
                    checked={selectedPlantIds.includes(plant.id)}
                    onChange={() => togglePlantSelection(plant.id)}
                  />
                  <div className="plant-info">
                    {plant.thumbnail && (
                      <img
                        src={`http://localhost:3000${plant.thumbnail}`}
                        alt=""
                        className="plant-thumb"
                      />
                    )}
                    <span className="plant-name">{plant.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* DANH MỤC */}
        {config.type === "category" && (
          <div style={{ marginTop: "15px" }}>
            <label>Chọn Danh Mục:</label>
            <select
              className="form-input"
              value={config.param_value}
              onChange={(e) =>
                setConfig({ ...config, param_value: e.target.value })
              }
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-order-row">
          <div>
            <label>Thứ tự hiển thị:</label>
            <input
              type="number"
              className="input-order"
              value={config.sort_order}
              onChange={(e) =>
                setConfig({
                  ...config,
                  sort_order: parseInt(e.target.value),
                })
              }
            />
          </div>
          <label className="checkbox-active">
            <input
              type="checkbox"
              checked={config.is_active}
              onChange={(e) =>
                setConfig({ ...config, is_active: e.target.checked })
              }
              style={{ marginRight: "5px" }}
            />
            Hiển thị trên web
          </label>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-submit">
            <FaSave /> Lưu Cấu Hình
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="btn-cancel">
              Hủy / Thêm mới
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminLayoutForm;
import React from "react";
import { FaSave } from "react-icons/fa";
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
import React from "react";
import { FaSave } from "react-icons/fa";

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
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "30px",
      }}
    >
      <h3>
        {isEditing
          ? `Đang chỉnh sửa: ${config.title}`
          : "Thêm Section Nội Dung Mới"}
      </h3>
      <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <label>Tiêu đề hiển thị:</label>
            <input
              type="text"
              required
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>
          <div>
            <label>Kiểu nội dung:</label>
            <select
              value={config.type}
              onChange={(e) => setConfig({ ...config, type: e.target.value })}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="manual">Tự chọn từng cây (Thủ công)</option>
              <option value="category">Theo Danh Mục Cụ Thể (Tự động)</option>
            </select>
          </div>
        </div>

        {/* CHECKLIST CHỌN CÂY */}
        {config.type === "manual" && (
          <div
            style={{
              marginTop: "20px",
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "5px",
              background: "#f9f9f9",
            }}
          >
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
              value={searchPlant}
              onChange={(e) => setSearchPlant(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "10px",
              }}
            >
              {filteredPlantsForSelection.map((plant) => (
                <label
                  key={plant.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    background: "white",
                    padding: "5px",
                    border: "1px solid #eee",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedPlantIds.includes(plant.id)}
                    onChange={() => togglePlantSelection(plant.id)}
                    style={{
                      marginRight: "8px",
                      transform: "scale(1.2)",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {plant.thumbnail && (
                      <img
                        src={`http://localhost:3000${plant.thumbnail}`}
                        alt=""
                        style={{
                          width: "30px",
                          height: "30px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <span style={{ fontSize: "0.9rem" }}>{plant.name}</span>
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
              value={config.param_value}
              onChange={(e) =>
                setConfig({ ...config, param_value: e.target.value })
              }
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
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

        <div
          style={{
            marginTop: "15px",
            display: "flex",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <div>
            <label>Thứ tự hiển thị:</label>
            <input
              type="number"
              value={config.sort_order}
              onChange={(e) =>
                setConfig({
                  ...config,
                  sort_order: parseInt(e.target.value),
                })
              }
              style={{
                width: "80px",
                padding: "8px",
                marginLeft: "10px",
              }}
            />
          </div>
          <label
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
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

        <div style={{ marginTop: "20px" }}>
          <button
            type="submit"
            style={{
              background: "#2e7d32",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <FaSave /> Lưu Cấu Hình
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                background: "#666",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Hủy / Thêm mới
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminLayoutForm;
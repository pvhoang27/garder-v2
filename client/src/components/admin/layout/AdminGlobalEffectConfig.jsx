import React from "react";
import { FaMagic, FaSave } from "react-icons/fa";

const AdminGlobalEffectConfig = ({
  globalEffect,
  setGlobalEffect,
  handleSaveEffect,
}) => {
  return (
    <div
      style={{
        background: "#e8f5e9",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "30px",
        border: "1px solid #c8e6c9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <FaMagic size={24} color="#2e7d32" />
        <div>
          <h3 style={{ margin: 0, color: "#2e7d32" }}>Hiệu ứng trang chủ</h3>
          <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem", color: "#555" }}>
            Hiệu ứng sẽ xuất hiện toàn màn hình trên trang chủ
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <select
          value={globalEffect}
          onChange={(e) => setGlobalEffect(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            minWidth: "200px",
          }}
        >
          <option value="none">🚫 Không hiệu ứng</option>
          <option value="fireworks">🎆 Pháo hoa (Fireworks)</option>
          <option value="snow">❄️ Tuyết rơi (Snowfall)</option>
          <option value="confetti">🎉 Pháo giấy (Confetti)</option>
        </select>
        <button
          onClick={handleSaveEffect}
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
          <FaSave /> Lưu
        </button>
      </div>
    </div>
  );
};

export default AdminGlobalEffectConfig;
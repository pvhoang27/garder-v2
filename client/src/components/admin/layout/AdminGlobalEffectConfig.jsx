import React from "react";
import { FaMagic, FaSave } from "react-icons/fa";
// Không cần import CSS ở đây vì sẽ import ở file cha (AdminLayoutConfig)
// hoặc import trực tiếp "./AdminLayout.css" nếu muốn component độc lập.
// Ở đây tôi chọn cách import tại file này để đảm bảo dependency rõ ràng.
import "./AdminLayout.css";

const AdminGlobalEffectConfig = ({
  globalEffect,
  setGlobalEffect,
  handleSaveEffect,
}) => {
  return (
    <div className="effect-config-container">
      <div className="effect-header">
        <FaMagic size={24} color="#2e7d32" />
        <div>
          <h3>Hiệu ứng trang chủ</h3>
          <p>Hiệu ứng sẽ xuất hiện toàn màn hình trên trang chủ</p>
        </div>
      </div>

      <div className="effect-controls">
        <select
          className="effect-select"
          value={globalEffect}
          onChange={(e) => setGlobalEffect(e.target.value)}
        >
          <option value="none">🚫 Không hiệu ứng</option>
          <option value="fireworks">🎆 Pháo hoa (Fireworks)</option>
          <option value="snow">❄️ Tuyết rơi (Snowfall)</option>
          <option value="confetti">🎉 Pháo giấy (Confetti)</option>
        </select>
        <button onClick={handleSaveEffect} className="btn-save-effect">
          <FaSave /> Lưu
        </button>
      </div>
    </div>
  );
};

export default AdminGlobalEffectConfig;
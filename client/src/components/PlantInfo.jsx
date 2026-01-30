import React from "react";

const PlantInfo = ({ plant }) => {
  return (
    <div className="detail-right">
      {/* Badge Danh mục */}
      {plant.category_name && (
        <span className="plant-badge">{plant.category_name}</span>
      )}
      
      {/* Tên và Giá */}
      <h1 className="plant-title">{plant.name}</h1>
      <div className="plant-price">
        {plant.price ? Number(plant.price).toLocaleString() : "Liên hệ"} VNĐ
      </div>

      {/* Thông tin cơ bản */}
      <div className="plant-meta">
        <p>
          <strong>Tên khoa học:</strong>{" "}
          {plant.scientific_name || "Đang cập nhật"}
        </p>
        <p>
          <strong>Tuổi đời:</strong>{" "}
          {plant.age ? `${plant.age} năm` : "Chưa rõ"}
        </p>
      </div>

      {/* Thông số kỹ thuật (Attributes) */}
      {plant.attributes && plant.attributes.length > 0 && (
        <div className="attr-section">
          <h4 className="attr-heading">Thông số chi tiết</h4>
          <div className="attr-grid">
            {plant.attributes.map((attr, idx) => (
              <div key={idx} className="attr-item">
                <span className="attr-key">{attr.attr_key}:</span>
                <span className="attr-val">{attr.attr_value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mô tả */}
      <div className="section-title">📖 Giới thiệu</div>
      <div
        className="description-content"
        dangerouslySetInnerHTML={{
          __html: plant.description || "<p>Chưa có mô tả.</p>",
        }}
      />

      {/* Cách chăm sóc */}
      <div className="section-title">💧 Cách chăm sóc</div>
      <div className="care-box">
        {plant.care_instruction || "Chưa có hướng dẫn chăm sóc."}
      </div>
    </div>
  );
};

export default PlantInfo;
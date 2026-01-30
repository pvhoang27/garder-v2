import React from "react";
import { FaTrash, FaPlus } from "react-icons/fa";

const PlantAttributes = ({ attributes, setAttributes }) => {
  const addAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const removeAttribute = (index) => {
    const newAttrs = [...attributes];
    newAttrs.splice(index, 1);
    setAttributes(newAttrs);
  };

  const handleAttrChange = (index, field, val) => {
    const newAttrs = [...attributes];
    newAttrs[index][field] = val;
    setAttributes(newAttrs);
  };

  return (
    <div className="form-section attr-section">
      <div className="section-header">
        <h3 className="section-title">Thông số chi tiết (Tùy chọn)</h3>
        <button type="button" onClick={addAttribute} className="btn-add-attr">
          <FaPlus /> Thêm dòng
        </button>
      </div>

      {attributes.length === 0 && (
        <p className="empty-text">Chưa có thông số nào.</p>
      )}

      {attributes.map((attr, index) => (
        <div key={index} className="attr-row">
          <input
            type="text"
            placeholder="Tên (VD: Chiều cao)"
            value={attr.key}
            onChange={(e) => handleAttrChange(index, "key", e.target.value)}
            className="form-input attr-input"
          />
          <input
            type="text"
            placeholder="Giá trị (VD: 1.5m)"
            value={attr.value}
            onChange={(e) => handleAttrChange(index, "value", e.target.value)}
            className="form-input attr-input"
          />
          <button
            type="button"
            onClick={() => removeAttribute(index)}
            className="btn-delete-attr"
          >
            <FaTrash />
          </button>
        </div>
      ))}
    </div>
  );
};

export default PlantAttributes;
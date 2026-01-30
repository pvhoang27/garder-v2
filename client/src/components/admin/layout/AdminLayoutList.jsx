import React from "react";
import { FaArrowUp, FaArrowDown, FaEdit, FaTrash } from "react-icons/fa";
import "./AdminLayout.css";

const AdminLayoutList = ({
  layouts,
  handleMoveSection,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="layout-list">
      {layouts.map((item, index) => (
        <div
          key={item.id}
          className={`layout-item ${item.is_active ? "active" : "inactive"}`}
        >
          <div className="layout-item-left">
            {/* SỐ THỨ TỰ RÕ RÀNG */}
            <div className="item-order-badge">
              <span className="order-number">#{item.sort_order}</span>
              <span className="order-label">Vị trí</span>
            </div>

            <div>
              <h4 className="item-title">{item.title}</h4>
              <p className="item-type">
                Loại:{" "}
                <span
                  className={`type-badge ${
                    item.type === "manual" ? "manual" : "category"
                  }`}
                >
                  {item.type === "manual" ? "Thủ công" : "Danh mục"}
                </span>
              </p>
            </div>
          </div>

          <div className="layout-item-right">
            {/* NÚT ĐIỀU HƯỚNG LÊN / XUỐNG */}
            <div className="move-btn-group">
              <button
                onClick={() => handleMoveSection(index, -1)}
                disabled={index === 0}
                className={`btn-move ${index === 0 ? "disabled" : "enabled"}`}
                title="Chuyển lên trên"
              >
                <FaArrowUp />
              </button>
              <button
                onClick={() => handleMoveSection(index, 1)}
                disabled={index === layouts.length - 1}
                className={`btn-move ${
                  index === layouts.length - 1 ? "disabled" : "enabled"
                }`}
                title="Chuyển xuống dưới"
              >
                <FaArrowDown />
              </button>
            </div>

            <button onClick={() => handleEdit(item)} className="btn-edit">
              <FaEdit /> Sửa
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="btn-delete"
            >
              <FaTrash /> Xóa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminLayoutList;
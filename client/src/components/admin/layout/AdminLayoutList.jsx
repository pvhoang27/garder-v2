import React from "react";
import { FaArrowUp, FaArrowDown, FaEdit, FaTrash } from "react-icons/fa";

const AdminLayoutList = ({
  layouts,
  handleMoveSection,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      {layouts.map((item, index) => (
        <div
          key={item.id}
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderLeft: item.is_active
              ? "5px solid #2e7d32"
              : "5px solid #ccc",
            opacity: item.is_active ? 1 : 0.7,
            transition: "all 0.3s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {/* SỐ THỨ TỰ RÕ RÀNG */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "50px",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#2e7d32",
                }}
              >
                #{item.sort_order}
              </span>
              <span style={{ fontSize: "0.8rem", color: "#888" }}>Vị trí</span>
            </div>

            <div>
              <h4 style={{ margin: 0, color: "#333", fontSize: "1.2rem" }}>
                {item.title}
              </h4>
              <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#666" }}>
                Loại:{" "}
                <span
                  style={{
                    background: item.type === "manual" ? "#e3f2fd" : "#fff3e0",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  {item.type === "manual" ? "Thủ công" : "Danh mục"}
                </span>
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {/* NÚT ĐIỀU HƯỚNG LÊN / XUỐNG */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginRight: "15px",
              }}
            >
              <button
                onClick={() => handleMoveSection(index, -1)}
                disabled={index === 0}
                style={{
                  background: index === 0 ? "#eee" : "#fff",
                  border: "1px solid #ddd",
                  color: index === 0 ? "#ccc" : "#2e7d32",
                  cursor: index === 0 ? "default" : "pointer",
                  padding: "5px 10px",
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Chuyển lên trên"
              >
                <FaArrowUp />
              </button>
              <button
                onClick={() => handleMoveSection(index, 1)}
                disabled={index === layouts.length - 1}
                style={{
                  background: index === layouts.length - 1 ? "#eee" : "#fff",
                  border: "1px solid #ddd",
                  borderTop: "none",
                  color: index === layouts.length - 1 ? "#ccc" : "#2e7d32",
                  cursor: index === layouts.length - 1 ? "default" : "pointer",
                  padding: "5px 10px",
                  borderBottomLeftRadius: "4px",
                  borderBottomRightRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Chuyển xuống dưới"
              >
                <FaArrowDown />
              </button>
            </div>

            <button
              onClick={() => handleEdit(item)}
              style={{
                background: "#fff8e1",
                border: "1px solid #ffcc80",
                color: "#f57c00",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginRight: "5px",
              }}
            >
              <FaEdit /> Sửa
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              style={{
                background: "#ffebee",
                border: "1px solid #ef9a9a",
                color: "#d32f2f",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
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
import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { API_URL } from "../../../config";

const PlantTable = ({ plants, onView, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: "60px" }}>Ảnh</th>
            <th>Tên cây</th>
            <th>Danh mục</th>
            <th>Giá niêm yết</th>
            <th style={{ width: "150px" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {plants.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                Không tìm thấy dữ liệu phù hợp.
              </td>
            </tr>
          ) : (
            plants.map((plant) => (
              <tr key={plant.id}>
                <td>
                  {plant.thumbnail ? (
                    <img
                      src={`${API_URL}${plant.thumbnail}`}
                      alt=""
                      className="thumb-img"
                    />
                  ) : (
                    <div
                      className="thumb-img"
                      style={{ background: "#eee" }}
                    ></div>
                  )}
                </td>
                <td>
                  <strong>{plant.name}</strong>
                </td>
                <td>{plant.category_name}</td>
                <td className="price-text">
                  {Number(plant.price).toLocaleString()} đ
                </td>
                <td>
                  <div className="action-group">
                    <button
                      onClick={() => onView(plant.id)}
                      className="action-btn btn-view"
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => onEdit(plant)}
                      className="action-btn btn-edit"
                      title="Sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(plant.id)}
                      className="action-btn btn-delete"
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlantTable;

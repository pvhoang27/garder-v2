import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminNewsForm from "./AdminNewsForm";

const AdminNewsManager = ({ isMobile }) => {
  const [newsList, setNewsList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axiosClient.get("/news");
      setNewsList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa tin này?")) return;
    try {
      await axiosClient.delete(`/news/${id}`);
      fetchNews();
    } catch (error) {
      alert("Lỗi khi xóa!");
    }
  };

  const handleEdit = (news) => {
    setEditingNews(news);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingNews(null);
    fetchNews();
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#2c3e50" }}>📰 Quản Lý Tin Tức</h2>
        <button
          onClick={() => { setEditingNews(null); setShowForm(true); }}
          style={{ background: "#2e7d32", color: "white", border: "none", padding: "10px 15px", borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
        >
          <FaPlus /> Thêm Tin Mới
        </button>
      </div>

      {showForm && (
        <div className="modal-form-overlay" style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{ width: "90%", maxWidth: "600px" }}>
             <div style={{ background: "white", padding: "10px 20px", borderRadius: "8px 8px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>{editingNews ? "Sửa Tin Tức" : "Thêm Tin Tức"}</h3>
                <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer" }}>&times;</button>
             </div>
             <AdminNewsForm initialData={editingNews} onSuccess={handleFormSuccess} />
          </div>
        </div>
      )}

      <div className="table-container" style={{ overflowX: "auto", background: "white", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Hình ảnh</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Tiêu đề</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Ngày tạo</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Ngày cập nhật</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {newsList.map((news) => (
              <tr key={news.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{news.id}</td>
                <td style={{ padding: "12px" }}>
                    {news.image && (
                        <img 
                            src={news.image.startsWith('http') ? news.image : `http://localhost:3000${news.image}`} 
                            alt="thumb" 
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                        />
                    )}
                </td>
                <td style={{ padding: "12px" }}>
                    <div style={{ fontWeight: "bold" }}>{news.title}</div>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>{news.summary.substring(0, 50)}...</div>
                </td>
                <td style={{ padding: "12px" }}>
                    {new Date(news.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td style={{ padding: "12px", fontSize: "0.9rem", color: "#555" }}>
                    {/* Hiển thị đầy đủ ngày giờ: HH:mm:ss dd/mm/yyyy */}
                    {news.updated_at ? new Date(news.updated_at).toLocaleString('vi-VN') : ""}
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <button onClick={() => handleEdit(news)} style={{ marginRight: "10px", background: "none", border: "none", color: "#f39c12", cursor: "pointer", fontSize: "16px" }} title="Sửa">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(news.id)} style={{ background: "none", border: "none", color: "#e74c3c", cursor: "pointer", fontSize: "16px" }} title="Xóa">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {newsList.length === 0 && <p style={{ textAlign: "center", padding: "20px", color: "#888" }}>Chưa có tin tức nào.</p>}
      </div>
    </div>
  );
};

export default AdminNewsManager;
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // Bỏ nếu không dùng navigate nội bộ
import axiosClient from "../api/axiosClient";
import { FaTrash, FaCommentDots, FaEye } from "react-icons/fa"; 
import "./AdminCommentManager.css"; 

const AdminCommentManager = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/comments/admin-all");
      setComments(res.data);
    } catch (error) {
      console.error("Lỗi tải danh sách bình luận:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleViewDetail = (type, id) => {
      const url = type === 'plant' ? `/plant/${id}` : `/news/${id}`;
      window.open(url, '_blank');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
      try {
        await axiosClient.delete(`/comments/${id}`);
        setComments(comments.filter((item) => item.id !== id));
        alert("Đã xóa bình luận thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("Có lỗi xảy ra khi xóa bình luận.");
      }
    }
  };

  return (
    <div className="admin-content">
      <div className="admin-header-section">
        <h2><FaCommentDots /> Quản lý Bình Luận</h2>
      </div>

      <div className="table-responsive">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {/* SET WIDTH ĐỂ KHÔNG BỊ LỆCH */}
                <th className="col-center" style={{ width: "60px" }}>ID</th>
                <th style={{ width: "180px" }}>Người dùng</th>
                <th>Nội dung</th> {/* Cột này để tự do co giãn */}
                <th style={{ width: "200px" }}>Mục (Entity)</th>
                <th className="col-center" style={{ width: "150px" }}>Thời gian</th>
                <th className="col-center" style={{ width: "100px" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment.id}>
                  <td className="col-center">#{comment.id}</td>
                  <td>
                    <div style={{ fontWeight: "bold", color: "#2c3e50" }}>
                      {comment.user_full_name || comment.guest_name || "Ẩn danh"}
                    </div>
                    {comment.user_id && <span className="badge-user">Thành viên</span>}
                  </td>
                  <td>
                      <div style={{ lineHeight: "1.5", color: "#555" }}>
                        {comment.content}
                      </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <span className={`badge-type ${comment.entity_type}`}>
                            {comment.entity_type === 'plant' ? 'Cây cảnh' : 'Tin tức'}
                        </span>
                        
                        <span 
                            className="entity-name-display" 
                            onClick={() => handleViewDetail(comment.entity_type, comment.entity_id)}
                            title="Mở bài viết trong tab mới"
                        >
                            {comment.entity_type === 'plant' 
                                ? (comment.plant_name || "ID: " + comment.entity_id) 
                                : (comment.news_title || "ID: " + comment.entity_id)
                            }
                        </span>
                    </div>
                  </td>
                  <td className="col-center">
                      {new Date(comment.created_at).toLocaleString("vi-VN", {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                      })}
                  </td>
                  <td className="col-center">
                    <div className="action-buttons">
                        <button
                          className="btn-action btn-view"
                          onClick={() => handleViewDetail(comment.entity_type, comment.entity_id)}
                          title="Xem chi tiết (Tab mới)"
                        >
                          <FaEye />
                        </button>

                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(comment.id)}
                          title="Xóa bình luận"
                        >
                          <FaTrash />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {comments.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-comments">
                    Chưa có bình luận nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminCommentManager;
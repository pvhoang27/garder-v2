import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import { FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import "./AdminCommentManager.css";

const AdminCommentManager = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu khi vào trang
  const fetchComments = async () => {
    try {
      const res = await axiosClient.get("/comments/admin/all");
      setComments(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy danh sách bình luận:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Xử lý xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      try {
        await axiosClient.delete(`/comments/${id}`);
        // Xóa thành công thì lọc bỏ khỏi danh sách trên giao diện
        setComments(comments.filter((c) => c.id !== id));
      } catch (error) {
        alert("Lỗi khi xóa bình luận!");
      }
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="admin-comment-manager">
      <h2>Quản lý Bình luận</h2>
      
      {comments.length === 0 ? (
        <p>Chưa có bình luận nào.</p>
      ) : (
        <table className="comment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Người dùng</th>
              <th>Nội dung</th>
              <th>Loại</th>
              <th>Thời gian</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((cmt) => (
              <tr key={cmt.id}>
                <td>{cmt.id}</td>
                <td>
                  <strong>{cmt.user_full_name || cmt.guest_name || "Khách"}</strong>
                  <br />
                  <small style={{color: '#888'}}>{cmt.user_id ? "(Thành viên)" : "(Vãng lai)"}</small>
                </td>
                <td>
                    <div className="comment-content" title={cmt.content}>
                        {cmt.content}
                    </div>
                </td>
                <td>
                  {cmt.entity_type === "plant" ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>Cây cảnh</span>
                  ) : (
                    <span style={{ color: "blue", fontWeight: "bold" }}>Tin tức</span>
                  )}
                </td>
                <td>{new Date(cmt.created_at).toLocaleString("vi-VN")}</td>
                <td>
                  {/* --- SỬA LỖI TẠI ĐÂY (plants -> plant) --- */}
                  <Link 
                    to={cmt.entity_type === "plant" ? `/plant/${cmt.entity_id}` : `/news/${cmt.entity_id}`}
                    target="_blank"
                    className="btn-view"
                    title="Xem bài viết"
                  >
                    <FaExternalLinkAlt />
                  </Link>

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(cmt.id)}
                    title="Xóa bình luận"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCommentManager;
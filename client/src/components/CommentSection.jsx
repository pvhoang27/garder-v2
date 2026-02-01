import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { FaPaperPlane, FaUserCircle, FaTrash } from "react-icons/fa"; // Thêm FaTrash
import "./CommentSection.css";

const CommentSection = ({ entityType, entityId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy thông tin User hiện tại để check quyền Admin
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = currentUser?.role === 'admin'; 

  const fetchComments = async () => {
    try {
      const res = await axiosClient.get("/comments", {
        params: { entity_type: entityType, entity_id: entityId },
      });
      setComments(res.data);
    } catch (error) {
      console.error("Lỗi tải bình luận", error);
    }
  };

  useEffect(() => {
    if (entityId) fetchComments();
  }, [entityId, entityType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!currentUser && !guestName.trim()) {
      alert("Vui lòng nhập tên của bạn!");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post("/comments", {
        entity_type: entityType,
        entity_id: entityId,
        content: content,
        user_id: currentUser ? currentUser.id : null,
        guest_name: currentUser ? currentUser.full_name : guestName,
      });

      setContent("");
      fetchComments();
    } catch (error) {
      alert("Lỗi khi gửi bình luận");
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM XÓA BÌNH LUẬN (CHỈ ADMIN MỚI GỌI ĐƯỢC) ---
  const handleDelete = async (commentId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
        try {
            await axiosClient.delete(`/comments/${commentId}`);
            // Xóa xong thì lọc bỏ khỏi danh sách hiển thị luôn cho nhanh
            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            console.error(error);
            alert("Lỗi khi xóa bình luận");
        }
    }
  }

  return (
    <div className="comment-section">
      <h3>Bình luận ({comments.length})</h3>

      <form onSubmit={handleSubmit} className="comment-form">
        {!currentUser && (
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Tên của bạn..."
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
            />
          </div>
        )}
        <div style={{ display: "flex", gap: "10px" }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            required
          />
          <button
            type="submit"
            disabled={loading}
          >
            <FaPaperPlane /> {loading ? "Gửi..." : "Gửi"}
          </button>
        </div>
      </form>

      <div className="comment-list">
        {comments.map((cmt) => (
          <div key={cmt.id} className="comment-item">
            <div className="comment-avatar">
               {cmt.avatar ? (
                   <img src={`http://localhost:3000${cmt.avatar}`} alt="avatar" />
               ) : (
                   <FaUserCircle />
               )}
            </div>
            <div className="comment-content-wrapper">
              <div className="comment-header">
                <span className="comment-author">
                    {cmt.user_name || cmt.guest_name || "Khách ẩn danh"}
                    {cmt.user_id && <span className="badge-member">Thành viên</span>}
                </span>
                <span className="comment-time">
                  {new Date(cmt.created_at).toLocaleString('vi-VN')}
                </span>
                
                {/* --- CHỈ HIỆN NÚT XÓA NẾU LÀ ADMIN --- */}
                {isAdmin && (
                    <button 
                        className="btn-delete-comment"
                        onClick={() => handleDelete(cmt.id)}
                        title="Xóa bình luận này"
                    >
                        <FaTrash />
                    </button>
                )}
              </div>
              <div className="comment-body">{cmt.content}</div>
            </div>
          </div>
        ))}
        {comments.length === 0 && <p className="no-comments">Chưa có bình luận nào. Hãy là người đầu tiên!</p>}
      </div>
    </div>
  );
};

export default CommentSection;
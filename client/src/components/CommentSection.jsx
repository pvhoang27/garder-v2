import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import "./CommentSection.css"; // Bạn có thể tạo file CSS riêng nếu cần

const CommentSection = ({ entityType, entityId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy thông tin user hiện tại (nếu đã đăng nhập)
  const currentUser = JSON.parse(localStorage.getItem("user"));

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

    // Nếu chưa đăng nhập thì bắt buộc nhập tên
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
      fetchComments(); // Reload lại danh sách
    } catch (error) {
      alert("Lỗi khi gửi bình luận");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "40px", padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}>
      <h3>Bình luận ({comments.length})</h3>

      {/* Form bình luận */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        {!currentUser && (
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Tên của bạn..."
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              style={{ padding: "8px", width: "100%", maxWidth: "300px", border: "1px solid #ddd", borderRadius: "4px" }}
              required
            />
          </div>
        )}
        <div style={{ display: "flex", gap: "10px" }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: "4px", minHeight: "60px" }}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ background: "#2e7d32", color: "white", border: "none", padding: "0 20px", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <FaPaperPlane /> {loading ? "Gửi..." : "Gửi"}
          </button>
        </div>
      </form>

      {/* Danh sách bình luận */}
      <div className="comment-list">
        {comments.map((cmt) => (
          <div key={cmt.id} style={{ display: "flex", gap: "15px", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
            <div style={{ fontSize: "30px", color: "#ccc" }}>
               {/* Nếu có avatar user thì dùng, không thì dùng icon mặc định */}
               <FaUserCircle />
            </div>
            <div>
              <div style={{ fontWeight: "bold", color: "#333", marginBottom: "4px" }}>
                {cmt.user_name || cmt.guest_name || "Khách ẩn danh"}
                <span style={{ fontSize: "12px", color: "#999", marginLeft: "10px", fontWeight: "normal" }}>
                  {new Date(cmt.created_at).toLocaleString('vi-VN')}
                </span>
              </div>
              <div style={{ color: "#555" }}>{cmt.content}</div>
            </div>
          </div>
        ))}
        {comments.length === 0 && <p style={{ color: "#777", fontStyle: "italic" }}>Chưa có bình luận nào. Hãy là người đầu tiên!</p>}
      </div>
    </div>
  );
};

export default CommentSection;
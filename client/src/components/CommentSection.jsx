import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { FaPaperPlane, FaUserCircle, FaTrash, FaReply } from "react-icons/fa";
import "./CommentSection.css";
import { API_URL } from "../config";

const CommentSection = ({ entityType, entityId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState(""); // Nội dung comment chính
  const [replyContent, setReplyContent] = useState(""); // Nội dung reply
  const [replyingTo, setReplyingTo] = useState(null); // ID của comment đang được reply
  const [loading, setLoading] = useState(false);

  // Lấy thông tin User hiện tại
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = currentUser?.role === "admin";

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

  // Xử lý gửi comment (cả comment gốc và reply)
  const handleSubmit = async (e, parentId = null) => {
    e.preventDefault();

    // Xác định nội dung cần gửi (Root hay Reply)
    const contentToSend = parentId ? replyContent : content;

    if (!contentToSend.trim()) return;

    if (!currentUser) {
      alert("Vui lòng đăng nhập để bình luận!");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post("/comments", {
        entity_type: entityType,
        entity_id: entityId,
        content: contentToSend,
        user_id: currentUser.id,
        guest_name: currentUser.full_name,
        parent_id: parentId, // Gửi kèm parent_id nếu có
      });

      // Reset form sau khi gửi thành công
      if (parentId) {
        setReplyContent("");
        setReplyingTo(null);
      } else {
        setContent("");
      }

      fetchComments(); // Tải lại danh sách
    } catch (error) {
      if (error.response && error.response.status === 429) {
        alert(error.response.data.message);
      } else {
        alert("Lỗi khi gửi bình luận");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      try {
        await axiosClient.delete(`/comments/${commentId}`);
        // Lọc bỏ comment đã xóa khỏi state ngay lập tức
        setComments(comments.filter((c) => c.id !== commentId));
      } catch (error) {
        console.error(error);
        alert("Lỗi khi xóa bình luận");
      }
    }
  };

  // --- LOGIC HIỂN THỊ CÂY BÌNH LUẬN --- //

  // Lấy danh sách comment gốc (không có parent_id)
  const rootComments = comments.filter((c) => !c.parent_id);

  // Hàm đệ quy hoặc lọc để lấy replies của một comment cha
  const getReplies = (parentId) => {
    return comments
      .filter((c) => c.parent_id === parentId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); // Reply cũ nhất lên đầu
  };

  // --- SỬA LỖI: Chuyển thành hàm render thay vì Component con ---
  const renderCommentItem = (comment, isReply = false) => {
    const replies = getReplies(comment.id);
    const isReplying = replyingTo === comment.id;

    return (
      <div
        key={comment.id}
        className={`comment-wrapper ${isReply ? "is-reply" : ""}`}
      >
        <div className="comment-item">
          <div className="comment-avatar">
            {comment.avatar ? (
              <img src={`${API_URL}${comment.avatar}`} alt="avatar" />
            ) : (
              <FaUserCircle />
            )}
          </div>
          <div className="comment-content-wrapper">
            <div className="comment-header">
              <span className="comment-author">
                {comment.user_name || comment.guest_name || "Khách ẩn danh"}
                {comment.user_id && (
                  <span className="badge-member">Thành viên</span>
                )}
              </span>
              <span className="comment-time">
                {new Date(comment.created_at).toLocaleString("vi-VN")}
              </span>

              {/* Nút hành động */}
              <div className="comment-actions">
                {/* Nút Trả lời: Chỉ hiện ở comment gốc hoặc tùy nhu cầu */}
                <button
                  className="btn-reply"
                  onClick={() => {
                    if (!currentUser)
                      return alert("Vui lòng đăng nhập để trả lời!");
                    // Reset nội dung khi mở form reply mới
                    if (replyingTo !== comment.id) setReplyContent("");
                    setReplyingTo(isReplying ? null : comment.id);
                  }}
                >
                  <FaReply /> Trả lời
                </button>

                {isAdmin && (
                  <button
                    className="btn-delete-comment"
                    onClick={() => handleDelete(comment.id)}
                    title="Xóa bình luận này"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>

            <div className="comment-body">{comment.content}</div>

            {/* FORM TRẢ LỜI (Chỉ hiện khi đang reply comment này) */}
            {isReplying && (
              <form
                onSubmit={(e) => handleSubmit(e, comment.id)}
                className="reply-form"
              >
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Trả lời ${comment.user_name || "người dùng"}...`}
                  autoFocus
                  required
                />
                <div className="reply-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setReplyingTo(null)}
                  >
                    Hủy
                  </button>
                  <button type="submit" disabled={loading}>
                    {loading ? "Đang gửi..." : "Gửi trả lời"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Hiển thị danh sách phản hồi (Replies) - Gọi đệ quy hàm render */}
        {replies.length > 0 && (
          <div className="replies-list">
            {replies.map((reply) => renderCommentItem(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="comment-section">
      <h3>Bình luận ({comments.length})</h3>

      {/* Form bình luận chính (Gốc) */}
      <form onSubmit={(e) => handleSubmit(e, null)} className="comment-form">
        <div style={{ display: "flex", gap: "10px" }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              currentUser
                ? "Viết bình luận của bạn..."
                : "Vui lòng đăng nhập để bình luận..."
            }
            required
          />
          <button type="submit" disabled={loading}>
            <FaPaperPlane /> {loading ? "Gửi..." : "Gửi"}
          </button>
        </div>
      </form>

      <div className="comment-list">
        {rootComments.length > 0 ? (
          rootComments.map((cmt) => renderCommentItem(cmt))
        ) : (
          <p className="no-comments">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;

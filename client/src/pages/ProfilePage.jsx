import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaSave,
  FaPen,
  FaIdCard,
} from "react-icons/fa";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get("/users/profile");
      setUser(res.data);
      setFormData({
        full_name: res.data.full_name || "",
        phone: res.data.phone || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put("/users/profile", formData);
      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
      fetchProfile(); // Refresh data

      // Cập nhật lại localStorage để Header hiển thị đúng tên mới ngay lập tức
      const currentUser = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({ ...currentUser, full_name: formData.full_name }),
      );

      // Dispatch event để Header tự update (nếu cần thiết, hoặc reload trang)
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  if (loading) return <div className="profile-loading">Đang tải...</div>;
  if (!user)
    return (
      <div className="profile-error">Không tìm thấy thông tin người dùng.</div>
    );

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        <div className="profile-header-cover"></div>

        <div className="profile-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <FaUser size={40} color="#2e7d32" />
            </div>
            <h2 className="profile-name">{user.full_name}</h2>
            <span
              className={`profile-role-badge ${user.role === "admin" ? "admin" : ""}`}
            >
              {user.role}
            </span>
          </div>

          <div className="profile-divider"></div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ margin: 0, color: "#2e7d32" }}>Thông tin cá nhân</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="profile-edit-btn"
              >
                <FaPen size={12} /> Chỉnh sửa
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="profile-form-group">
                <label className="profile-form-label">
                  <FaIdCard /> Họ và tên (Full Name)
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="profile-form-input"
                  placeholder="Nhập họ và tên của bạn"
                  required
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">
                  <FaPhone /> Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="profile-form-input"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="profile-form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      full_name: user.full_name,
                      phone: user.phone,
                    });
                  }}
                  className="profile-btn-cancel"
                >
                  Hủy
                </button>
                <button type="submit" className="profile-btn-save">
                  <FaSave /> Lưu thay đổi
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <FaIdCard color="#888" size={20} />
                <div>
                  <small className="profile-info-label">Họ và tên</small>
                  <strong className="profile-info-value">
                    {user.full_name}
                  </strong>
                </div>
              </div>

              <div className="profile-info-item">
                <FaUser color="#888" size={18} />
                <div>
                  <small className="profile-info-label">Tên đăng nhập</small>
                  <strong className="profile-info-value">
                    {user.username}
                  </strong>
                </div>
              </div>

              <div className="profile-info-item">
                <FaEnvelope color="#888" size={18} />
                <div>
                  <small className="profile-info-label">Email</small>
                  <strong className="profile-info-value">{user.email}</strong>
                </div>
              </div>

              <div className="profile-info-item">
                <FaPhone color="#888" size={18} />
                <div>
                  <small className="profile-info-label">Số điện thoại</small>
                  <strong className="profile-info-value">
                    {user.phone || "Chưa cập nhật"}
                  </strong>
                </div>
              </div>

              <div className="profile-info-item">
                <FaCalendarAlt color="#888" size={18} />
                <div>
                  <small className="profile-info-label">Ngày tham gia</small>
                  <strong className="profile-info-value">
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

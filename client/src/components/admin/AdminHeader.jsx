import {
  FaBars,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient"; // Import để gọi API

const AdminHeader = ({
  isMobile,
  setIsSidebarOpen,
  showUserMenu,
  setShowUserMenu,
  handleLogout,
  title,
  breadcrumb,
}) => {
  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {
    full_name: "Admin",
  };

  // State cho thông báo
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Fetch thông báo
  const fetchNotifications = async () => {
    try {
      const res = await axiosClient.get("/notifications");
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error("Lỗi tải thông báo", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Có thể set interval để tự động cập nhật mỗi 30s
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRead = async (id) => {
    try {
      await axiosClient.put(`/notifications/${id}/read`);
      // Cập nhật lại UI local cho nhanh
      setNotifications(prev => prev.map(n => n.id === id ? {...n, is_read: 1} : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header
      style={{
        background: "#fff",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Left: Toggle & Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#333",
            }}
          >
            <FaBars />
          </button>
        )}
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", color: "#333" }}>
            {title}
          </h2>
          {breadcrumb && (
            <span style={{ fontSize: "12px", color: "#888" }}>
              {breadcrumb}
            </span>
          )}
        </div>
      </div>

      {/* Right: User Menu */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* --- NOTIFICATION AREA --- */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              color: "#666",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <FaBell />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "white",
                  fontSize: "10px",
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Thông báo */}
          {showNotifMenu && (
            <div style={{
              position: "absolute",
              top: "120%",
              right: "-50px",
              width: "300px",
              background: "white",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              border: "1px solid #eee",
              maxHeight: "400px",
              overflowY: "auto",
              zIndex: 101
            }}>
              <div style={{ padding: "10px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>Thông báo</div>
              {notifications.length === 0 ? (
                <div style={{ padding: "15px", textAlign: "center", color: "#888" }}>Không có thông báo</div>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {notifications.map(n => (
                    <li 
                      key={n.id} 
                      onClick={() => handleRead(n.id)}
                      style={{ 
                        padding: "10px", 
                        borderBottom: "1px solid #f5f5f5", 
                        background: n.is_read ? "white" : "#e8f5e9",
                        cursor: "pointer" 
                      }}
                    >
                      <div style={{ fontSize: "13px", color: "#333" }}>{n.message}</div>
                      <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                        {new Date(n.created_at).toLocaleString('vi-VN')}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <div
              style={{
                textAlign: "right",
                display: isMobile ? "none" : "block",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                {user.full_name}
              </span>
              <span style={{ fontSize: "12px", color: "#2e7d32" }}>
                {user.role === "admin" ? "Quản trị viên" : "Thành viên"}
              </span>
            </div>

            <FaUserCircle size={40} color="#ccc" />
          </div>

          {/* Dropdown Menu User */}
          {showUserMenu && (
            <div
              style={{
                position: "absolute",
                top: "120%",
                right: 0,
                background: "#fff",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                width: "200px",
                overflow: "hidden",
                border: "1px solid #eee",
                zIndex: 101
              }}
            >
              <div style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>
                  {user.full_name}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                  @{user.username}
                </p>
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                <li>
                  <Link
                    to="/admin/profile"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 15px",
                      textDecoration: "none",
                      color: "#333",
                      fontSize: "14px",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "#f5f5f5")
                    }
                    onMouseLeave={(e) => (e.target.style.background = "white")}
                  >
                    <FaCog /> Cài đặt tài khoản
                  </Link>
                </li>
                <li
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 15px",
                    color: "#d32f2f",
                    cursor: "pointer",
                    fontSize: "14px",
                    borderTop: "1px solid #eee",
                  }}
                >
                  <FaSignOutAlt /> Đăng xuất
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
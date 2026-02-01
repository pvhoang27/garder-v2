import {
  FaBars,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaSyncAlt, // Thêm icon reload thủ công
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient"; 

const AdminHeader = ({
  isMobile,
  setIsSidebarOpen,
  showUserMenu,
  setShowUserMenu,
  handleLogout,
  title,
  breadcrumb,
}) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {
    full_name: "Admin",
  };

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isLoadingNotif, setIsLoadingNotif] = useState(false); // State loading

  // Hàm tải thông báo
  const fetchNotifications = async () => {
    // Không set loading true để tránh nháy giao diện khi tự động cập nhật
    try {
      // Thêm Date.now() để tránh cache trình duyệt
      const res = await axiosClient.get(`/notifications?t=${Date.now()}`);
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error("Lỗi tải thông báo", error);
    } finally {
      setIsLoadingNotif(false);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Gọi ngay khi vào trang
    
    // --- CẬP NHẬT: GIẢM THỜI GIAN CHECK XUỐNG CÒN 5 GIÂY ---
    const interval = setInterval(fetchNotifications, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await axiosClient.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      await markAsRead(notif.id);
    }

    if (notif.entity_type && notif.entity_id) {
        if (notif.entity_type === 'plant') {
            window.open(`/plant/${notif.entity_id}`, '_blank');
        } else if (notif.entity_type === 'news') {
            window.open(`/news/${notif.entity_id}`, '_blank');
        }
    }
    setShowNotifMenu(false);
  };

  // Nút reload thủ công
  const handleManualRefresh = () => {
    setIsLoadingNotif(true);
    fetchNotifications();
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
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        {/* Nút Reload thủ công (nếu muốn check ngay lập tức) */}
        <button 
            onClick={handleManualRefresh}
            title="Làm mới thông báo"
            style={{
                background: "none",
                border: "none",
                color: isLoadingNotif ? "#2e7d32" : "#999",
                cursor: "pointer",
                fontSize: "16px",
                animation: isLoadingNotif ? "spin 1s linear infinite" : "none"
            }}
        >
            <FaSyncAlt />
        </button>

        {/* --- NOTIFICATION AREA --- */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px", // Tăng size icon chút
              color: "#666",
              cursor: "pointer",
              position: "relative",
              padding: "5px"
            }}
          >
            <FaBell />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  background: "red",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "bold",
                  minWidth: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #fff"
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Thông báo */}
          {showNotifMenu && (
            <div style={{
              position: "absolute",
              top: "120%",
              right: "-60px", // Căn chỉnh lại cho đẹp
              width: "350px",
              background: "white",
              boxShadow: "0 5px 25px rgba(0,0,0,0.15)",
              borderRadius: "8px",
              border: "1px solid #eee",
              maxHeight: "450px",
              overflowY: "auto",
              zIndex: 1000
            }}>
              <div style={{ 
                  padding: "15px", 
                  borderBottom: "1px solid #eee", 
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#f8f9fa"
              }}>
                  <span>Thông báo</span>
                  <span 
                    onClick={fetchNotifications} 
                    style={{fontSize: "12px", color: "#2e7d32", cursor: "pointer"}}
                  >
                      Làm mới
                  </span>
              </div>

              {notifications.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#888" }}>
                    <p style={{marginBottom: "5px"}}>🔕</p>
                    Không có thông báo mới
                </div>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {notifications.map(n => (
                    <li 
                      key={n.id} 
                      onClick={() => handleNotificationClick(n)}
                      style={{ 
                        padding: "12px 15px", 
                        borderBottom: "1px solid #f1f1f1", 
                        background: n.is_read ? "white" : "#e8f5e9",
                        cursor: "pointer",
                        transition: "background 0.2s",
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
                      onMouseLeave={(e) => e.currentTarget.style.background = n.is_read ? "white" : "#e8f5e9"}
                    >
                      <div style={{ fontSize: "14px", color: "#333", lineHeight: "1.4" }}>
                          {/* Highlight từ khoá quan trọng nếu cần */}
                          {n.message}
                      </div>
                      <div style={{ fontSize: "11px", color: "#999" }}>
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
      
      {/* CSS Animation cho icon refresh */}
      <style>{`
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
};

export default AdminHeader;
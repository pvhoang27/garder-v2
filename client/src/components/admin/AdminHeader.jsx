import {
  FaBars,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminHeader = ({
  isMobile,
  setIsSidebarOpen,
  showUserMenu,
  setShowUserMenu,
  handleLogout,
  title,
  breadcrumb,
}) => {
  // Lấy thông tin user từ localStorage để hiển thị tên
  const user = JSON.parse(localStorage.getItem("user")) || {
    full_name: "Admin",
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
        {/* Notification Icon (Demo) */}
        <button
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
            3
          </span>
        </button>

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

            {/* --- THAY THẾ ẢNH LỖI TẠI ĐÂY --- */}
            {/* Dùng Icon thay vì ảnh via.placeholder.com bị lỗi */}
            <FaUserCircle size={40} color="#ccc" />
          </div>

          {/* Dropdown Menu */}
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

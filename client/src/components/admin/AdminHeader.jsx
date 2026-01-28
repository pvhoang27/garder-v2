import {
  FaBars,
  FaUserCircle,
  FaBell,
  FaSearch,
  FaAngleDown,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminHeader = ({
  isMobile,
  setIsSidebarOpen,
  showUserMenu,
  setShowUserMenu,
  handleLogout,
  title,
  breadcrumb,
}) => {
  const styles = {
    headerDesktop: {
      background: "#ffffff",
      height: "70px",
      padding: "0 30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    },
    headerMobile: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "60px",
      background: "#1a1a1a",
      color: "white",
      zIndex: 900,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    },
    iconBtn: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: "#6c757d",
      padding: "8px",
      position: "relative",
      fontSize: "18px",
    },
    dropdownMenu: {
      position: "absolute",
      top: "100%",
      right: 0,
      width: "180px",
      background: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      borderRadius: "8px",
      padding: "8px 0",
      marginTop: "10px",
      display: showUserMenu ? "block" : "none",
      border: "1px solid #eee",
      zIndex: 1000,
    },
    dropdownItem: {
      padding: "10px 20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: "#333",
      textDecoration: "none",
      cursor: "pointer",
      fontSize: "14px",
    },
  };

  // --- MOBILE VIEW ---
  if (isMobile) {
    return (
      <div style={styles.headerMobile}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={{ ...styles.iconBtn, color: "white" }}
          >
            <FaBars />
          </button>
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>
            Garder Admin
          </span>
        </div>
        <div
          onClick={() => setShowUserMenu(!showUserMenu)}
          style={{ position: "relative" }}
        >
          <FaUserCircle size={24} />
          {showUserMenu && (
            <div
              style={{
                ...styles.dropdownMenu,
                right: "-10px",
                marginTop: "15px",
                color: "black",
              }}
            >
              <div style={styles.dropdownItem} onClick={handleLogout}>
                <FaSignOutAlt /> Đăng xuất
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- DESKTOP VIEW ---
  return (
    <header style={styles.headerDesktop}>
      {/* Title Section */}
      <div>
        <div style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>
          {breadcrumb}
        </div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#2c3e50",
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>

      {/* Actions Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Search */}
        <div style={{ position: "relative", color: "#888" }}>
          <FaSearch
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "14px",
            }}
          />
          <input
            placeholder="Tìm nhanh..."
            style={{
              padding: "8px 10px 8px 35px",
              borderRadius: "20px",
              border: "1px solid #e0e0e0",
              outline: "none",
              fontSize: "13px",
              background: "#f9f9f9",
              width: "200px",
            }}
          />
        </div>

        {/* Notification */}
        <button style={styles.iconBtn} title="Thông báo">
          <FaBell />
          <span
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              width: "8px",
              height: "8px",
              background: "red",
              borderRadius: "50%",
            }}
          ></span>
        </button>

        <div style={{ width: "1px", height: "30px", background: "#eee" }}></div>

        {/* User Profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={() => setShowUserMenu(!showUserMenu)}
          onMouseLeave={() => setShowUserMenu(false)}
          onMouseEnter={() => setShowUserMenu(true)}
        >
          <img
            src="https://via.placeholder.com/40"
            alt="Admin"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}
            >
              Admin
            </span>
            <span style={{ fontSize: "11px", color: "#888" }}>Super Admin</span>
          </div>
          <FaAngleDown size={12} color="#888" />

          {/* User Dropdown */}
          <div style={styles.dropdownMenu}>
            <div
              style={{
                ...styles.dropdownItem,
                color: "#d32f2f",
                borderTop: "1px solid #f0f0f0",
              }}
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Đăng xuất
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

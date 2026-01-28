import { useState, useEffect } from "react";
import {
  FaBars,
  FaUserCircle,
  FaBell,
  FaSearch,
  FaAngleDown,
  FaSignOutAlt,
  FaHeart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminPlantManager from "../components/AdminPlantManager";
import AdminCategoryManager from "../components/AdminCategoryManager";
import AdminUserManager from "../components/AdminUserManager";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("plants"); // plants | categories | users
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // --- RESIZE EVENT ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- HELPER: Lấy tiêu đề ---
  const getPageTitle = () => {
    switch (activeTab) {
      case "plants":
        return "Quản Lý Cây Cảnh";
      case "categories":
        return "Quản Lý Danh Mục";
      case "users":
        return "Quản Lý Người Dùng";
      default:
        return "Dashboard";
    }
  };

  // --- XỬ LÝ LOGOUT ---
  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // --- STYLES ---
  const styles = {
    wrapper: {
      display: "flex",
      minHeight: "100vh",
      background: "#f0f2f5",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    mainContent: {
      marginLeft: isMobile ? "0" : "250px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      transition: "margin 0.3s ease",
      width: isMobile ? "100%" : "calc(100% - 250px)", // Fix width calculation
    },
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
    pageTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#2c3e50",
      margin: 0,
    },
    breadcrumb: {
      fontSize: "13px",
      color: "#888",
      marginBottom: "4px",
    },
    iconBtn: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: "#6c757d",
      padding: "8px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background 0.2s",
      position: "relative",
    },
    userProfile: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
      padding: "5px 10px",
      borderRadius: "6px",
      transition: "background 0.2s",
      position: "relative",
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
      transition: "background 0.2s",
    },
    contentBody: {
      padding: isMobile ? "80px 15px 20px" : "30px", // Padding top lớn hơn ở mobile để tránh header che
      flex: 1, // Đẩy footer xuống dưới
      overflowX: "hidden", // Tránh vỡ layout ngang
    },
    footer: {
      background: "#fff",
      padding: "20px",
      textAlign: "center",
      fontSize: "13px",
      color: "#666",
      borderTop: "1px solid #e0e0e0",
      marginTop: "auto", // Quan trọng để footer luôn ở đáy nếu nội dung ngắn
    },
  };

  return (
    <div style={styles.wrapper}>
      {/* --- MOBILE HEADER --- */}
      {isMobile && (
        <div style={styles.headerMobile}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{
                ...styles.iconBtn,
                color: "white",
                fontSize: "20px",
                padding: 0,
              }}
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
      )}

      {/* --- OVERLAY --- */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* --- MAIN CONTENT --- */}
      <div style={styles.mainContent}>
        {/* --- DESKTOP HEADER --- */}
        {!isMobile && (
          <header style={styles.headerDesktop}>
            <div>
              <div style={styles.breadcrumb}>
                Admin /{" "}
                {activeTab === "plants"
                  ? "Cây cảnh"
                  : activeTab === "categories"
                    ? "Danh mục"
                    : "Người dùng"}
              </div>
              <h2 style={styles.pageTitle}>{getPageTitle()}</h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
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

              <button style={styles.iconBtn} title="Thông báo">
                <FaBell size={18} />
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

              <div
                style={{ width: "1px", height: "30px", background: "#eee" }}
              ></div>

              <div
                style={styles.userProfile}
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
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Admin
                  </span>
                  <span style={{ fontSize: "11px", color: "#888" }}>
                    Super Admin
                  </span>
                </div>
                <FaAngleDown
                  size={12}
                  color="#888"
                  style={{ marginLeft: "5px" }}
                />

                <div style={styles.dropdownMenu}>
                  <div
                    style={styles.dropdownItem}
                    onClick={() => alert("Tính năng đang phát triển")}
                  >
                    <FaUserCircle /> Hồ sơ
                  </div>
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
        )}

        {/* --- CONTENT BODY --- */}
        <div style={styles.contentBody}>
          {activeTab === "plants" && <AdminPlantManager isMobile={isMobile} />}
          {activeTab === "categories" && (
            <AdminCategoryManager isMobile={isMobile} />
          )}
          {activeTab === "users" && <AdminUserManager isMobile={isMobile} />}
        </div>

        {/* --- FOOTER --- */}
        <footer style={styles.footer}>
          <p>© {new Date().getFullYear()} Garder Admin Dashboard.</p>
          <p
            style={{
              marginTop: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            Made with <FaHeart color="red" /> by PVHoang27
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;

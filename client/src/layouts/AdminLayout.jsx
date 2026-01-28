import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { FaHeart } from "react-icons/fa";

const AdminLayout = ({
  children,
  activeTab,
  setActiveTab,
  title,
  breadcrumb,
}) => {
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

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

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
      width: isMobile ? "100%" : "calc(100% - 250px)",
    },
    contentBody: {
      padding: isMobile ? "80px 15px 20px" : "30px",
      flex: 1,
      overflowX: "hidden",
    },
    footer: {
      background: "#fff",
      padding: "20px",
      textAlign: "center",
      fontSize: "13px",
      color: "#666",
      borderTop: "1px solid #e0e0e0",
      marginTop: "auto",
    },
  };

  return (
    <div style={styles.wrapper}>
      {/* Overlay Mobile */}
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

      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Area */}
      <div style={styles.mainContent}>
        <AdminHeader
          isMobile={isMobile}
          setIsSidebarOpen={setIsSidebarOpen}
          showUserMenu={showUserMenu}
          setShowUserMenu={setShowUserMenu}
          handleLogout={handleLogout}
          title={title}
          breadcrumb={breadcrumb}
        />

        {/* Nội dung trang thay đổi ở đây */}
        <div style={styles.contentBody}>{children}</div>

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

export default AdminLayout;

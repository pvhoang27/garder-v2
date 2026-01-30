import { Link, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaList,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaLayerGroup,
  FaTimes,
  FaHome,
  FaNewspaper, // <--- Import icon báo chí
} from "react-icons/fa";

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  isMobile,
  isOpen,
  setIsOpen,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleMenuClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) setIsOpen(false);
  };

  const sidebarStyle = {
    width: "250px",
    background: "#1a1a1a",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    height: "100vh",
    zIndex: 1100,
    transition: "transform 0.3s ease-in-out",
    left: 0,
    top: 0,
    transform: isMobile
      ? isOpen
        ? "translateX(0)"
        : "translateX(-100%)"
      : "translateX(0)",
    boxShadow: isOpen ? "2px 0 10px rgba(0,0,0,0.5)" : "none",
  };

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#ccc",
    textDecoration: "none",
    padding: "12px 20px",
    transition: "0.3s",
    fontSize: "15px",
  };

  const btnLogoutStyle = {
    width: "100%",
    padding: "12px",
    background: "#d32f2f",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontSize: "15px",
  };

  return (
    <div style={sidebarStyle}>
      {/* --- HEADER SIDEBAR --- */}
      <div
        style={{
          padding: "20px",
          fontSize: "20px",
          fontWeight: "bold",
          borderBottom: "1px solid #333",
          color: "#4caf50",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "70px",
        }}
      >
        <Link
          to="/"
          title="Về trang chủ"
          style={{
            color: "#4caf50",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          onClick={() => isMobile && setIsOpen(false)}
        >
          <FaHome /> Trang Chủ
        </Link>

        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* --- MENU SCROLLABLE --- */}
      <nav style={{ flex: 1, padding: "20px 0", overflowY: "auto" }}>
        <MenuButton
          active={activeTab === "plants"}
          onClick={() => handleMenuClick("plants")}
          icon={<FaLeaf />}
          label="Quản lý Cây"
        />
        <MenuButton
          active={activeTab === "categories"}
          onClick={() => handleMenuClick("categories")}
          icon={<FaList />}
          label="Quản lý Danh mục"
        />
        {/* --- MỤC MỚI: TIN TỨC --- */}
        <MenuButton
          active={activeTab === "news"}
          onClick={() => handleMenuClick("news")}
          icon={<FaNewspaper />}
          label="Quản lý Tin tức"
        />
        
        <MenuButton
          active={activeTab === "users"}
          onClick={() => handleMenuClick("users")}
          icon={<FaUsers />}
          label="Quản lý Users"
        />

        <div
          style={{
            borderTop: "1px solid #333",
            marginTop: "10px",
            paddingTop: "10px",
          }}
        >
          <Link
            to="/admin/popup"
            style={linkStyle}
            onClick={() => isMobile && setIsOpen(false)}
          >
            <FaCog /> Cấu hình Popup
          </Link>
          <Link
            to="/admin/layout"
            style={linkStyle}
            onClick={() => isMobile && setIsOpen(false)}
          >
            <FaLayerGroup /> Bố cục Trang chủ
          </Link>
        </div>
      </nav>

      <div style={{ padding: "20px", borderTop: "1px solid #333" }}>
        <button onClick={handleLogout} style={btnLogoutStyle}>
          <FaSignOutAlt /> Đăng xuất
        </button>
      </div>
    </div>
  );
};

const MenuButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "15px 20px",
      background: active ? "#2e7d32" : "transparent",
      color: active ? "white" : "#ccc",
      border: "none",
      textAlign: "left",
      fontSize: "15px",
      cursor: "pointer",
      transition: "0.2s",
      borderLeft: active ? "4px solid #4caf50" : "4px solid transparent",
    }}
  >
    {icon} {label}
  </button>
);

export default AdminSidebar;
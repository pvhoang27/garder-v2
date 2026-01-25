import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlantDetail from "./pages/PlantDetail";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPlantForm from "./components/AdminPlantForm";
import ContactPage from "./pages/ContactPage";
import CategoryPage from "./pages/CategoryPage";
import AdminPopupConfig from "./pages/AdminPopupConfig"; // <--- Import trang cấu hình
import PopupBanner from "./components/PopupBanner"; // <--- Import Component Popup
import {
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

// ... (Giữ nguyên phần component Navigation như code trước) ...
const Navigation = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
    setIsMobileMenuOpen(false);
    alert("Đã đăng xuất thành công!");
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          🌿 Green Garden
        </Link>

        <div
          className="mobile-icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className={isMobileMenuOpen ? "nav-menu active" : "nav-menu"}>
          <Link to="/" className="nav-link" onClick={closeMenu}>
            Trang Chủ
          </Link>
          <Link to="/categories" className="nav-link" onClick={closeMenu}>
            Danh Mục
          </Link>
          <Link to="/contact" className="nav-link" onClick={closeMenu}>
            Liên Hệ
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/admin"
                className="nav-link nav-btn-admin"
                onClick={closeMenu}
              >
                Quản Trị
              </Link>
              <button
                onClick={handleLogoutClick}
                className="nav-link nav-btn-logout"
              >
                <FaSignOutAlt /> Thoát
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="nav-link nav-btn-login"
              onClick={closeMenu}
            >
              <FaSignInAlt /> Đăng Nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLoginSuccess = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      {/* Hiển thị Popup ở mọi nơi (nó sẽ tự ẩn nếu không active) */}
      <PopupBanner />

      <div style={{ minHeight: "80vh", paddingBottom: "50px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Routes Admin */}
          <Route
            path="/admin"
            element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/add"
            element={isLoggedIn ? <AdminPlantForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/edit/:id"
            element={isLoggedIn ? <AdminPlantForm /> : <Navigate to="/login" />}
          />

          {/* Route mới: Cấu hình Popup */}
          <Route
            path="/admin/popup"
            element={
              isLoggedIn ? <AdminPopupConfig /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>

      <footer
        style={{
          background: "#2c3e50",
          color: "white",
          textAlign: "center",
          padding: "30px",
          marginTop: "auto",
        }}
      >
        <h3>Green Garden Showcase</h3>
        <p style={{ opacity: 0.7, fontSize: "0.9rem", marginTop: "10px" }}>
          Địa chỉ: Vườn cây gia đình
          <br />
          Điện thoại: 0988.888.888
        </p>
        <p style={{ marginTop: "20px", fontSize: "0.8rem", opacity: 0.5 }}>
          © 2026 Developed by You
        </p>
      </footer>
    </BrowserRouter>
  );
}

export default App;

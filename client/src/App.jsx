import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
  useLocation, // <--- Thêm hook này để kiểm tra đường dẫn
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlantDetail from "./pages/PlantDetail";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPlantForm from "./components/AdminPlantForm";
import ContactPage from "./pages/ContactPage";
import CategoryPage from "./pages/CategoryPage";
import NewsPage from "./pages/NewsPage";
import AdminPopupConfig from "./pages/AdminPopupConfig";
import AdminLayoutConfig from "./pages/AdminLayoutConfig";
import PopupBanner from "./components/PopupBanner";
import { FaSignOutAlt, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";

// Component Navigation
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
          <Link to="/news" className="nav-link" onClick={closeMenu}>
            Tin Tức
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

// --- COMPONENT CONTENT WRAPPER (MỚI) ---
// Tạo component này để dùng được useLocation bên trong BrowserRouter
const AppContent = ({ isLoggedIn, handleLoginSuccess, handleLogout }) => {
  const location = useLocation();

  // Kiểm tra xem có đang ở trang admin không (bắt đầu bằng /admin)
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Chỉ hiện Navigation nếu KHÔNG PHẢI trang admin */}
      {!isAdminRoute && (
        <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      )}

      <PopupBanner />

      {/* Điều chỉnh padding nếu là trang Admin thì full màn hình, không cần padding bottom */}
      <div
        style={{
          minHeight: "80vh",
          paddingBottom: isAdminRoute ? "0" : "50px",
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Admin Routes */}
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
          <Route
            path="/admin/popup"
            element={
              isLoggedIn ? <AdminPopupConfig /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/layout"
            element={
              isLoggedIn ? <AdminLayoutConfig /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>

      {/* Chỉ hiện Footer nếu KHÔNG PHẢI trang admin */}
      {!isAdminRoute && (
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
      )}
    </>
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
      {/* Chuyển toàn bộ nội dung vào AppContent để xử lý logic ẩn hiện Header/Footer */}
      <AppContent
        isLoggedIn={isLoggedIn}
        handleLoginSuccess={handleLoginSuccess}
        handleLogout={handleLogout}
      />
    </BrowserRouter>
  );
}

export default App;

import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
  useLocation, 
} from "react-router-dom";
import { useTranslation } from "react-i18next"; 

import HomePage from "./pages/HomePage";
import PlantDetail from "./pages/PlantDetail";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"; // Import trang đăng ký
import AdminDashboard from "./pages/AdminDashboard";
import AdminPlantForm from "./components/AdminPlantForm";
import ContactPage from "./pages/ContactPage";
import CategoryPage from "./pages/CategoryPage";
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./pages/NewsDetail";
import AdminPopupConfig from "./pages/AdminPopupConfig";
import AdminLayoutConfig from "./pages/AdminLayoutConfig";
import PopupBanner from "./components/PopupBanner";
import LanguageSwitcher from "./components/LanguageSwitcher"; 
import FloatingContact from "./components/FloatingContact"; 
import Footer from "./components/Footer"; 

// --- IMPORT LOGO ---
import logo from "./assets/logo.png";

import { FaSignOutAlt, FaSignInAlt, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

// Component Navigation
const Navigation = ({ isLoggedIn, userRole, onLogout }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation(); 

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
    setIsMobileMenuOpen(false);
    alert(t("common.success_logout"));
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* --- THAY THẾ LOGO TẠI ĐÂY --- */}
        <Link to="/" className="nav-logo" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={logo} 
            alt="Green Garden Logo" 
            style={{ height: '40px', width: 'auto', objectFit: 'contain' }} 
          />
          <span>{t("nav.brand")}</span>
        </Link>
        
        <div
          className="mobile-icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className={isMobileMenuOpen ? "nav-menu active" : "nav-menu"}>
          <Link to="/" className="nav-link" onClick={closeMenu}>
            {t("nav.home")}
          </Link>
          <Link to="/categories" className="nav-link" onClick={closeMenu}>
            {t("nav.categories")}
          </Link>
          <Link to="/news" className="nav-link" onClick={closeMenu}>
            {t("nav.news")}
          </Link>
          <Link to="/contact" className="nav-link" onClick={closeMenu}>
            {t("nav.contact")}
          </Link>

          {isLoggedIn ? (
            <>
              {/* Chỉ hiện nút Admin nếu Role là admin */}
              {userRole === 'admin' && (
                <Link
                  to="/admin"
                  className="nav-link nav-btn-admin"
                  onClick={closeMenu}
                >
                  {t("nav.admin")}
                </Link>
              )}
              
              {/* Hiển thị Avatar/Logout cho mọi user đã login */}
              <button
                onClick={handleLogoutClick}
                className="nav-link nav-btn-logout"
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <FaSignOutAlt /> {t("nav.logout")}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="nav-link nav-btn-login"
              onClick={closeMenu}
            >
              <FaSignInAlt /> {t("nav.login")}
            </Link>
          )}
          
          <div className="nav-link" style={{display: 'flex', alignItems: 'center'}}>
             <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- COMPONENT CONTENT WRAPPER ---
const AppContent = ({ isLoggedIn, userRole, handleLoginSuccess, handleLogout }) => {
  const location = useLocation();
  const { t } = useTranslation(); 

  // Kiểm tra xem có đang ở trang admin không (bắt đầu bằng /admin)
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Component bảo vệ Route Admin
  const AdminRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    if (userRole !== 'admin') {
      // Nếu login rồi mà không phải admin thì đá về trang chủ
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <>
      {/* Chỉ hiện Navigation nếu KHÔNG PHẢI trang admin */}
      {!isAdminRoute && (
        <Navigation isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />
      )}

      {/* Popup quảng cáo */}
      <PopupBanner />

      {/* HIỂN THỊ NÚT LIÊN HỆ NỔI */}
      {!isAdminRoute && <FloatingContact />}

      {/* Điều chỉnh padding nếu là trang Admin thì full màn hình, không cần padding bottom */}
      <div
        style={{
          minHeight: "80vh",
          paddingBottom: isAdminRoute ? "0" : "0", 
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoryPage />} />
          
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetail />} />

          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          {/* Thêm Route Đăng ký */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes - BẢO VỆ NGHIÊM NGẶT */}
          <Route
            path="/admin"
            element={<AdminRoute><AdminDashboard /></AdminRoute>}
          />
          <Route
            path="/admin/add"
            element={<AdminRoute><AdminPlantForm /></AdminRoute>}
          />
          <Route
            path="/admin/edit/:id"
            element={<AdminRoute><AdminPlantForm /></AdminRoute>}
          />
          <Route
            path="/admin/popup"
            element={<AdminRoute><AdminPopupConfig /></AdminRoute>}
          />
          <Route
            path="/admin/layout"
            element={<AdminRoute><AdminLayoutConfig /></AdminRoute>}
          />
        </Routes>
      </div>

      {/* Thay thế Footer cũ bằng Component Footer mới */}
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // Thêm state Role

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      setIsLoggedIn(true);
      setUserRole(user.role || 'customer');
    }
  }, []);

  // Hàm này giờ nhận vào user object để update role
  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUserRole(user?.role || 'customer');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <BrowserRouter>
      <AppContent
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        handleLoginSuccess={handleLoginSuccess}
        handleLogout={handleLogout}
      />
    </BrowserRouter>
  );
}

export default App;
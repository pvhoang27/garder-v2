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
import AdminDashboard from "./pages/AdminDashboard";
import AdminPlantForm from "./components/AdminPlantForm";
import ContactPage from "./pages/ContactPage";
import CategoryPage from "./pages/CategoryPage";
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./pages/NewsDetail"; // <--- MỚI: Import trang chi tiết tin tức
import AdminPopupConfig from "./pages/AdminPopupConfig";
import AdminLayoutConfig from "./pages/AdminLayoutConfig";
import PopupBanner from "./components/PopupBanner";
import LanguageSwitcher from "./components/LanguageSwitcher"; 
import FloatingContact from "./components/FloatingContact"; 

import { FaSignOutAlt, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";

// Component Navigation
const Navigation = ({ isLoggedIn, onLogout }) => {
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
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          🌿 {t("nav.brand")}
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
              <Link
                to="/admin"
                className="nav-link nav-btn-admin"
                onClick={closeMenu}
              >
                {t("nav.admin")}
              </Link>
              <button
                onClick={handleLogoutClick}
                className="nav-link nav-btn-logout"
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
const AppContent = ({ isLoggedIn, handleLoginSuccess, handleLogout }) => {
  const location = useLocation();
  const { t } = useTranslation(); 

  // Kiểm tra xem có đang ở trang admin không (bắt đầu bằng /admin)
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Chỉ hiện Navigation nếu KHÔNG PHẢI trang admin */}
      {!isAdminRoute && (
        <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      )}

      {/* Popup quảng cáo */}
      <PopupBanner />

      {/* HIỂN THỊ NÚT LIÊN HỆ NỔI (chỉ hiện cho khách, admin có thể ẩn nếu muốn) */}
      {!isAdminRoute && <FloatingContact />}

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
          
          {/* ROUTE TIN TỨC */}
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetail />} /> {/* <--- MỚI: Route chi tiết tin tức */}

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
            {t("home.footer_address")}
            <br />
            {t("home.footer_phone")}
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
      <AppContent
        isLoggedIn={isLoggedIn}
        handleLoginSuccess={handleLoginSuccess}
        handleLogout={handleLogout}
      />
    </BrowserRouter>
  );
}

export default App;
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
import RegisterPage from "./pages/RegisterPage";
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { t } = useTranslation(); 

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
    alert(t("common.success_logout"));
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="nav-logo" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ height: '40px', width: 'auto', objectFit: 'contain' }} 
          />
          <span style={{ whiteSpace: 'nowrap' }}>{t("nav.brand")}</span>
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
              {userRole === 'admin' && (
                <Link
                  to="/admin"
                  className="nav-link nav-btn-admin"
                  onClick={closeMenu}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {t("nav.admin")}
                </Link>
              )}
              
              {/* --- USER PROFILE MENU --- */}
              <div style={{ position: 'relative', marginLeft: isMobileMenuOpen ? '0' : '10px' }}>
                <div 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: '20px',
                    background: showUserMenu ? '#f0f0f0' : 'transparent',
                    userSelect: 'none',
                    border: '1px solid transparent',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => !showUserMenu && (e.currentTarget.style.background = 'transparent')}
                >
                   <FaUserCircle size={24} color="#2e7d32" />
                   {/* Ẩn tên trên màn hình nhỏ nếu cần, hoặc để flex-shrink */}
                   <span className="user-name-display" style={{ fontWeight: '600', color: '#333', fontSize: '14px', whiteSpace: 'nowrap' }}>
                      {user.full_name || "Thành viên"}
                   </span>
                </div>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: isMobileMenuOpen ? 'auto' : '0',
                    left: isMobileMenuOpen ? '0' : 'auto',
                    width: '220px',
                    background: 'white',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #eee',
                    zIndex: 1000
                  }}>
                    <div style={{ padding: '15px', borderBottom: '1px solid #eee', background: '#f9f9f9' }}>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.full_name}
                      </p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666' }}>
                        @{user.username || 'user'}
                      </p>
                    </div>

                    <div 
                      onClick={handleLogoutClick}
                      style={{
                        padding: '12px 15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#d32f2f',
                        cursor: 'pointer',
                        fontSize: '14px',
                        background: 'white'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#ffebee'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <FaSignOutAlt /> {t("nav.logout")}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="nav-link nav-btn-login"
              onClick={closeMenu}
              style={{ whiteSpace: 'nowrap' }}
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
  const isAdminRoute = location.pathname.startsWith("/admin");

  const AdminRoute = ({ children }) => {
    if (!isLoggedIn) return <Navigate to="/login" />;
    if (userRole !== 'admin') return <Navigate to="/" />;
    return children;
  };

  return (
    <>
      {!isAdminRoute && (
        <Navigation isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} />
      )}

      <PopupBanner />
      {!isAdminRoute && <FloatingContact />}

      {/* FIX: Thêm width: 100% để tránh bị co layout */}
      <div
        style={{
          minHeight: "80vh",
          paddingBottom: isAdminRoute ? "0" : "0", 
          width: "100%", 
          boxSizing: "border-box"
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/add" element={<AdminRoute><AdminPlantForm /></AdminRoute>} />
          <Route path="/admin/edit/:id" element={<AdminRoute><AdminPlantForm /></AdminRoute>} />
          <Route path="/admin/popup" element={<AdminRoute><AdminPopupConfig /></AdminRoute>} />
          <Route path="/admin/layout" element={<AdminRoute><AdminLayoutConfig /></AdminRoute>} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      const user = JSON.parse(userStr);
      setIsLoggedIn(true);
      setUserRole(user.role || 'customer');
    }
  }, []);

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
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation, 
} from "react-router-dom";

// --- IMPORT CÁC TRANG (PAGES) ---
import HomePage from "./pages/HomePage";
import PlantDetail from "./pages/PlantDetail";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; // <--- ĐÃ THÊM IMPORT
import AdminDashboard from "./pages/AdminDashboard";
import AdminPlantForm from "./components/AdminPlantForm";
import ContactPage from "./pages/ContactPage";
import CategoryPage from "./pages/CategoryPage";
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./pages/NewsDetail";
import AdminPopupConfig from "./pages/AdminPopupConfig";
import AdminLayoutConfig from "./pages/AdminLayoutConfig";

// --- IMPORT COMPONENTS ---
import PopupBanner from "./components/PopupBanner";
import FloatingContact from "./components/FloatingContact"; 
import Footer from "./components/Footer"; 
import Header from "./components/Header"; 

// --- COMPONENT CONTENT WRAPPER ---
const AppContent = ({ isLoggedIn, userRole, handleLoginSuccess, handleLogout }) => {
  const location = useLocation();

  // Kiểm tra xem có đang ở trang admin không (bắt đầu bằng /admin)
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Component bảo vệ Route Admin
  const AdminRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    if (userRole !== 'admin') {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <>
      {/* Chỉ hiện Header nếu KHÔNG PHẢI trang admin */}
      {!isAdminRoute && (
        <Header 
            isLoggedIn={isLoggedIn} 
            userRole={userRole} 
            onLogout={handleLogout} 
        />
      )}

      {/* Popup quảng cáo */}
      <PopupBanner />

      {/* Nút liên hệ nổi */}
      {!isAdminRoute && <FloatingContact />}

      <div
        style={{
          minHeight: "80vh",
          paddingBottom: isAdminRoute ? "0" : "0", 
          width: "100%", 
          boxSizing: "border-box"
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
          <Route path="/register" element={<RegisterPage />} />
          
          {/* --- ĐÃ THÊM ROUTE QUÊN MẬT KHẨU --- */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Admin Routes */}
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
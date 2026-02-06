import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation, 
} from "react-router-dom";

// --- IMPORT CÁC TRANG (PAGES) ---
// SỬA DÒNG NÀY: Trỏ thẳng vào file index trong thư mục HomePage
import HomePage from "./pages/HomePage/index";

import PlantDetail from "./pages/PlantDetail";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPlantForm from "./components/AdminPlantForm";
import ContactPage from "./pages/ContactPage";
import CategoryPage from "./pages/CategoryPage";
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./pages/NewsDetail";
import AdminPopupConfig from "./pages/AdminPopupConfig";
import AdminLayoutConfig from "./pages/AdminLayoutConfig";
import ProfilePage from "./pages/ProfilePage"; // [MỚI]

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

  // [MỚI] Component bảo vệ Route yêu cầu đăng nhập (cho Profile)
  const PrivateRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
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
          
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* [MỚI] Profile Route */}
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

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
    const token = localStorage.getItem("token"); // Hoặc check cookie nếu cần
    const userStr = localStorage.getItem("user");
    
    // Lưu ý: Logic check token đơn giản này có thể không hoàn hảo nếu dùng httpOnly cookie,
    // nhưng giữ nguyên theo logic hiện tại của bạn để tránh break app.
    if (userStr) {
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
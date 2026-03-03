import { Routes, Route, Navigate } from "react-router-dom";

// --- IMPORT CÁC TRANG (PAGES) ---
import HomePage from "../pages/HomePage/index";
import PlantDetail from "../pages/PlantDetail";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import AdminDashboard from "../pages/AdminDashboard";
import AdminPlantForm from "../components/AdminPlantForm";
import ContactPage from "../pages/ContactPage";
import CategoryPage from "../pages/CategoryPage";
import NewsPage from "../pages/NewsPage";
import NewsDetail from "../pages/NewsDetail";
import AdminPopupConfig from "../pages/AdminPopupConfig";
import AdminLayoutConfig from "../pages/AdminLayoutConfig";
import ProfilePage from "../pages/ProfilePage";

// Component bảo vệ Route Admin
const AdminRoute = ({ children, isLoggedIn, userRole }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  if (userRole !== "admin") {
    return <Navigate to="/" />;
  }
  return children;
};

// Component bảo vệ Route yêu cầu đăng nhập (cho Profile)
const PrivateRoute = ({ children, isLoggedIn }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AppRoutes = ({ isLoggedIn, userRole, handleLoginSuccess }) => {
  return (
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

      {/* Profile Route */}
      <Route
        path="/profile"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminDashboard initialTab="dashboard" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/tracking"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminDashboard initialTab="tracking" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/tracking-social"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminDashboard initialTab="trackingSocial" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/tracking-popup"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminDashboard initialTab="trackingPopup" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/tracking-location"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminDashboard initialTab="trackingLocation" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/tracking-search"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminDashboard initialTab="trackingSearch" />
          </AdminRoute>
        }
      />
      {/* --- [MỚI] Thêm Route cho Tracking thời gian xem cây --- */}
      <Route
        path="/admin/tracking-plant"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminDashboard initialTab="trackingPlant" />
          </AdminRoute>
        }
      />
      {/* ------------ */}
      <Route
        path="/admin/plants"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminDashboard initialTab="plants" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminDashboard initialTab="categories" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/news"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminDashboard initialTab="news" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/comments"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminDashboard initialTab="comments" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminDashboard initialTab="users" />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/add"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminPlantForm />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/edit/:id"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminPlantForm />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/popup"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminPopupConfig />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/layout"
        element={
          <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
            <AdminLayoutConfig />
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

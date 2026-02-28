import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// [MỚI] Import axiosClient để gọi API tracking
import axiosClient from "./api/axiosClient";

// --- IMPORT CÁC TRANG (PAGES) ---
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
import ProfilePage from "./pages/ProfilePage";

// --- IMPORT COMPONENTS ---
import PopupBanner from "./components/PopupBanner";
import FloatingContact from "./components/FloatingContact";
import Footer from "./components/Footer";
import Header from "./components/Header";

// --- COMPONENT CONTENT WRAPPER ---
const AppContent = ({
  isLoggedIn,
  userRole,
  handleLoginSuccess,
  handleLogout,
}) => {
  const location = useLocation();

  // Kiểm tra xem có đang ở trang admin không (bắt đầu bằng /admin)
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Effect để tracking lượt truy cập
  useEffect(() => {
    const trackVisit = async () => {
      if (!location.pathname.startsWith("/admin")) {
        try {
          await axiosClient.post("/tracking/visit");
          console.log("Visit logged");
        } catch (error) {
          console.warn("Tracking skipped:", error.message);
        }
      }
    };
    trackVisit();
  }, []); 

  // Effect yêu cầu chia sẻ vị trí mỗi 6 tháng (Gọi thẳng Native Popup của trình duyệt)
  useEffect(() => {
    if (!location.pathname.startsWith("/admin")) {
      const requestLocation = () => {
        const lastPrompt = localStorage.getItem("lastLocationPrompt");
        const now = Date.now();
        const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;

        // Nếu chưa từng hỏi HOẶC đã trôi qua hơn 6 tháng
        if (!lastPrompt || now - parseInt(lastPrompt, 10) > SIX_MONTHS_MS) {
          if ("geolocation" in navigator) {
            // Yêu cầu trình duyệt cấp quyền vị trí thực sự (sẽ hiện popup mặc định ở góc trái Chrome)
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;
                // Gọi API để gửi data xuống DB
                try {
                  await axiosClient.post("/tracking-location/visit", { latitude, longitude });
                } catch (error) {
                  console.error("Lỗi khi gửi vị trí:", error);
                }
                // Lưu mốc thời gian đã xử lý
                localStorage.setItem("lastLocationPrompt", Date.now().toString());
              },
              (error) => {
                console.warn("Khách hàng từ chối trên trình duyệt hoặc lỗi:", error.message);
                // Dù từ chối cũng lưu lại để 6 tháng sau mới làm phiền lại
                localStorage.setItem("lastLocationPrompt", Date.now().toString());
              }
            );
          } else {
            console.warn("Trình duyệt không hỗ trợ Geolocation.");
          }
        }
      };

      // Đợi trang load xong khoảng 1.5s thì mới gọi để tránh giật lag lúc mới vào trang
      setTimeout(requestLocation, 1500);
    }
  }, []);

  // Component bảo vệ Route Admin
  const AdminRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    if (userRole !== "admin") {
      return <Navigate to="/" />;
    }
    return children;
  };

  // Component bảo vệ Route yêu cầu đăng nhập (cho Profile)
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
          boxSizing: "border-box",
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

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard initialTab="dashboard" />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/tracking"
            element={
              <AdminRoute>
                <AdminDashboard initialTab="tracking" />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/tracking-social"
            element={
              <AdminRoute>
                <AdminDashboard initialTab="trackingSocial" />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/tracking-popup"
            element={
              <AdminRoute>
                <AdminDashboard initialTab="trackingPopup" />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/tracking-location"
            element={
              <AdminRoute>
                <AdminDashboard initialTab="trackingLocation" />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/plants"
            element={
              <AdminRoute>
                <AdminDashboard initialTab="plants" />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AdminDashboard initialTab="categories" />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/news"
            element={
              <AdminRoute>
                <AdminDashboard initialTab="news" />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/comments"
            element={
              <AdminRoute>
                <AdminDashboard initialTab="comments" />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminDashboard initialTab="users" />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/add"
            element={
              <AdminRoute>
                <AdminPlantForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <AdminRoute>
                <AdminPlantForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/popup"
            element={
              <AdminRoute>
                <AdminPopupConfig />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/layout"
            element={
              <AdminRoute>
                <AdminLayoutConfig />
              </AdminRoute>
            }
          />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await axiosClient.get("/auth/verify");

        if (res.data.isAuthenticated) {
          setIsLoggedIn(true);
          setUserRole(res.data.user.role);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } catch (error) {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserRole(null);
      } finally {
        setIsAuthChecking(false);
      }
    };

    verifyAuth();
  }, []);

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUserRole(user?.role || "customer");
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (error) {
      console.warn("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUserRole(null);
    }
  };

  if (isAuthChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Đang kiểm tra đăng nhập...
      </div>
    );
  }

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
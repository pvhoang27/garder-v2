import { useLocation } from "react-router-dom";

import useTracking from "../hooks/useTracking";
import AppRoutes from "../routes/AppRoutes";

// --- IMPORT COMPONENTS ---
import PopupBanner from "./PopupBanner";
import FloatingContact from "./FloatingContact";
import Footer from "./Footer";
import Header from "./Header";

const AppContent = ({
  isLoggedIn,
  userRole,
  handleLoginSuccess,
  handleLogout,
}) => {
  const location = useLocation();

  // Kiểm tra xem có đang ở trang admin không (bắt đầu bằng /admin)
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Gọi hook tracking (visit + location)
  useTracking();

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
        <AppRoutes
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          handleLoginSuccess={handleLoginSuccess}
        />
      </div>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default AppContent;

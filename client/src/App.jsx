import { BrowserRouter } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import AppContent from "./components/AppContent";

function App() {
  const {
    isLoggedIn,
    userRole,
    isAuthChecking,
    handleLoginSuccess,
    handleLogout,
  } = useAuth();

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

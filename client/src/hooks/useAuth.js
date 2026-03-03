import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const useAuth = () => {
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

  return {
    isLoggedIn,
    userRole,
    isAuthChecking,
    handleLoginSuccess,
    handleLogout,
  };
};

export default useAuth;

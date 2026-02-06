import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaSignOutAlt,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaCog,
  FaUser,
} from "react-icons/fa";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../assets/logo.png"; // Lưu ý đường dẫn import logo (lên 1 cấp cha)

const Header = ({ isLoggedIn, userRole, onLogout }) => {
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
    // alert(t("common.success_logout"));
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link
          to="/"
          className="nav-logo"
          onClick={closeMenu}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ height: "40px", width: "auto", objectFit: "contain" }}
          />
          <span style={{ whiteSpace: "nowrap" }}>{t("nav.brand")}</span>
        </Link>

        {/* Mobile Toggle Button */}
        <div
          className="mobile-icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Menu Items */}
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
              {/* User Profile Dropdown */}
              <div
                style={{
                  position: "relative",
                  marginLeft: isMobileMenuOpen ? "0" : "10px",
                }}
              >
                <div
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "6px 10px",
                    borderRadius: "20px",
                    background: showUserMenu ? "#f0f0f0" : "transparent",
                    userSelect: "none",
                    border: "1px solid transparent",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    !showUserMenu &&
                    (e.currentTarget.style.background = "transparent")
                  }
                  title={user.full_name || "Tài khoản"}
                >
                  <FaUserCircle size={24} color="#2e7d32" />
                </div>

                {showUserMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: "120%",
                      right: isMobileMenuOpen ? "auto" : "0",
                      left: isMobileMenuOpen ? "0" : "auto",
                      width: "220px",
                      background: "white",
                      boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #eee",
                      zIndex: 1000,
                    }}
                  >
                    <div
                      style={{
                        padding: "15px",
                        borderBottom: "1px solid #eee",
                        background: "#f9f9f9",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontWeight: "bold",
                          fontSize: "14px",
                          color: "#333",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user.full_name}
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        @{user.username || "user"}
                      </p>
                    </div>

                    {/* [MỚI] Link trang cá nhân */}
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px 15px",
                        textDecoration: "none",
                        color: "#333",
                        fontSize: "14px",
                        background: "white",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f5f5f5")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "white")
                      }
                    >
                      <FaUser /> Trang cá nhân
                    </Link>

                    {/* MỤC QUẢN TRỊ (Chỉ hiện nếu là admin) */}
                    {userRole === "admin" && (
                      <Link
                        to="/admin"
                        onClick={closeMenu}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "12px 15px",
                          textDecoration: "none",
                          color: "#333",
                          fontSize: "14px",
                          background: "white",
                          borderBottom: "1px solid #eee", // Ngăn cách với nút đăng xuất
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f5f5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "white")
                        }
                      >
                        <FaCog /> {t("nav.admin")}
                      </Link>
                    )}

                    <div
                      onClick={handleLogoutClick}
                      style={{
                        padding: "12px 15px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        color: "#d32f2f",
                        cursor: "pointer",
                        fontSize: "14px",
                        background: "white",
                        borderTop:
                          userRole !== "admin" ? "1px solid #eee" : "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#ffebee")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "white")
                      }
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
              style={{ whiteSpace: "nowrap" }}
            >
              <FaSignInAlt /> {t("nav.login")}
            </Link>
          )}

          <div
            className="nav-link"
            style={{ display: "flex", alignItems: "center" }}
          >
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

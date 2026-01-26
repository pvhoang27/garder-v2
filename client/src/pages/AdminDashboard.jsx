import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import AdminPlantManager from "../components/AdminPlantManager";
import AdminCategoryManager from "../components/AdminCategoryManager";
import AdminUserManager from "../components/AdminUserManager";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("plants"); // plants | categories | users
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- RESIZE EVENT ---
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mainContentStyle = {
    marginLeft: isMobile ? "0" : "250px",
    flex: 1,
    padding: "30px",
    paddingTop: isMobile ? "80px" : "30px",
    transition: "0.3s",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f8" }}>
      {/* --- MOBILE HEADER --- */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "60px",
            background: "#1a1a1a",
            color: "white",
            zIndex: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{ background: "none", border: "none", color: "white", fontSize: "24px", cursor: "pointer" }}
            >
              <FaBars />
            </button>
            Garder Admin
          </div>
        </div>
      )}

      {/* --- OVERLAY --- */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.5)", zIndex: 999,
          }}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* --- MAIN CONTENT --- */}
      <div style={mainContentStyle}>
        {activeTab === "plants" && <AdminPlantManager isMobile={isMobile} />}
        {activeTab === "categories" && <AdminCategoryManager />}
        {activeTab === "users" && <AdminUserManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;
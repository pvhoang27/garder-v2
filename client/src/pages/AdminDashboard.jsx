import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AdminPlantManager from "../components/AdminPlantManager";
import AdminCategoryManager from "../components/AdminCategoryManager";
import AdminUserManager from "../components/AdminUserManager";
import AdminNewsManager from "../components/AdminNewsManager";
import AdminCommentManager from "../components/AdminCommentManager"; 
import AdminStats from "../components/AdminStats"; // <--- Import Component Thống kê

const AdminDashboard = () => {
  // Mặc định vào là thấy thống kê ngay
  const [activeTab, setActiveTab] = useState("dashboard"); 

  // --- HELPER: Lấy tiêu đề ---
  const getPageInfo = () => {
    switch (activeTab) {
      case "dashboard": return { title: "Tổng Quan", breadcrumb: "Admin / Thống kê" }; // <--- Case mới
      case "plants": return { title: "Quản Lý Cây Cảnh", breadcrumb: "Admin / Cây cảnh" };
      case "categories": return { title: "Quản Lý Danh Mục", breadcrumb: "Admin / Danh mục" };
      case "users": return { title: "Quản Lý Người Dùng", breadcrumb: "Admin / Người dùng" };
      case "news": return { title: "Quản Lý Tin Tức", breadcrumb: "Admin / Tin tức" };
      case "comments": return { title: "Quản Lý Bình Luận", breadcrumb: "Admin / Bình luận" }; 
      default: return { title: "Dashboard", breadcrumb: "Admin / Dashboard" };
    }
  };

  const { title, breadcrumb } = getPageInfo();
  const isMobile = window.innerWidth < 1024; 

  return (
    <AdminLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      title={title}
      breadcrumb={breadcrumb}
    >
        {activeTab === "dashboard" && <AdminStats />} {/* <--- Render Thống kê */}
        {activeTab === "plants" && <AdminPlantManager isMobile={isMobile} />}
        {activeTab === "categories" && <AdminCategoryManager isMobile={isMobile} />}
        {activeTab === "users" && <AdminUserManager isMobile={isMobile} />}
        {activeTab === "news" && <AdminNewsManager isMobile={isMobile} />}
        {activeTab === "comments" && <AdminCommentManager />} 
    </AdminLayout>
  );
};

export default AdminDashboard;
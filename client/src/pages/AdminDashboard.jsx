import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AdminPlantManager from "../components/AdminPlantManager";
import AdminCategoryManager from "../components/AdminCategoryManager";
import AdminUserManager from "../components/AdminUserManager";
import AdminNewsManager from "../components/AdminNewsManager"; // <--- Import mới

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("plants"); // plants | categories | users | news

  // --- HELPER: Lấy tiêu đề ---
  const getPageInfo = () => {
    switch (activeTab) {
      case "plants": return { title: "Quản Lý Cây Cảnh", breadcrumb: "Admin / Cây cảnh" };
      case "categories": return { title: "Quản Lý Danh Mục", breadcrumb: "Admin / Danh mục" };
      case "users": return { title: "Quản Lý Người Dùng", breadcrumb: "Admin / Người dùng" };
      case "news": return { title: "Quản Lý Tin Tức", breadcrumb: "Admin / Tin tức" }; // <--- Case mới
      default: return { title: "Dashboard", breadcrumb: "Admin / Dashboard" };
    }
  };

  const { title, breadcrumb } = getPageInfo();
  // Giả lập check mobile
  const isMobile = window.innerWidth < 1024; 

  return (
    <AdminLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      title={title}
      breadcrumb={breadcrumb}
    >
        {activeTab === "plants" && <AdminPlantManager isMobile={isMobile} />}
        {activeTab === "categories" && <AdminCategoryManager isMobile={isMobile} />}
        {activeTab === "users" && <AdminUserManager isMobile={isMobile} />}
        {activeTab === "news" && <AdminNewsManager isMobile={isMobile} />} {/* <--- Render component mới */}
    </AdminLayout>
  );
};

export default AdminDashboard;
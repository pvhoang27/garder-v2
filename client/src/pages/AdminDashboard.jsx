import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import AdminPlantManager from "../components/AdminPlantManager";
import AdminCategoryManager from "../components/AdminCategoryManager";
import AdminUserManager from "../components/AdminUserManager";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("plants"); // plants | categories | users

  // --- HELPER: Lấy tiêu đề ---
  const getPageInfo = () => {
    switch (activeTab) {
      case "plants": return { title: "Quản Lý Cây Cảnh", breadcrumb: "Admin / Cây cảnh" };
      case "categories": return { title: "Quản Lý Danh Mục", breadcrumb: "Admin / Danh mục" };
      case "users": return { title: "Quản Lý Người Dùng", breadcrumb: "Admin / Người dùng" };
      default: return { title: "Dashboard", breadcrumb: "Admin / Dashboard" };
    }
  };

  const { title, breadcrumb } = getPageInfo();
  // Giả lập check mobile để truyền vào props con (nếu cần xử lý logic riêng)
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
    </AdminLayout>
  );
};

export default AdminDashboard;
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminPlantManager from "../components/AdminPlantManager";
import AdminCategoryManager from "../components/AdminCategoryManager";
import AdminUserManager from "../components/AdminUserManager";
import AdminNewsManager from "../components/AdminNewsManager";
import AdminCommentManager from "../components/AdminCommentManager";
import AdminStats from "../components/AdminStats";
import AdminTrackingStats from "../components/AdminTrackingStats"; 
import AdminTrackingSocialStats from "../components/AdminTrackingSocialStats"; 

// [MỚI] Import component Tracking Popup
import AdminTrackingPopupStats from "../components/AdminTrackingPopupStats"; 

const AdminDashboard = ({ initialTab = "dashboard" }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Đồng bộ activeTab với initialTab khi prop thay đổi
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // --- HELPER: Lấy tiêu đề ---
  const getPageInfo = () => {
    switch (activeTab) {
      case "dashboard":
        return { title: "Tổng Quan", breadcrumb: "Admin / Thống kê" };
      case "tracking":
        return { title: "Tracking Lượt Xem", breadcrumb: "Admin / Tracking" }; 
      case "trackingSocial": 
        return { title: "Tracking Mạng Xã Hội", breadcrumb: "Admin / Tracking MXH" };
      case "trackingPopup": // [MỚI] Thêm case cho tracking Popup
        return { title: "Tracking Tương tác Popup", breadcrumb: "Admin / Tracking Popup" };
      case "plants":
        return { title: "Quản Lý Cây Cảnh", breadcrumb: "Admin / Cây cảnh" };
      case "categories":
        return { title: "Quản Lý Danh Mục", breadcrumb: "Admin / Danh mục" };
      case "users":
        return {
          title: "Quản Lý Người Dùng",
          breadcrumb: "Admin / Người dùng",
        };
      case "news":
        return { title: "Quản Lý Tin Tức", breadcrumb: "Admin / Tin tức" };
      case "comments":
        return { title: "Quản Lý Bình Luận", breadcrumb: "Admin / Bình luận" };
      default:
        return { title: "Dashboard", breadcrumb: "Admin / Dashboard" };
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
      {activeTab === "dashboard" && <AdminStats />}
      {activeTab === "tracking" && <AdminTrackingStats />}
      {activeTab === "trackingSocial" && <AdminTrackingSocialStats />} 
      
      {/* [MỚI] Render component Tracking Popup khi click vào menu tương ứng */}
      {activeTab === "trackingPopup" && <AdminTrackingPopupStats />} 

      {activeTab === "plants" && <AdminPlantManager isMobile={isMobile} />}
      {activeTab === "categories" && (
        <AdminCategoryManager isMobile={isMobile} />
      )}
      {activeTab === "users" && <AdminUserManager isMobile={isMobile} />}
      {activeTab === "news" && <AdminNewsManager isMobile={isMobile} />}
      {activeTab === "comments" && <AdminCommentManager />}
    </AdminLayout>
  );
};

export default AdminDashboard;
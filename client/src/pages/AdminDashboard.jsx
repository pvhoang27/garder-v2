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
import AdminTrackingPopupStats from "../components/AdminTrackingPopupStats"; 
import AdminTrackingLocationStats from "../components/AdminTrackingLocationStats"; 
import AdminTrackingSearchStats from "../components/AdminTrackingSearchStats";
import AdminTrackingPlantStats from "../components/AdminTrackingPlantStats";

// [MỚI] Import component Tracking Homepage
import AdminTrackingHomepageStats from "../components/AdminTrackingHomepageStats";

const AdminDashboard = ({ initialTab = "dashboard" }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const getPageInfo = () => {
    switch (activeTab) {
      case "dashboard":
        return { title: "Tổng Quan", breadcrumb: "Admin / Thống kê" };
      case "trackingHomepage": // [MỚI]
        return { title: "Tracking Trang Chủ", breadcrumb: "Admin / Tracking Trang Chủ" };
      case "tracking":
        return { title: "Tracking Lượt Xem", breadcrumb: "Admin / Tracking" }; 
      case "trackingSocial": 
        return { title: "Tracking Mạng Xã Hội", breadcrumb: "Admin / Tracking MXH" };
      case "trackingPopup": 
        return { title: "Tracking Tương tác Popup", breadcrumb: "Admin / Tracking Popup" };
      case "trackingLocation": 
        return { title: "Tracking Vị Trí", breadcrumb: "Admin / Tracking Vị Trí" };
      case "trackingSearch": 
        return { title: "Tracking Tìm Kiếm", breadcrumb: "Admin / Tracking Tìm Kiếm" };
      case "trackingPlant": 
        return { title: "Tracking Xem Cây", breadcrumb: "Admin / Tracking Xem Cây" };
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
      
      {/* [MỚI] Render component Tracking Homepage */}
      {activeTab === "trackingHomepage" && <AdminTrackingHomepageStats />}
      
      {activeTab === "tracking" && <AdminTrackingStats />}
      {activeTab === "trackingSocial" && <AdminTrackingSocialStats />} 
      {activeTab === "trackingPopup" && <AdminTrackingPopupStats />} 
      {activeTab === "trackingLocation" && <AdminTrackingLocationStats />} 
      {activeTab === "trackingSearch" && <AdminTrackingSearchStats />} 
      {activeTab === "trackingPlant" && <AdminTrackingPlantStats />} 

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
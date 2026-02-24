import { FaBars, FaList, FaPlus, FaMagic, FaImage, FaInfoCircle, FaHeading, FaSitemap } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

// Import components
import AdminGlobalEffectConfig from "../components/admin/layout/AdminGlobalEffectConfig";
import AdminLayoutForm from "../components/admin/layout/AdminLayoutForm";
import AdminLayoutList from "../components/admin/layout/AdminLayoutList";
import AdminHeroConfig from "../components/admin/layout/AdminHeroConfig";
import AdminAboutConfig from "../components/admin/layout/AdminAboutConfig"; 
import AdminHeaderConfig from "../components/admin/layout/AdminHeaderConfig";
import AdminMenuConfig from "../components/admin/layout/AdminMenuConfig"; // Chắc chắn bạn đã tạo file này nhé

// Import CSS
import "../components/admin/layout/AdminLayout.css";

// Import Logic Hook
import { useAdminLayout } from "../hooks/useAdminLayout";

const AdminLayoutConfig = () => {
  const {
    layouts, categories, isEditing, activeTab, globalEffect,
    headerConfig, headerPreviewUrl,
    menuConfig, 
    heroConfig, previewUrl,
    aboutConfig, aboutPreviews, 
    isMobile, isSidebarOpen, config, selectedPlantIds, searchPlant, filteredPlantsForSelection,
    setGlobalEffect, setHeaderConfig, setMenuConfig, setHeroConfig, setAboutConfig, setIsSidebarOpen, setConfig, setSearchPlant,
    handleSidebarClick, handleSaveEffect,
    handleHeaderFileChange, handleSaveHeaderConfig,
    handleSaveMenuConfig, 
    handleHeroFileChange, handleSaveHeroConfig,
    handleAboutFileChange, handleSaveAboutConfig, 
    handleEdit, handleDelete, handleMoveSection, togglePlantSelection, handleSubmit, handleResetAndBack, handleTabClick,
  } = useAdminLayout();

  const tabBtnStyle = (isActive) => ({
    padding: "10px 20px",
    marginRight: "10px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    backgroundColor: isActive ? "#2e7d32" : "#e0e0e0",
    color: isActive ? "#fff" : "#333",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s",
  });

  return (
    <div className="admin-layout-page">
      {isMobile && (
        <div className="mobile-header">
          <div className="mobile-header-title">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="btn-sidebar-toggle"
            >
              <FaBars />
            </button>
            Garder Admin
          </div>
        </div>
      )}

      {isMobile && isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="sidebar-overlay"></div>
      )}

      <AdminSidebar
        activeTab="layout"
        setActiveTab={handleSidebarClick}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div
        className="admin-layout-content"
        style={{
          marginLeft: isMobile ? "0" : "250px",
          paddingTop: isMobile ? "80px" : "30px",
        }}
      >
        <div className="container" style={{ paddingBottom: "50px" }}>
          <h2 className="page-heading">🎨 Quản Lý Bố Cục Trang Chủ</h2>

          {/* --- TAB NAVIGATION --- */}
          <div style={{ display: "flex", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
            <button style={tabBtnStyle(activeTab === "list")} onClick={() => handleTabClick("list")}>
              <FaList /> Danh Sách
            </button>
            <button style={tabBtnStyle(activeTab === "form")} onClick={() => handleTabClick("form")}>
              <FaPlus /> {isEditing ? "Đang Sửa Section" : "Thêm Section Mới"}
            </button>
            
            {/* ĐÂY LÀ TAB LOGO & TÊN */}
            <button style={tabBtnStyle(activeTab === "header")} onClick={() => handleTabClick("header")}>
              <FaHeading /> Logo & Tên
            </button>
            
            {/* ĐÂY LÀ TAB MENU VỪA ĐƯỢC THÊM MỚI */}
            <button style={tabBtnStyle(activeTab === "menu")} onClick={() => handleTabClick("menu")}>
              <FaSitemap /> Cấu Hình Menu
            </button>

            <button style={tabBtnStyle(activeTab === "effect")} onClick={() => handleTabClick("effect")}>
              <FaMagic /> Hiệu Ứng
            </button>
            <button style={tabBtnStyle(activeTab === "hero")} onClick={() => handleTabClick("hero")}>
              <FaImage /> Cấu Hình Hero
            </button>
            <button style={tabBtnStyle(activeTab === "about")} onClick={() => handleTabClick("about")}>
              <FaInfoCircle /> Cấu Hình About
            </button>
          </div>

          {/* --- TAB CONTENT --- */}
          {activeTab === "list" && (
            <div>
              <h3 className="section-sub-heading">Danh sách hiển thị trên trang chủ</h3>
              <AdminLayoutList
                layouts={layouts}
                handleMoveSection={handleMoveSection}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </div>
          )}

          {activeTab === "form" && (
            <AdminLayoutForm
              isEditing={isEditing} config={config} setConfig={setConfig} handleSubmit={handleSubmit} resetForm={handleResetAndBack}
              categories={categories} selectedPlantIds={selectedPlantIds} togglePlantSelection={togglePlantSelection}
              searchPlant={searchPlant} setSearchPlant={setSearchPlant} filteredPlantsForSelection={filteredPlantsForSelection}
            />
          )}

          {activeTab === "header" && (
            <AdminHeaderConfig
              headerConfig={headerConfig} setHeaderConfig={setHeaderConfig} headerPreviewUrl={headerPreviewUrl}
              handleHeaderFileChange={handleHeaderFileChange} handleSaveHeaderConfig={handleSaveHeaderConfig}
            />
          )}

          {activeTab === "menu" && (
            <AdminMenuConfig
              menuConfig={menuConfig} setMenuConfig={setMenuConfig} handleSaveMenuConfig={handleSaveMenuConfig}
            />
          )}

          {activeTab === "effect" && (
            <AdminGlobalEffectConfig globalEffect={globalEffect} setGlobalEffect={setGlobalEffect} handleSaveEffect={handleSaveEffect} />
          )}

          {activeTab === "hero" && (
            <AdminHeroConfig
              heroConfig={heroConfig} setHeroConfig={setHeroConfig} previewUrl={previewUrl}
              handleHeroFileChange={handleHeroFileChange} handleSaveHeroConfig={handleSaveHeroConfig}
            />
          )}

           {activeTab === "about" && (
            <AdminAboutConfig
              aboutConfig={aboutConfig} setAboutConfig={setAboutConfig} aboutPreviews={aboutPreviews}
              handleAboutFileChange={handleAboutFileChange} handleSaveAboutConfig={handleSaveAboutConfig}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLayoutConfig;
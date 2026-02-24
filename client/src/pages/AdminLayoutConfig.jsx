import { FaBars, FaList, FaPlus, FaMagic, FaImage, FaInfoCircle, FaHeading } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

// Import components
import AdminGlobalEffectConfig from "../components/admin/layout/AdminGlobalEffectConfig";
import AdminLayoutForm from "../components/admin/layout/AdminLayoutForm";
import AdminLayoutList from "../components/admin/layout/AdminLayoutList";
import AdminHeroConfig from "../components/admin/layout/AdminHeroConfig";
import AdminAboutConfig from "../components/admin/layout/AdminAboutConfig"; 
import AdminHeaderConfig from "../components/admin/layout/AdminHeaderConfig"; // Import mới

// Import CSS
import "../components/admin/layout/AdminLayout.css";

// Import Logic Hook
import { useAdminLayout } from "../hooks/useAdminLayout";

const AdminLayoutConfig = () => {
  // Lấy toàn bộ data và handler từ Custom Hook
  const {
    // State
    layouts,
    categories,
    isEditing,
    activeTab,
    globalEffect,
    headerConfig, // New
    headerPreviewUrl, // New
    heroConfig,
    previewUrl,
    aboutConfig, 
    aboutPreviews, 
    isMobile,
    isSidebarOpen,
    config,
    selectedPlantIds,
    searchPlant,
    filteredPlantsForSelection,

    // Setters
    setGlobalEffect,
    setHeaderConfig, // New
    setHeroConfig,
    setAboutConfig, 
    setIsSidebarOpen,
    setConfig,
    setSearchPlant,

    // Handlers
    handleSidebarClick,
    handleSaveEffect,
    handleHeaderFileChange, // New
    handleSaveHeaderConfig, // New
    handleHeroFileChange,
    handleSaveHeroConfig,
    handleAboutFileChange, 
    handleSaveAboutConfig, 
    handleEdit,
    handleDelete,
    handleMoveSection,
    togglePlantSelection,
    handleSubmit,
    handleResetAndBack,
    handleTabClick,
  } = useAdminLayout();

  // Style cho nút Tab
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
      {/* --- MOBILE HEADER --- */}
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

      {/* --- OVERLAY --- */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="sidebar-overlay"
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <AdminSidebar
        activeTab="layout"
        setActiveTab={handleSidebarClick}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* --- MAIN CONTENT --- */}
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
          <div
            style={{
              display: "flex",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <button
              style={tabBtnStyle(activeTab === "list")}
              onClick={() => handleTabClick("list")}
            >
              <FaList /> Danh Sách
            </button>

            <button
              style={tabBtnStyle(activeTab === "form")}
              onClick={() => handleTabClick("form")}
            >
              <FaPlus /> {isEditing ? "Đang Sửa Section" : "Thêm Section Mới"}
            </button>
            
            <button
              style={tabBtnStyle(activeTab === "header")}
              onClick={() => handleTabClick("header")}
            >
              <FaHeading /> Cấu Hình Header
            </button>

            <button
              style={tabBtnStyle(activeTab === "effect")}
              onClick={() => handleTabClick("effect")}
            >
              <FaMagic /> Hiệu Ứng
            </button>

            <button
              style={tabBtnStyle(activeTab === "hero")}
              onClick={() => handleTabClick("hero")}
            >
              <FaImage /> Cấu Hình Hero
            </button>

            <button
              style={tabBtnStyle(activeTab === "about")}
              onClick={() => handleTabClick("about")}
            >
              <FaInfoCircle /> Cấu Hình About
            </button>
          </div>

          {/* --- TAB CONTENT: LIST --- */}
          {activeTab === "list" && (
            <div>
              <h3 className="section-sub-heading">
                Danh sách hiển thị trên trang chủ
              </h3>
              <AdminLayoutList
                layouts={layouts}
                handleMoveSection={handleMoveSection}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            </div>
          )}

          {/* --- TAB CONTENT: FORM --- */}
          {activeTab === "form" && (
            <div>
              <AdminLayoutForm
                isEditing={isEditing}
                config={config}
                setConfig={setConfig}
                handleSubmit={handleSubmit}
                resetForm={handleResetAndBack}
                categories={categories}
                selectedPlantIds={selectedPlantIds}
                togglePlantSelection={togglePlantSelection}
                searchPlant={searchPlant}
                setSearchPlant={setSearchPlant}
                filteredPlantsForSelection={filteredPlantsForSelection}
              />
            </div>
          )}

          {/* --- TAB CONTENT: HEADER CONFIG (MỚI) --- */}
          {activeTab === "header" && (
            <AdminHeaderConfig
              headerConfig={headerConfig}
              setHeaderConfig={setHeaderConfig}
              headerPreviewUrl={headerPreviewUrl}
              handleHeaderFileChange={handleHeaderFileChange}
              handleSaveHeaderConfig={handleSaveHeaderConfig}
            />
          )}

          {/* --- TAB CONTENT: EFFECT --- */}
          {activeTab === "effect" && (
            <AdminGlobalEffectConfig
              globalEffect={globalEffect}
              setGlobalEffect={setGlobalEffect}
              handleSaveEffect={handleSaveEffect}
            />
          )}

          {/* --- TAB CONTENT: HERO CONFIG --- */}
          {activeTab === "hero" && (
            <AdminHeroConfig
              heroConfig={heroConfig}
              setHeroConfig={setHeroConfig}
              previewUrl={previewUrl}
              handleHeroFileChange={handleHeroFileChange}
              handleSaveHeroConfig={handleSaveHeroConfig}
            />
          )}

           {/* --- TAB CONTENT: ABOUT CONFIG --- */}
           {activeTab === "about" && (
            <AdminAboutConfig
              aboutConfig={aboutConfig}
              setAboutConfig={setAboutConfig}
              aboutPreviews={aboutPreviews}
              handleAboutFileChange={handleAboutFileChange}
              handleSaveAboutConfig={handleSaveAboutConfig}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLayoutConfig;
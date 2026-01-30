import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { FaBars, FaList, FaPlus, FaMagic } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

// Import components
import AdminGlobalEffectConfig from "../components/admin/layout/AdminGlobalEffectConfig";
import AdminLayoutForm from "../components/admin/layout/AdminLayoutForm";
import AdminLayoutList from "../components/admin/layout/AdminLayoutList";

// Import CSS
import "../components/admin/layout/AdminLayout.css";

const AdminLayoutConfig = () => {
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allPlants, setAllPlants] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // --- STATE QUẢN LÝ TAB ---
  // "list": Danh sách, "form": Thêm/Sửa, "effect": Hiệu ứng
  const [activeTab, setActiveTab] = useState("list"); 

  // State hiệu ứng global
  const [globalEffect, setGlobalEffect] = useState("none");

  // --- STATE CHO LAYOUT & SIDEBAR ---
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

  const handleSidebarClick = (tab) => {
    navigate("/admin");
  };

  // Form State
  const [config, setConfig] = useState(initialState());
  const [selectedPlantIds, setSelectedPlantIds] = useState([]);
  const [searchPlant, setSearchPlant] = useState("");

  function initialState() {
    return {
      id: null,
      title: "",
      type: "manual",
      param_value: "",
      sort_order: 0,
      is_active: true,
    };
  }

  useEffect(() => {
    fetchLayouts();
    fetchCategories();
    fetchAllPlants();
    fetchGlobalEffect();
  }, []);

  const fetchLayouts = async () => {
    try {
      const res = await axiosClient.get("/layout");
      const sortedData = res.data.sort((a, b) => a.sort_order - b.sort_order);
      setLayouts(sortedData);

      // Nếu đang không sửa thì tính toán sort order mới
      if (!isEditing) {
        const nextOrder =
          sortedData.length > 0
            ? sortedData[sortedData.length - 1].sort_order + 1
            : 1;
        setConfig((prev) => ({ ...prev, sort_order: nextOrder }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGlobalEffect = async () => {
    try {
      const res = await axiosClient.get("/layout/effect");
      if (res.data.effect) {
        setGlobalEffect(res.data.effect);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllPlants = async () => {
    try {
      const res = await axiosClient.get("/plants");
      setAllPlants(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Xử lý lưu hiệu ứng
  const handleSaveEffect = async () => {
    try {
      await axiosClient.post("/layout/effect", { effect: globalEffect });
      alert("Đã lưu hiệu ứng trang chủ!");
    } catch (error) {
      alert("Lỗi lưu hiệu ứng");
    }
  };

  // KHI BẤM SỬA TỪ DANH SÁCH
  const handleEdit = async (item) => {
    setConfig({ ...item, is_active: item.is_active === 1 });
    setIsEditing(true);

    if (item.type === "manual") {
      try {
        const res = await axiosClient.get(`/layout/${item.id}/plants`);
        const currentIds = res.data.map((p) => p.id);
        setSelectedPlantIds(currentIds);
      } catch (error) {
        setSelectedPlantIds([]);
      }
    } else {
      setSelectedPlantIds([]);
    }

    // Chuyển sang tab Form để sửa
    setActiveTab("form");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa section này?")) {
      await axiosClient.delete(`/layout/${id}`);
      fetchLayouts();
    }
  };

  const handleMoveSection = async (index, direction) => {
    const currentItem = layouts[index];
    const targetItem = layouts[index + direction];
    if (!currentItem || !targetItem) return;

    const currentOrder = currentItem.sort_order;
    const targetOrder = targetItem.sort_order;

    const newLayouts = [...layouts];
    newLayouts[index] = { ...currentItem, sort_order: targetOrder };
    newLayouts[index + direction] = { ...targetItem, sort_order: currentOrder };
    newLayouts.sort((a, b) => a.sort_order - b.sort_order);
    setLayouts(newLayouts);

    try {
      await Promise.all([
        axiosClient.put(`/layout/${currentItem.id}`, {
          ...currentItem,
          sort_order: targetOrder,
        }),
        axiosClient.put(`/layout/${targetItem.id}`, {
          ...targetItem,
          sort_order: currentOrder,
        }),
      ]);
      fetchLayouts();
    } catch (error) {
      alert("Lỗi khi thay đổi vị trí!");
      fetchLayouts();
    }
  };

  const togglePlantSelection = (plantId) => {
    setSelectedPlantIds((prev) => {
      if (prev.includes(plantId)) {
        return prev.filter((id) => id !== plantId);
      } else {
        return [...prev, plantId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...config,
      plant_ids: config.type === "manual" ? selectedPlantIds : [],
    };

    try {
      if (config.id) {
        await axiosClient.put(`/layout/${config.id}`, payload);
      } else {
        await axiosClient.post("/layout", payload);
      }
      alert("Lưu thành công!");
      
      // Sau khi lưu xong, reset form và quay về danh sách
      resetFormState();
      setIsEditing(false);
      setActiveTab("list");
      fetchLayouts();
    } catch (error) {
      alert("Lỗi khi lưu");
    }
  };

  // Hàm reset dữ liệu form (không liên quan đến chuyển tab)
  const resetFormState = () => {
    const newInitial = initialState();
    const maxOrder =
      layouts.length > 0 ? Math.max(...layouts.map((l) => l.sort_order)) : 0;
    newInitial.sort_order = maxOrder + 1;
    setConfig(newInitial);
    setSelectedPlantIds([]);
    setIsEditing(false);
  };

  // Hàm xử lý nút "Hủy / Thêm mới" hoặc chuyển tab
  const handleResetAndBack = () => {
    resetFormState();
    setActiveTab("list");
  };

  // Xử lý khi bấm vào Tab trên thanh điều hướng
  const handleTabClick = (tabName) => {
    if (tabName === "form") {
      // Nếu bấm tab "Thêm mới", đảm bảo reset về trạng thái thêm mới
      resetFormState();
    }
    setActiveTab(tabName);
  }

  const filteredPlantsForSelection = allPlants.filter((p) =>
    p.name.toLowerCase().includes(searchPlant.toLowerCase()),
  );

  // Inline styles cho Tabs (Bạn có thể đưa vào CSS file nếu muốn)
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
    transition: "all 0.3s"
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
          <div style={{ display: "flex", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
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
              style={tabBtnStyle(activeTab === "effect")}
              onClick={() => handleTabClick("effect")}
            >
              <FaMagic /> Cấu Hình Hiệu Ứng
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
                resetForm={handleResetAndBack} // Truyền hàm quay lại list
                categories={categories}
                selectedPlantIds={selectedPlantIds}
                togglePlantSelection={togglePlantSelection}
                searchPlant={searchPlant}
                setSearchPlant={setSearchPlant}
                filteredPlantsForSelection={filteredPlantsForSelection}
              />
            </div>
          )}

          {/* --- TAB CONTENT: EFFECT --- */}
          {activeTab === "effect" && (
             <AdminGlobalEffectConfig
                globalEffect={globalEffect}
                setGlobalEffect={setGlobalEffect}
                handleSaveEffect={handleSaveEffect}
           />
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminLayoutConfig;
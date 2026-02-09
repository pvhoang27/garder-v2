import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export const useAdminLayout = () => {
  const navigate = useNavigate();
  
  // --- STATE DỮ LIỆU ---
  const [layouts, setLayouts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allPlants, setAllPlants] = useState([]);
  
  // --- STATE UI & FORM ---
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("list"); // "list", "form", "effect", "hero"
  const [globalEffect, setGlobalEffect] = useState("none");
  const [searchPlant, setSearchPlant] = useState("");
  
  // --- STATE HERO CONFIG ---
  const [heroConfig, setHeroConfig] = useState({
    titlePrefix: "Khám phá vẻ đẹp",
    titleHighlight: "thiên nhiên",
    titleSuffix: "qua từng tác phẩm",
    description: "Chào mừng đến với Cây cảnh Xuân Thục...",
    imageUrl: "/hero-bonsai.jpg",
    imageFile: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  // --- STATE SIDEBAR (MOBILE) ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- FORM STATE ---
  const initialState = () => ({
    id: null,
    title: "",
    type: "manual",
    param_value: "",
    sort_order: 0,
    is_active: true,
  });
  
  const [config, setConfig] = useState(initialState());
  const [selectedPlantIds, setSelectedPlantIds] = useState([]);

  // --- EFFECT: RESIZE WINDOW ---
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- EFFECT: FETCH DATA ---
  useEffect(() => {
    fetchLayouts();
    fetchCategories();
    fetchAllPlants();
    fetchGlobalEffect();
    fetchHeroConfig();
  }, []);

  // --- API HELPER FUNCTIONS ---
  const fetchLayouts = async () => {
    try {
      const res = await axiosClient.get("/layout");
      const sortedData = res.data.sort((a, b) => a.sort_order - b.sort_order);
      setLayouts(sortedData);

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

  const fetchHeroConfig = async () => {
    try {
      const res = await axiosClient.get("/layout/hero");
      if (res.data) {
        setHeroConfig({ ...res.data, imageFile: null });
        if (res.data.imageUrl) {
          const url = res.data.imageUrl.startsWith("/uploads")
            ? `http://localhost:3000${res.data.imageUrl}`
            : res.data.imageUrl;
          setPreviewUrl(url);
        }
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

  // --- HANDLERS ---

  const handleSidebarClick = () => {
    navigate("/admin");
  };

  const handleSaveEffect = async () => {
    try {
      await axiosClient.post("/layout/effect", { effect: globalEffect });
      alert("Đã lưu hiệu ứng trang chủ!");
    } catch (error) {
      alert("Lỗi lưu hiệu ứng");
    }
  };

  const handleHeroFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroConfig({ ...heroConfig, imageFile: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveHeroConfig = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("titlePrefix", heroConfig.titlePrefix || "");
      formData.append("titleHighlight", heroConfig.titleHighlight || "");
      formData.append("titleSuffix", heroConfig.titleSuffix || "");
      formData.append("description", heroConfig.description || "");

      if (heroConfig.imageFile) {
        formData.append("image", heroConfig.imageFile);
      }

      await axiosClient.post("/layout/hero", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Đã cập nhật Hero Section thành công!");
      fetchHeroConfig();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu Hero Config");
    }
  };

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

  const resetFormState = () => {
    const newInitial = initialState();
    const maxOrder =
      layouts.length > 0 ? Math.max(...layouts.map((l) => l.sort_order)) : 0;
    newInitial.sort_order = maxOrder + 1;
    setConfig(newInitial);
    setSelectedPlantIds([]);
    setIsEditing(false);
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
      resetFormState();
      setIsEditing(false);
      setActiveTab("list");
      fetchLayouts();
    } catch (error) {
      alert("Lỗi khi lưu");
    }
  };

  const handleResetAndBack = () => {
    resetFormState();
    setActiveTab("list");
  };

  const handleTabClick = (tabName) => {
    if (tabName === "form") {
      resetFormState();
    }
    setActiveTab(tabName);
  };

  // Lọc cây theo từ khóa tìm kiếm
  const filteredPlantsForSelection = allPlants.filter((p) =>
    p.name.toLowerCase().includes(searchPlant.toLowerCase())
  );

  return {
    // State
    layouts,
    categories,
    isEditing,
    activeTab,
    globalEffect,
    heroConfig,
    previewUrl,
    isMobile,
    isSidebarOpen,
    config,
    selectedPlantIds,
    searchPlant,
    filteredPlantsForSelection,

    // Setters (nếu cần thiết expose trực tiếp)
    setGlobalEffect,
    setHeroConfig,
    setIsSidebarOpen,
    setConfig,
    setSearchPlant,
    
    // Handlers
    handleSidebarClick,
    handleSaveEffect,
    handleHeroFileChange,
    handleSaveHeroConfig,
    handleEdit,
    handleDelete,
    handleMoveSection,
    togglePlantSelection,
    handleSubmit,
    handleResetAndBack,
    handleTabClick
  };
};
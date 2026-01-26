import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import {
  FaSave,
  FaTrash,
  FaEdit,
  FaBars,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayoutConfig = () => {
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allPlants, setAllPlants] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

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

  const mainContentStyle = {
    marginLeft: isMobile ? "0" : "250px",
    flex: 1,
    padding: "30px",
    paddingTop: isMobile ? "80px" : "30px",
    transition: "0.3s",
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
  }, []);

  const fetchLayouts = async () => {
    try {
      const res = await axiosClient.get("/layout");
      // Sắp xếp theo sort_order để hiển thị đúng thứ tự
      const sortedData = res.data.sort((a, b) => a.sort_order - b.sort_order);
      setLayouts(sortedData);

      // Tự động điền sort_order tiếp theo cho form thêm mới
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

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa section này?")) {
      await axiosClient.delete(`/layout/${id}`);
      fetchLayouts();
    }
  };

  // --- LOGIC ĐỔI VỊ TRÍ (LÊN/XUỐNG) ---
  const handleMoveSection = async (index, direction) => {
    // direction: -1 (Lên), 1 (Xuống)
    const currentItem = layouts[index];
    const targetItem = layouts[index + direction];

    if (!currentItem || !targetItem) return;

    // Hoán đổi giá trị sort_order
    const currentOrder = currentItem.sort_order;
    const targetOrder = targetItem.sort_order;

    // Cập nhật giao diện ngay lập tức (Optimistic UI)
    const newLayouts = [...layouts];
    newLayouts[index] = { ...currentItem, sort_order: targetOrder };
    newLayouts[index + direction] = { ...targetItem, sort_order: currentOrder };
    newLayouts.sort((a, b) => a.sort_order - b.sort_order);
    setLayouts(newLayouts);

    try {
      // Gọi API cập nhật (Chỉ gửi thông tin cơ bản, KHÔNG gửi plant_ids nên server sẽ giữ nguyên cây)
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
      fetchLayouts(); // Đồng bộ lại với server cho chắc chắn
    } catch (error) {
      alert("Lỗi khi thay đổi vị trí!");
      fetchLayouts(); // Rollback nếu lỗi
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
      setIsEditing(false);
      resetForm();
      alert("Lưu thành công!");
      fetchLayouts();
    } catch (error) {
      alert("Lỗi khi lưu");
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    const newInitial = initialState();
    // Tính toán sort_order cho item mới
    const maxOrder =
      layouts.length > 0 ? Math.max(...layouts.map((l) => l.sort_order)) : 0;
    newInitial.sort_order = maxOrder + 1;
    setConfig(newInitial);
    setSelectedPlantIds([]);
  };

  const filteredPlantsForSelection = allPlants.filter((p) =>
    p.name.toLowerCase().includes(searchPlant.toLowerCase()),
  );

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
          <div
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer",
              }}
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
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
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
      <div style={mainContentStyle}>
        <div className="container" style={{ paddingBottom: "50px" }}>
          <h2
            style={{
              color: "#2e7d32",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            🎨 Quản Lý Bố Cục Trang Chủ
          </h2>

          {/* FORM */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              marginBottom: "30px",
            }}
          >
            <h3>
              {isEditing
                ? `Đang chỉnh sửa: ${config.title}`
                : "Thêm Section Mới"}
            </h3>
            <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label>Tiêu đề hiển thị:</label>
                  <input
                    type="text"
                    required
                    value={config.title}
                    onChange={(e) =>
                      setConfig({ ...config, title: e.target.value })
                    }
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                  />
                </div>
                <div>
                  <label>Kiểu nội dung:</label>
                  <select
                    value={config.type}
                    onChange={(e) =>
                      setConfig({ ...config, type: e.target.value })
                    }
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                  >
                    <option value="manual">Tự chọn từng cây (Thủ công)</option>
                    <option value="category">
                      Theo Danh Mục Cụ Thể (Tự động)
                    </option>
                  </select>
                </div>
              </div>

              {/* CHECKLIST CHỌN CÂY */}
              {config.type === "manual" && (
                <div
                  style={{
                    marginTop: "20px",
                    border: "1px solid #ddd",
                    padding: "15px",
                    borderRadius: "5px",
                    background: "#f9f9f9",
                  }}
                >
                  <label
                    style={{
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    Chọn cây hiển thị:
                  </label>

                  <input
                    type="text"
                    placeholder="🔍 Tìm tên cây..."
                    value={searchPlant}
                    onChange={(e) => setSearchPlant(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <div
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    {filteredPlantsForSelection.map((plant) => (
                      <label
                        key={plant.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          background: "white",
                          padding: "5px",
                          border: "1px solid #eee",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPlantIds.includes(plant.id)}
                          onChange={() => togglePlantSelection(plant.id)}
                          style={{
                            marginRight: "8px",
                            transform: "scale(1.2)",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          {plant.thumbnail && (
                            <img
                              src={`http://localhost:3000${plant.thumbnail}`}
                              alt=""
                              style={{
                                width: "30px",
                                height: "30px",
                                objectFit: "cover",
                              }}
                            />
                          )}
                          <span style={{ fontSize: "0.9rem" }}>
                            {plant.name}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* DANH MỤC */}
              {config.type === "category" && (
                <div style={{ marginTop: "15px" }}>
                  <label>Chọn Danh Mục:</label>
                  <select
                    value={config.param_value}
                    onChange={(e) =>
                      setConfig({ ...config, param_value: e.target.value })
                    }
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <div>
                  <label>Thứ tự hiển thị:</label>
                  <input
                    type="number"
                    value={config.sort_order}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        sort_order: parseInt(e.target.value),
                      })
                    }
                    style={{
                      width: "80px",
                      padding: "8px",
                      marginLeft: "10px",
                    }}
                  />
                </div>
                <label
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={config.is_active}
                    onChange={(e) =>
                      setConfig({ ...config, is_active: e.target.checked })
                    }
                    style={{ marginRight: "5px" }}
                  />
                  Hiển thị trên web
                </label>
              </div>

              <div style={{ marginTop: "20px" }}>
                <button
                  type="submit"
                  style={{
                    background: "#2e7d32",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  <FaSave /> Lưu Cấu Hình
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      background: "#666",
                      color: "white",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    Hủy / Thêm mới
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* DANH SÁCH HIỂN THỊ */}
          <h3 style={{ marginBottom: "15px", color: "#333" }}>
            Danh sách hiển thị trên trang chủ
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {layouts.map((item, index) => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderLeft: item.is_active
                    ? "5px solid #2e7d32"
                    : "5px solid #ccc",
                  opacity: item.is_active ? 1 : 0.7,
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  {/* SỐ THỨ TỰ RÕ RÀNG */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "50px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#2e7d32",
                      }}
                    >
                      #{item.sort_order}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#888" }}>
                      Vị trí
                    </span>
                  </div>

                  <div>
                    <h4
                      style={{ margin: 0, color: "#333", fontSize: "1.2rem" }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        margin: "5px 0",
                        fontSize: "0.9rem",
                        color: "#666",
                      }}
                    >
                      Loại:{" "}
                      <span
                        style={{
                          background:
                            item.type === "manual" ? "#e3f2fd" : "#fff3e0",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontWeight: "500",
                          color: "#333",
                        }}
                      >
                        {item.type === "manual" ? "Thủ công" : "Danh mục"}
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  {/* NÚT ĐIỀU HƯỚNG LÊN / XUỐNG */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "15px",
                    }}
                  >
                    <button
                      onClick={() => handleMoveSection(index, -1)}
                      disabled={index === 0}
                      style={{
                        background: index === 0 ? "#eee" : "#fff",
                        border: "1px solid #ddd",
                        color: index === 0 ? "#ccc" : "#2e7d32",
                        cursor: index === 0 ? "default" : "pointer",
                        padding: "5px 10px",
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Chuyển lên trên"
                    >
                      <FaArrowUp />
                    </button>
                    <button
                      onClick={() => handleMoveSection(index, 1)}
                      disabled={index === layouts.length - 1}
                      style={{
                        background:
                          index === layouts.length - 1 ? "#eee" : "#fff",
                        border: "1px solid #ddd",
                        borderTop: "none",
                        color:
                          index === layouts.length - 1 ? "#ccc" : "#2e7d32",
                        cursor:
                          index === layouts.length - 1 ? "default" : "pointer",
                        padding: "5px 10px",
                        borderBottomLeftRadius: "4px",
                        borderBottomRightRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Chuyển xuống dưới"
                    >
                      <FaArrowDown />
                    </button>
                  </div>

                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      background: "#fff8e1",
                      border: "1px solid #ffcc80",
                      color: "#f57c00",
                      cursor: "pointer",
                      padding: "8px 12px",
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginRight: "5px",
                    }}
                  >
                    <FaEdit /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      background: "#ffebee",
                      border: "1px solid #ef9a9a",
                      color: "#d32f2f",
                      cursor: "pointer",
                      padding: "8px 12px",
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <FaTrash /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayoutConfig;

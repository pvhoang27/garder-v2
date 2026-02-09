import { useEffect, useState, useRef } from "react";
import axiosClient from "../api/axiosClient";
import { FaPlus, FaFileExport, FaFileImport, FaTimes, FaExclamationTriangle } from "react-icons/fa";

// Components
import AdminPlantForm from "./AdminPlantForm";
import Pagination from "./Pagination";
import PlantToolbar from "./admin/plants/PlantToolbar";
import PlantDetailModal from "./admin/plants/PlantDetailModal";
import PlantTable from "./admin/plants/PlantTable";

// CSS
import "./AdminPlantManager.css";

const AdminPlantManager = ({ isMobile }) => {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);

  // Modal States
  const [editingPlant, setEditingPlant] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingPlant, setViewingPlant] = useState(null);

  // --- STATE MỚI: QUẢN LÝ LỖI IMPORT ---
  const [importErrors, setImportErrors] = useState([]); // Lưu danh sách lỗi chi tiết
  const [showErrorModal, setShowErrorModal] = useState(false); // Bật tắt modal lỗi
  const [importSummary, setImportSummary] = useState(null); // Lưu tóm tắt (số lượng thành công/thất bại)

  // Notification State
  const [notification, setNotification] = useState(null); 

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPlants();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const fetchPlants = async () => {
    try {
      const res = await axiosClient.get("/plants");
      setPlants(res.data);
    } catch (error) {
      console.error(error);
      showNotification("error", "Không thể tải danh sách cây.");
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

  const handleDeletePlant = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa cây này?")) return;
    try {
      await axiosClient.delete(`/plants/${id}`);
      showNotification("success", "Đã xóa cây thành công!");
      fetchPlants();
    } catch (error) {
      showNotification("error", "Có lỗi xảy ra khi xóa cây!");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPlant(null);
    showNotification("success", "Lưu thông tin cây thành công!");
    fetchPlants();
  };

  const handleViewDetails = async (id) => {
    try {
      const res = await axiosClient.get(`/plants/${id}`);
      setViewingPlant(res.data);
    } catch (error) {
      showNotification("error", "Không tải được chi tiết cây!");
    }
  };

  const handleEditClick = (plant) => {
    setEditingPlant(plant);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleExport = async () => {
    try {
      showNotification("warning", "Đang tạo file Excel...");
      const response = await axiosClient.get("/plants/data/export", {
        responseType: "blob", 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "plants_export.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      showNotification("success", "Xuất file Excel thành công!");
    } catch (error) {
      showNotification("error", "Lỗi khi xuất file!");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    showNotification("warning", "Đang kiểm tra và nhập liệu...");

    try {
      const res = await axiosClient.post("/plants/data/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const { successCount, failCount, errorDetails } = res.data;

      setImportErrors([]);
      setImportSummary({ successCount, failCount });

      if (failCount > 0) {
        // Có lỗi -> Hiện Modal danh sách lỗi tiếng Việt
        setImportErrors(errorDetails || []);
        setShowErrorModal(true);
      } else {
        // Thành công 100%
        showNotification("success", `Tuyệt vời! Đã nhập thành công ${successCount} cây.`);
      }

      fetchPlants(); 
    } catch (error) {
      console.error(error);
      showNotification("error", "Lỗi kết nối server khi tải file!");
    } finally {
      e.target.value = null;
    }
  };

  // --- LOGIC FILTER & SORT ---
  const filteredPlants = plants
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = filterCategory === "all" || p.category_id === parseInt(filterCategory) || p.category_name === filterCategory;
      let matchDate = true;
      if (startDate || endDate) {
        const plantDate = new Date(p.created_at);
        plantDate.setHours(0, 0, 0, 0);
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (plantDate < start) matchDate = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(0, 0, 0, 0);
          if (plantDate > end) matchDate = false;
        }
      }
      return matchSearch && matchCategory && matchDate;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.created_at) - new Date(a.created_at);
        case "oldest": return new Date(a.created_at) - new Date(b.created_at);
        case "price-asc": return Number(a.price) - Number(b.price);
        case "price-desc": return Number(b.price) - Number(a.price);
        default: return 0;
      }
    });

  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
  const currentPlants = filteredPlants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [itemsPerPage, totalPages, currentPage]);

  return (
    <div style={{ position: "relative" }}>
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div style={{
            position: "fixed", top: "80px", right: "20px", zIndex: 9999,
            backgroundColor: notification.type === "success" ? "#d4edda" : "#f8d7da",
            color: notification.type === "success" ? "#155724" : "#721c24",
            padding: "15px 20px", borderRadius: "5px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            display: "flex", alignItems: "center", gap: "10px", animation: "slideIn 0.3s ease-in-out"
          }}>
          <span style={{ flex: 1, fontWeight: "500" }}>{notification.message}</span>
          <button onClick={() => setNotification(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><FaTimes /></button>
        </div>
      )}

      {/* --- MODAL HIỂN THỊ KẾT QUẢ IMPORT (DÀNH CHO NGƯỜI DÙNG) --- */}
      {showErrorModal && (
        <div className="modal-form-overlay">
          <div 
            className="modal-content" 
            style={{ 
              backgroundColor: "#fff", padding: "20px", borderRadius: "8px", 
              maxWidth: "600px", width: "90%", maxHeight: "80vh",
              display: "flex", flexDirection: "column"
            }}
          >
            <div className="modal-header" style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: "#d9534f", display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
                <FaExclamationTriangle /> Kết quả nhập file Excel
              </h3>
              <button onClick={() => setShowErrorModal(false)} style={{ background: "transparent", border: "none", fontSize: "24px", cursor: "pointer", color: "#666" }}>&times;</button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", flex: 1 }}>
              {importSummary && (
                <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "5px" }}>
                  <p style={{ margin: "5px 0" }}>✅ <strong>Nhập thành công:</strong> <span style={{ color: "green", fontWeight: "bold" }}>{importSummary.successCount}</span> dòng</p>
                  <p style={{ margin: "5px 0" }}>❌ <strong>Bị lỗi (Không nhập):</strong> <span style={{ color: "red", fontWeight: "bold" }}>{importSummary.failCount}</span> dòng</p>
                  <p style={{ fontSize: "13px", color: "#666", marginTop: "10px", fontStyle: "italic" }}>
                    Dưới đây là danh sách lỗi cụ thể, hãy sửa lại trong file Excel rồi nhập lại những dòng bị lỗi này:
                  </p>
                </div>
              )}
              
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {importErrors.map((err, index) => (
                  <li key={index} style={{ 
                    padding: "10px", borderBottom: "1px solid #eee", 
                    color: "#c7254e", backgroundColor: "#f9f2f4",
                    marginBottom: "5px", borderRadius: "4px", fontSize: "14px",
                    display: "flex", gap: "8px", alignItems: "flex-start"
                  }}>
                     <span style={{marginTop: "2px"}}>•</span> <span>{err}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="modal-footer" style={{ marginTop: "15px", paddingTop: "10px", borderTop: "1px solid #eee", textAlign: "right" }}>
              <button 
                onClick={() => setShowErrorModal(false)}
                style={{
                  padding: "8px 20px", backgroundColor: "#6c757d", color: "white",
                  border: "none", borderRadius: "4px", cursor: "pointer"
                }}
              >
                Đóng và sửa lại file
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ------------------------------------------- */}

      <div className="admin-header">
        <h2 className="admin-title">🌿 Danh Sách Cây</h2>
        <div className="admin-actions">
          <button onClick={handleExport} className="btn-export">
            <FaFileExport /> <span className="btn-text">Xuất Excel</span>
          </button>
          <button onClick={handleImportClick} className="btn-import">
            <FaFileImport /> <span className="btn-text">Nhập Excel</span>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls" style={{ display: "none" }} />
          <button onClick={() => { setEditingPlant(null); setShowForm(true); }} className="btn-add">
            <FaPlus /> <span className="btn-text">Thêm Mới</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-form-overlay">
          <div className="modal-header">
            <h3>{editingPlant ? "Sửa Cây" : "Thêm Cây"}</h3>
            <button onClick={() => setShowForm(false)} className="btn-close-modal">&times;</button>
          </div>
          <AdminPlantForm initialData={editingPlant} onSuccess={handleFormSuccess} />
        </div>
      )}

      <PlantDetailModal plant={viewingPlant} onClose={() => setViewingPlant(null)} isMobile={isMobile} />

      <PlantToolbar
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        filterCategory={filterCategory} setFilterCategory={setFilterCategory}
        sortBy={sortBy} setSortBy={setSortBy}
        categories={categories}
        startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate}
      />

      <PlantTable plants={currentPlants} onView={handleViewDetails} onEdit={handleEditClick} onDelete={handleDeletePlant} />

      <Pagination
        totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};

export default AdminPlantManager;
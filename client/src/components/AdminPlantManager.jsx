import { useEffect, useState, useRef } from "react";
import axiosClient from "../api/axiosClient";
import { FaPlus, FaFileExport, FaFileImport } from "react-icons/fa"; // Thêm icon

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

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // --- STATE MỚI CHO BỘ LỌC NGÀY ---
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Ref cho input file import
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPlants();
    fetchCategories();
  }, []);

  const fetchPlants = async () => {
    try {
      const res = await axiosClient.get("/plants");
      setPlants(res.data);
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

  // --- ACTIONS ---
  const handleDeletePlant = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa cây này?")) return;
    try {
      await axiosClient.delete(`/plants/${id}`);
      alert("Xóa thành công!");
      fetchPlants();
    } catch (error) {
      alert("Lỗi khi xóa!");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPlant(null);
    fetchPlants();
  };

  const handleViewDetails = async (id) => {
    try {
      const res = await axiosClient.get(`/plants/${id}`);
      setViewingPlant(res.data);
    } catch (error) {
      alert("Không tải được chi tiết cây!");
    }
  };

  const handleEditClick = (plant) => {
    setEditingPlant(plant);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  // --- IMPORT / EXPORT HANDLERS ---
  const handleExport = async () => {
    try {
      const response = await axiosClient.get("/plants/data/export", {
        responseType: "blob", // Quan trọng để nhận file
      });

      // Tạo link download giả
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "plants_export.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Lỗi export:", error);
      alert("Lỗi khi xuất file!");
    }
  };

  const handleImportClick = () => {
    // Kích hoạt input file ẩn
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosClient.post("/plants/data/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message);
      fetchPlants(); // Load lại danh sách sau khi import
    } catch (error) {
      console.error("Lỗi import:", error);
      alert("Lỗi khi nhập file!");
    } finally {
      // Reset input để có thể chọn lại cùng 1 file nếu muốn
      e.target.value = null;
    }
  };
  // ------------------------------

  // --- LOGIC FILTER & SORT ---
  const filteredPlants = plants
    .filter((p) => {
      // 1. Lọc theo tên
      const matchSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // 2. Lọc theo danh mục
      const matchCategory =
        filterCategory === "all" ||
        p.category_id === parseInt(filterCategory) ||
        p.category_name === filterCategory;

      // 3. Lọc theo ngày
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
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "price-asc":
          return Number(a.price) - Number(b.price);
        case "price-desc":
          return Number(b.price) - Number(a.price);
        default:
          return 0;
      }
    });

  // --- PAGINATION CALCULATION ---
  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
  const currentPlants = filteredPlants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [itemsPerPage, totalPages, currentPage]);

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">🌿 Danh Sách Cây</h2>

        <div className="admin-actions">
          {/* Nút Export */}
          <button onClick={handleExport} className="btn-export">
            <FaFileExport /> <span className="btn-text">Xuất Excel</span>
          </button>

          {/* Nút Import */}
          <button onClick={handleImportClick} className="btn-import">
            <FaFileImport /> <span className="btn-text">Nhập Excel</span>
          </button>

          {/* Input file ẩn */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            style={{ display: "none" }}
          />

          {/* Nút Thêm Mới */}
          <button
            onClick={() => {
              setEditingPlant(null);
              setShowForm(true);
            }}
            className="btn-add"
          >
            <FaPlus /> <span className="btn-text">Thêm Mới</span>
          </button>
        </div>
      </div>

      {/* COMPONENT: FORM ADD/EDIT */}
      {showForm && (
        <div className="modal-form-overlay">
          <div className="modal-header">
            <h3>{editingPlant ? "Sửa Cây" : "Thêm Cây"}</h3>
            <button
              onClick={() => setShowForm(false)}
              className="btn-close-modal"
            >
              &times;
            </button>
          </div>
          <AdminPlantForm
            initialData={editingPlant}
            onSuccess={handleFormSuccess}
          />
        </div>
      )}

      {/* COMPONENT: DETAIL MODAL */}
      <PlantDetailModal
        plant={viewingPlant}
        onClose={() => setViewingPlant(null)}
        isMobile={isMobile}
      />

      {/* COMPONENT: TOOLBAR */}
      <PlantToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categories}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      {/* COMPONENT: TABLE */}
      <PlantTable
        plants={currentPlants}
        onView={handleViewDetails}
        onEdit={handleEditClick}
        onDelete={handleDeletePlant}
      />

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};

export default AdminPlantManager;

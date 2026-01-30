import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { FaPlus } from "react-icons/fa";

// Components
import AdminPlantForm from "./AdminPlantForm";
import Pagination from "./Pagination";
import PlantToolbar from "./admin/plants/PlantToolbar";
import PlantDetailModal from "./admin/plants/PlantDetailModal";
import PlantTable from "./admin/plants/PlantTable"; // Import mới

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  // --- LOGIC FILTER & SORT ---
  const filteredPlants = plants
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        filterCategory === "all" ||
        p.category_id === parseInt(filterCategory) ||
        p.category_name === filterCategory;
      return matchSearch && matchCategory;
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
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [itemsPerPage, totalPages, currentPage]);

  return (
    <div>
      <div className="admin-header">
        <h2 className="admin-title">🌿 Danh Sách Cây</h2>
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

      {/* COMPONENT: FORM ADD/EDIT */}
      {showForm && (
        <div className="modal-form-overlay">
          <div className="modal-header">
            <h3>{editingPlant ? "Sửa Cây" : "Thêm Cây"}</h3>
            <button onClick={() => setShowForm(false)} className="btn-close-modal">
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
      />

      {/* COMPONENT: TABLE (Đã tách ra) */}
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
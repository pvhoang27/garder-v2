import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import AdminPlantForm from "./AdminPlantForm";
import Pagination from "./Pagination";
import PlantToolbar from "./admin/plants/PlantToolbar"; // Import mới
import PlantDetailModal from "./admin/plants/PlantDetailModal"; // Import mới
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const AdminPlantManager = ({ isMobile }) => {
  const [plants, setPlants] = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingPlant, setViewingPlant] = useState(null);
  const [categories, setCategories] = useState([]);

  // Filter States
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
    } catch (error) { console.error(error); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get("/categories");
      setCategories(res.data);
    } catch (error) { console.error(error); }
  };

  const handleDeletePlant = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa cây này?")) return;
    try {
      await axiosClient.delete(`/plants/${id}`);
      alert("Xóa thành công!");
      fetchPlants();
    } catch (error) { alert("Lỗi khi xóa!"); }
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
    } catch (error) { alert("Không tải được chi tiết cây!"); }
  };

  // --- LOGIC PROCESSING ---
  const filteredPlants = plants.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === "all" || p.category_id === parseInt(filterCategory) || p.category_name === filterCategory;
    return matchSearch && matchCategory;
  }).sort((a, b) => {
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

  // --- STYLES ---
  const styles = {
    btnAdd: { background: "#2e7d32", color: "white", padding: "10px 15px", borderRadius: "5px", border: "none", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", height: "40px", fontSize: "14px" },
    formContainer: { background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", marginBottom: "20px" },
    closeBtn: { background: "transparent", border: "none", fontSize: "24px", cursor: "pointer" },
    tableContainer: { background: "white", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", overflowX: "auto" },
    th: { padding: "12px", textAlign: "left", fontSize: "14px", color: "#555", whiteSpace: "nowrap", background: "#eee" },
    td: { padding: "12px", color: "#333", borderBottom: "1px solid #eee", fontSize: "14px" },
    actionBtn: { padding: "6px 8px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", color: "white" },
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }}>🌿 Danh Sách Cây</h2>
        <button onClick={() => { setEditingPlant(null); setShowForm(true); }} style={styles.btnAdd}>
          <FaPlus /> <span style={{ display: isMobile ? "none" : "inline" }}>Thêm Mới</span>
        </button>
      </div>

      {/* COMPONENT: FORM ADD/EDIT */}
      {showForm && (
        <div style={styles.formContainer}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
            <h3>{editingPlant ? "Sửa Cây" : "Thêm Cây"}</h3>
            <button onClick={() => setShowForm(false)} style={styles.closeBtn}>&times;</button>
          </div>
          <AdminPlantForm initialData={editingPlant} onSuccess={handleFormSuccess} />
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
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        filterCategory={filterCategory} setFilterCategory={setFilterCategory}
        sortBy={sortBy} setSortBy={setSortBy}
        categories={categories}
      />

      {/* TABLE */}
      <div style={styles.tableContainer}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr>
              <th style={styles.th}>Ảnh</th>
              <th style={styles.th}>Tên</th>
              <th style={styles.th}>Danh mục</th>
              <th style={styles.th}>Giá</th>
              <th style={styles.th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentPlants.map((plant) => (
              <tr key={plant.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={styles.td}>
                  {plant.thumbnail && <img src={`http://localhost:3000${plant.thumbnail}`} alt="" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />}
                </td>
                <td style={styles.td}><strong>{plant.name}</strong></td>
                <td style={styles.td}>{plant.category_name}</td>
                <td style={{ ...styles.td, color: "#d32f2f" }}>{Number(plant.price).toLocaleString()}</td>
                <td style={styles.td}>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => handleViewDetails(plant.id)} style={{...styles.actionBtn, background: "#fbc02d"}}><FaEye /></button>
                    <button onClick={() => { setEditingPlant(plant); setShowForm(true); window.scrollTo(0, 0); }} style={{...styles.actionBtn, background: "#1976d2"}}><FaEdit /></button>
                    <button onClick={() => handleDeletePlant(plant.id)} style={{...styles.actionBtn, background: "#d32f2f"}}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
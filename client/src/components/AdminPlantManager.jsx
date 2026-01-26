import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import AdminPlantForm from "./AdminPlantForm";
import Pagination from "./Pagination"; // Chúng ta sẽ tách Pagination ra file riêng
import { FaSearch, FaSortAmountDown, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const AdminPlantManager = ({ isMobile }) => {
  const [plants, setPlants] = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingPlant, setViewingPlant] = useState(null);
  const [categories, setCategories] = useState([]); // Để filter

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

  // --- LOGIC FILTER & SORT ---
  const processPlants = () => {
    let result = plants.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = filterCategory === "all" || p.category_id === parseInt(filterCategory) || p.category_name === filterCategory;
      return matchSearch && matchCategory;
    });
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.created_at) - new Date(a.created_at);
        case "oldest": return new Date(a.created_at) - new Date(b.created_at);
        case "price-asc": return Number(a.price) - Number(b.price);
        case "price-desc": return Number(b.price) - Number(a.price);
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
    return result;
  };

  const filteredPlants = processPlants();
  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
  
  // Reset trang khi filter thay đổi
  useEffect(() => {
     if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [itemsPerPage, totalPages, currentPage]);

  const currentPlants = filteredPlants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- STYLES ---
  const btnAddStyle = { background: "#2e7d32", color: "white", padding: "10px 15px", borderRadius: "5px", border: "none", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", height: "40px" };
  const formContainerStyle = { background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", marginBottom: "20px" };
  const closeBtnStyle = { background: "transparent", border: "none", fontSize: "20px", cursor: "pointer" };
  const toolbarStyle = { display: "flex", gap: "10px", marginBottom: "20px", background: "white", padding: "15px", borderRadius: "8px", flexWrap: "wrap", alignItems: "center" };
  const inputSearchStyle = { width: "100%", padding: "10px 10px 10px 35px", borderRadius: "5px", border: "1px solid #ddd" };
  const selectStyle = { flex: 1, minWidth: "130px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", cursor: "pointer" };
  const tableContainerStyle = { background: "white", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", overflowX: "auto" };
  const thStyle = { padding: "12px", textAlign: "left", fontSize: "14px", color: "#555", whiteSpace: "nowrap", background: "#eee" };
  const tdStyle = { padding: "12px", color: "#333", borderBottom: "1px solid #eee" };
  const btnViewStyle = { padding: "6px 10px", background: "#fbc02d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };
  const btnEditStyle = { padding: "6px 10px", background: "#1976d2", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };
  const btnDeleteStyle = { padding: "6px 10px", background: "#d32f2f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };
  const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" };
  const modalContentStyle = { background: "white", width: "800px", maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <h2>🌿 Danh Sách Cây</h2>
        <button onClick={() => { setEditingPlant(null); setShowForm(true); }} className="btn-add" style={btnAddStyle}>
          <FaPlus /> <span style={{ display: isMobile ? "none" : "inline" }}>Thêm Mới</span>
        </button>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div style={formContainerStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <h3>{editingPlant ? "Sửa Cây" : "Thêm Cây"}</h3>
            <button onClick={() => setShowForm(false)} style={closeBtnStyle}>&times;</button>
          </div>
          <AdminPlantForm initialData={editingPlant} onSuccess={handleFormSuccess} />
        </div>
      )}

      {/* DETAIL MODAL */}
      {viewingPlant && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "20px" }}>
              <h3 style={{ color: "#2e7d32", margin: 0 }}>Chi Tiết: {viewingPlant.name}</h3>
              <button onClick={() => setViewingPlant(null)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: "20px" }}>
              <div>
                <img src={`http://localhost:3000${viewingPlant.thumbnail}`} alt={viewingPlant.name} style={{ width: "100%", borderRadius: "10px", objectFit: "cover" }} />
              </div>
              <div>
                <p><strong>Giá:</strong> {Number(viewingPlant.price).toLocaleString()} đ</p>
                <p><strong>Danh mục:</strong> {viewingPlant.category_name}</p>
                <p><strong>Mô tả:</strong> {viewingPlant.description}</p>
                <div style={{ marginTop: "15px" }}>
                  <strong>Hướng dẫn chăm sóc:</strong>
                  <p style={{ whiteSpace: "pre-line", fontSize: "0.9rem", background: "#f9f9f9", padding: "10px", borderRadius: "5px" }}>{viewingPlant.care_instruction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOLBAR */}
      <div style={toolbarStyle}>
        <div style={{ flex: 2, minWidth: "200px", position: "relative" }}>
          <FaSearch style={{ position: "absolute", left: "10px", top: "12px", color: "#888" }} />
          <input type="text" placeholder="Tìm tên cây..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={inputSearchStyle} />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={selectStyle}>
          <option value="all">-- Danh mục --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}> {cat.name} </option>
          ))}
        </select>
        <div style={{ flex: 1, minWidth: "150px", position: "relative" }}>
          <FaSortAmountDown style={{ position: "absolute", left: "10px", top: "12px", color: "#888" }} />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={inputSearchStyle}>
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá tăng</option>
            <option value="price-desc">Giá giảm</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div style={tableContainerStyle}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
          <thead>
            <tr>
              <th style={thStyle}>Ảnh</th>
              <th style={thStyle}>Tên</th>
              <th style={thStyle}>Danh mục</th>
              <th style={thStyle}>Giá</th>
              <th style={thStyle}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentPlants.map((plant) => (
              <tr key={plant.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>
                  {plant.thumbnail && (
                    <img src={`http://localhost:3000${plant.thumbnail}`} alt="" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                  )}
                </td>
                <td style={tdStyle}><strong>{plant.name}</strong></td>
                <td style={tdStyle}>{plant.category_name}</td>
                <td style={{ ...tdStyle, color: "#d32f2f" }}>{Number(plant.price).toLocaleString()}</td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => handleViewDetails(plant.id)} style={btnViewStyle} title="Xem"> <FaEye /> </button>
                    <button onClick={() => { setEditingPlant(plant); setShowForm(true); window.scrollTo(0, 0); }} style={btnEditStyle} title="Sửa"> <FaEdit /> </button>
                    <button onClick={() => handleDeletePlant(plant.id)} style={btnDeleteStyle} title="Xóa"> <FaTrash /> </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentPlants.length === 0 && (
              <tr><td colSpan="5" style={{ padding: "20px", textAlign: "center" }}>Không có dữ liệu.</td></tr>
            )}
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
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AdminPlantForm from "../components/AdminPlantForm";
import {
  FaLeaf,
  FaList,
  FaUsers,
  FaCog,
  FaSearch,
  FaTrash,
  FaEdit,
  FaPlus,
  FaSignOutAlt,
  FaLayerGroup, // Icon cho Layout
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("plants"); // plants | categories | users

  // --- STATES CHO PLANT ---
  const [plants, setPlants] = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // --- THAY ĐỔI: Chuyển itemsPerPage thành State để Admin điều chỉnh ---
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // --- STATES CHO CATEGORY ---
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  // --- STATES CHO USER ---
  const [users, setUsers] = useState([]);

  // Load dữ liệu ban đầu
  useEffect(() => {
    fetchCategories();
    if (activeTab === "plants") fetchPlants();
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  // --- API CALLS ---
  const fetchPlants = async () => {
    try {
      const res = await axiosClient.get("/plants");
      setPlants(res.data);
    } catch (error) {
      console.error("Lỗi tải plants:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Lỗi tải categories:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi tải users (có thể chưa có API):", error);
    }
  };

  // --- XỬ LÝ PLANT ---
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

  // Logic Lọc & Tìm kiếm & Phân trang Plant
  const filteredPlants = plants.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      filterCategory === "all" ||
      p.category_id === parseInt(filterCategory) ||
      p.category_name === filterCategory;
    return matchSearch && matchCategory;
  });

  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);

  // Đảm bảo currentPage không vượt quá totalPages khi thay đổi itemsPerPage
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [itemsPerPage, totalPages, currentPage]);

  const currentPlants = filteredPlants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // --- XỬ LÝ CATEGORY ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await axiosClient.post("/categories", { name: newCategoryName });
      alert("Thêm danh mục thành công!");
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      alert("Lỗi thêm danh mục!");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      !window.confirm("Xóa danh mục này? Cây thuộc danh mục sẽ bị ảnh hưởng.")
    )
      return;
    try {
      await axiosClient.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      alert("Lỗi xóa danh mục!");
    }
  };

  // --- XỬ LÝ USER ---
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa người dùng này?")) return;
    try {
      await axiosClient.delete(`/users/${id}`);
      alert("Đã xóa user.");
      fetchUsers();
    } catch (error) {
      alert("Lỗi xóa user!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f8" }}>
      {/* --- SIDEBAR MENU --- */}
      <div
        style={{
          width: "250px",
          background: "#1a1a1a",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          height: "100%",
          zIndex: 100,
        }}
      >
        <div
          style={{
            padding: "20px",
            fontSize: "20px",
            fontWeight: "bold",
            borderBottom: "1px solid #333",
            color: "#4caf50",
          }}
        >
          Garder Admin
        </div>
        <nav style={{ flex: 1, padding: "20px 0" }}>
          <MenuButton
            active={activeTab === "plants"}
            onClick={() => setActiveTab("plants")}
            icon={<FaLeaf />}
            label="Quản lý Cây"
          />
          <MenuButton
            active={activeTab === "categories"}
            onClick={() => setActiveTab("categories")}
            icon={<FaList />}
            label="Quản lý Danh mục"
          />
          <MenuButton
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            icon={<FaUsers />}
            label="Quản lý Users"
          />

          <div
            style={{
              borderTop: "1px solid #333",
              marginTop: "10px",
              paddingTop: "10px",
            }}
          >
            <Link
              to="/admin/popup"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#ccc",
                textDecoration: "none",
                padding: "12px 20px",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#333")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              <FaCog /> Cấu hình Popup
            </Link>

            <Link
              to="/admin/layout"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#ccc",
                textDecoration: "none",
                padding: "12px 20px",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#333")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              <FaLayerGroup /> Bố cục Trang chủ
            </Link>
          </div>
        </nav>
        <div style={{ padding: "20px", borderTop: "1px solid #333" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px",
              background: "#d32f2f",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <FaSignOutAlt /> Đăng xuất
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={{ marginLeft: "250px", flex: 1, padding: "30px" }}>
        {/* === TAB 1: QUẢN LÝ CÂY === */}
        {activeTab === "plants" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2>🌿 Danh Sách Cây Cảnh</h2>
              <button
                onClick={() => {
                  setEditingPlant(null);
                  setShowForm(true);
                }}
                className="btn-add"
                style={{
                  background: "#2e7d32",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                }}
              >
                <FaPlus /> Thêm Cây Mới
              </button>
            </div>

            {/* FORM THÊM/SỬA */}
            {showForm && (
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                  }}
                >
                  <h3>{editingPlant ? "Chỉnh Sửa Cây" : "Thêm Cây Mới"}</h3>
                  <button
                    onClick={() => setShowForm(false)}
                    style={{
                      background: "transparent",
                      border: "none",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
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

            {/* TOOLBAR */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                marginBottom: "20px",
                background: "white",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <div style={{ flex: 1, position: "relative" }}>
                <FaSearch
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "12px",
                    color: "#888",
                  }}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên cây..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 10px 10px 35px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  minWidth: "200px",
                }}
              >
                <option value="all">-- Tất cả danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TABLE */}
            <div
              style={{
                background: "white",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#eee" }}>
                  <tr>
                    <th style={thStyle}>Ảnh</th>
                    <th style={thStyle}>Tên cây</th>
                    <th style={thStyle}>Danh mục</th>
                    <th style={thStyle}>Giá</th>
                    <th style={thStyle}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPlants.map((plant) => (
                    <tr
                      key={plant.id}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <td style={tdStyle}>
                        {plant.thumbnail && (
                          <img
                            src={`http://localhost:3000${plant.thumbnail}`}
                            alt=""
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        )}
                      </td>
                      <td style={tdStyle}>
                        <strong>{plant.name}</strong>
                      </td>
                      <td style={tdStyle}>{plant.category_name}</td>
                      <td
                        style={{
                          ...tdStyle,
                          color: "#d32f2f",
                          fontWeight: "bold",
                        }}
                      >
                        {Number(plant.price).toLocaleString()} đ
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => {
                            setEditingPlant(plant);
                            setShowForm(true);
                            window.scrollTo(0, 0);
                          }}
                          style={btnEditStyle}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeletePlant(plant.id)}
                          style={btnDeleteStyle}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentPlants.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ padding: "20px", textAlign: "center" }}
                      >
                        Không tìm thấy cây nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROL & PAGE SELECTION */}
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between", // Căn 2 bên
                alignItems: "center",
              }}
            >
              {/* SELECTOR SỐ LƯỢNG TRANG (NEW) */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ color: "#555", fontSize: "14px" }}>
                  Hiển thị:
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset về trang 1 khi đổi số lượng
                  }}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                >
                  <option value={5}>5 dòng</option>
                  <option value={10}>10 dòng</option>
                  <option value={20}>20 dòng</option>
                  <option value={50}>50 dòng</option>
                  <option value={100}>100 dòng</option>
                </select>
              </div>

              {/* NÚT PHÂN TRANG */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    style={{
                      ...btnPageStyle,
                      opacity: currentPage === 1 ? 0.5 : 1,
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    Trước
                  </button>
                  <span style={{ padding: "8px 15px", fontWeight: "bold" }}>
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    style={{
                      ...btnPageStyle,
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      cursor:
                        currentPage === totalPages ? "not-allowed" : "pointer",
                    }}
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === TAB 2: QUẢN LÝ DANH MỤC === */}
        {activeTab === "categories" && (
          <div>
            <h2>📂 Quản Lý Danh Mục</h2>
            <div
              style={{
                display: "flex",
                gap: "10px",
                margin: "20px 0",
                background: "white",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nhập tên danh mục mới..."
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                onClick={handleAddCategory}
                style={{
                  padding: "10px 20px",
                  background: "#2e7d32",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Thêm Mới
              </button>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#eee" }}>
                  <tr>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Tên Danh Mục</th>
                    <th style={thStyle}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={tdStyle}>#{cat.id}</td>
                      <td style={tdStyle}>
                        <strong>{cat.name}</strong>
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          style={btnDeleteStyle}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === TAB 3: QUẢN LÝ USERS === */}
        {activeTab === "users" && (
          <div>
            <h2>👥 Quản Lý Người Dùng</h2>
            <div
              style={{
                background: "white",
                borderRadius: "8px",
                overflow: "hidden",
                marginTop: "20px",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#eee" }}>
                  <tr>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Họ Tên</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Vai trò</th>
                    <th style={thStyle}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        style={{ borderBottom: "1px solid #eee" }}
                      >
                        <td style={tdStyle}>#{user.id}</td>
                        <td style={tdStyle}>{user.full_name}</td>
                        <td style={tdStyle}>{user.email}</td>
                        <td style={tdStyle}>
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              background:
                                user.role === "admin" ? "#e3f2fd" : "#f1f8e9",
                              color:
                                user.role === "admin" ? "#1976d2" : "#388e3c",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {user.role !== "admin" && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              style={btnDeleteStyle}
                            >
                              Xóa User
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ padding: "20px", textAlign: "center" }}
                      >
                        Chưa có dữ liệu users hoặc API chưa sẵn sàng.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- STYLES COMPONENT CON ---
const MenuButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "15px 20px",
      background: active ? "#2e7d32" : "transparent",
      color: active ? "white" : "#ccc",
      border: "none",
      textAlign: "left",
      fontSize: "16px",
      cursor: "pointer",
      transition: "0.2s",
    }}
  >
    {icon} {label}
  </button>
);

const thStyle = {
  padding: "15px",
  textAlign: "left",
  fontSize: "14px",
  color: "#555",
};

const tdStyle = {
  padding: "15px",
  color: "#333",
};

const btnEditStyle = {
  marginRight: "10px",
  padding: "8px 12px",
  background: "#1976d2",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const btnDeleteStyle = {
  padding: "8px 12px",
  background: "#d32f2f",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const btnPageStyle = {
  padding: "8px 12px",
  background: "white",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "pointer",
};

export default AdminDashboard;

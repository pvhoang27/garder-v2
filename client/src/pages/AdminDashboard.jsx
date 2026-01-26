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
  FaLayerGroup,
  FaSortAmountDown,
  FaTimes,
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("plants"); // plants | categories | users

  // =========================================
  // 1. STATES CHO PLANT (CÂY CẢNH)
  // =========================================
  const [plants, setPlants] = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // -- Bộ lọc & Phân trang Plant --
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // =========================================
  // 2. STATES CHO CATEGORY (DANH MỤC) - NEW
  // =========================================
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catFormData, setCatFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  // =========================================
  // 3. STATES CHO USER (NGƯỜI DÙNG)
  // =========================================
  const [users, setUsers] = useState([]);

  // --- LOAD DATA BAN ĐẦU ---
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
      console.error("Lỗi tải users:", error);
    }
  };

  // =========================================
  // XỬ LÝ LOGIC PLANT
  // =========================================
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

  // Logic Lọc & Sắp xếp Plant
  const processPlants = () => {
    let result = plants.filter((p) => {
      const matchSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory =
        filterCategory === "all" ||
        p.category_id === parseInt(filterCategory) ||
        p.category_name === filterCategory;
      return matchSearch && matchCategory;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "price-asc":
          return Number(a.price) - Number(b.price);
        case "price-desc":
          return Number(b.price) - Number(a.price);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
    return result;
  };

  const filteredPlants = processPlants();
  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [itemsPerPage, totalPages, currentPage]);

  const currentPlants = filteredPlants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // =========================================
  // XỬ LÝ LOGIC CATEGORY (FULL CRUD)
  // =========================================

  // Hàm tạo slug từ tên (Tiếng Việt -> Slug)
  const generateSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu
      .replace(/\s+/g, "-") // Thay khoảng trắng bằng -
      .replace(/[^\w\-]+/g, "") // Bỏ ký tự đặc biệt
      .replace(/\-\-+/g, "-") // Thay nhiều - bằng 1 -
      .replace(/^-+/, "") // Cắt - đầu
      .replace(/-+$/, ""); // Cắt - cuối
  };

  const handleCatInputChange = (e) => {
    const { name, value } = e.target;
    setCatFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Nếu đang nhập tên và không phải đang sửa (hoặc muốn auto update slug)
      if (name === "name" && !editingCategory) {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // UPDATE
        await axiosClient.put(`/categories/${editingCategory.id}`, catFormData);
        alert("Cập nhật danh mục thành công!");
      } else {
        // CREATE
        await axiosClient.post("/categories", catFormData);
        alert("Thêm danh mục thành công!");
      }

      // Reset & Refresh
      fetchCategories();
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCatFormData({ name: "", slug: "", description: "" });
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Lỗi khi lưu danh mục!";
      alert(msg);
    }
  };

  const handleEditCategoryClick = (cat) => {
    setEditingCategory(cat);
    setCatFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id) => {
    if (
      !window.confirm(
        "CẢNH BÁO: Xóa danh mục sẽ khiến các cây thuộc danh mục này mất liên kết. Bạn có chắc không?",
      )
    )
      return;
    try {
      await axiosClient.delete(`/categories/${id}`);
      alert("Đã xóa danh mục.");
      fetchCategories();
    } catch (error) {
      alert("Lỗi xóa danh mục!");
    }
  };

  // =========================================
  // XỬ LÝ LOGIC USER
  // =========================================
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
            <Link to="/admin/popup" style={linkStyle}>
              {" "}
              <FaCog /> Cấu hình Popup{" "}
            </Link>
            <Link to="/admin/layout" style={linkStyle}>
              {" "}
              <FaLayerGroup /> Bố cục Trang chủ{" "}
            </Link>
          </div>
        </nav>
        <div style={{ padding: "20px", borderTop: "1px solid #333" }}>
          <button onClick={handleLogout} style={btnLogoutStyle}>
            {" "}
            <FaSignOutAlt /> Đăng xuất{" "}
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
                style={btnAddStyle}
              >
                <FaPlus /> Thêm Cây Mới
              </button>
            </div>

            {showForm && (
              <div style={formContainerStyle}>
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
                    style={closeBtnStyle}
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

            {/* Filter Toolbar */}
            <div style={toolbarStyle}>
              <div style={{ flex: 2, minWidth: "200px", position: "relative" }}>
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
                  placeholder="Tìm kiếm tên cây..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={inputSearchStyle}
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={selectStyle}
              >
                <option value="all">-- Tất cả danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {" "}
                    {cat.name}{" "}
                  </option>
                ))}
              </select>
              <div style={{ flex: 1, minWidth: "180px", position: "relative" }}>
                <FaSortAmountDown
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "12px",
                    color: "#888",
                  }}
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={inputSearchStyle}
                >
                  <option value="newest">🕒 Mới nhất</option>
                  <option value="oldest">🕒 Cũ nhất</option>
                  <option value="price-asc">💰 Giá tăng dần</option>
                  <option value="price-desc">💰 Giá giảm dần</option>
                  <option value="name-asc">🅰️ Tên A-Z</option>
                </select>
              </div>
            </div>

            {/* Table Plant */}
            <div style={tableContainerStyle}>
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
                        {" "}
                        <strong>{plant.name}</strong>{" "}
                      </td>
                      <td style={tdStyle}>{plant.category_name}</td>
                      <td
                        style={{
                          ...tdStyle,
                          color: "#d32f2f",
                          fontWeight: "bold",
                        }}
                      >
                        {" "}
                        {Number(plant.price).toLocaleString()} đ{" "}
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
                          {" "}
                          <FaEdit />{" "}
                        </button>
                        <button
                          onClick={() => handleDeletePlant(plant.id)}
                          style={btnDeleteStyle}
                        >
                          {" "}
                          <FaTrash />{" "}
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

            {/* Pagination */}
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        )}

        {/* === TAB 2: QUẢN LÝ DANH MỤC (UPDATED FULL CRUD) === */}
        {activeTab === "categories" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2>📂 Quản Lý Danh Mục</h2>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCatFormData({ name: "", slug: "", description: "" });
                  setShowCategoryForm(true);
                }}
                style={btnAddStyle}
              >
                <FaPlus /> Thêm Danh Mục
              </button>
            </div>

            {/* FORM THÊM/SỬA DANH MỤC */}
            {showCategoryForm && (
              <div style={formContainerStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                  }}
                >
                  <h3>
                    {editingCategory
                      ? "Chỉnh Sửa Danh Mục"
                      : "Thêm Danh Mục Mới"}
                  </h3>
                  <button
                    onClick={() => setShowCategoryForm(false)}
                    style={closeBtnStyle}
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleSubmitCategory}>
                  <div style={{ marginBottom: "15px" }}>
                    <label style={labelStyle}>Tên Danh Mục (*)</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={catFormData.name}
                      onChange={handleCatInputChange}
                      style={inputStyle}
                      placeholder="Ví dụ: Cây Trong Nhà"
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label style={labelStyle}>Slug (URL thân thiện) (*)</label>
                    <input
                      type="text"
                      name="slug"
                      required
                      value={catFormData.slug}
                      onChange={handleCatInputChange}
                      style={inputStyle}
                      placeholder="tu-dong-tao-tu-ten"
                    />
                    <small style={{ color: "#666" }}>
                      Dùng để hiển thị trên URL (ví dụ: /category/cay-trong-nha)
                    </small>
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label style={labelStyle}>Mô tả</label>
                    <textarea
                      name="description"
                      rows="3"
                      value={catFormData.description}
                      onChange={handleCatInputChange}
                      style={{ ...inputStyle, height: "auto" }}
                      placeholder="Mô tả ngắn về danh mục này..."
                    />
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => setShowCategoryForm(false)}
                      style={{ ...btnCancelStyle, marginRight: "10px" }}
                    >
                      Hủy
                    </button>
                    <button type="submit" style={btnSaveStyle}>
                      {editingCategory ? "Cập Nhật" : "Lưu Lại"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TABLE CATEGORY */}
            <div style={tableContainerStyle}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#eee" }}>
                  <tr>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Tên Danh Mục</th>
                    <th style={thStyle}>Slug</th>
                    <th style={thStyle}>Mô tả</th>
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
                        <span
                          style={{
                            background: "#e0f2f1",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.9rem",
                            color: "#00695c",
                          }}
                        >
                          {cat.slug}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {cat.description ? (
                          cat.description.length > 50 ? (
                            cat.description.substring(0, 50) + "..."
                          ) : (
                            cat.description
                          )
                        ) : (
                          <em style={{ color: "#999" }}>Không có</em>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleEditCategoryClick(cat)}
                          style={btnEditStyle}
                        >
                          {" "}
                          <FaEdit />{" "}
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          style={btnDeleteStyle}
                        >
                          {" "}
                          <FaTrash />{" "}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ padding: "20px", textAlign: "center" }}
                      >
                        Chưa có danh mục nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === TAB 3: QUẢN LÝ USER === */}
        {activeTab === "users" && (
          <div>
            <h2>👥 Quản Lý Người Dùng</h2>
            <div style={{ ...tableContainerStyle, marginTop: "20px" }}>
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
                  {users.map((user) => (
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
                            {" "}
                            Xóa User{" "}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB COMPONENTS & STYLES ---

const Pagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
}) => {
  if (totalPages <= 1 && itemsPerPage === 5) return null;
  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ color: "#555", fontSize: "14px" }}>Hiển thị:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
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
        </select>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          style={{
            ...btnPageStyle,
            opacity: currentPage === 1 ? 0.5 : 1,
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          {" "}
          Trước{" "}
        </button>
        <span style={{ padding: "8px 15px", fontWeight: "bold" }}>
          {" "}
          Trang {currentPage} / {totalPages}{" "}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          style={{
            ...btnPageStyle,
            opacity: currentPage === totalPages ? 0.5 : 1,
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          {" "}
          Sau{" "}
        </button>
      </div>
    </div>
  );
};

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

// CSS Styles
const linkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "#ccc",
  textDecoration: "none",
  padding: "12px 20px",
  transition: "0.3s",
};
const btnLogoutStyle = {
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
};
const btnAddStyle = {
  background: "#2e7d32",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  cursor: "pointer",
};
const formContainerStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  marginBottom: "20px",
};
const closeBtnStyle = {
  background: "transparent",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
};
const toolbarStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "20px",
  background: "white",
  padding: "15px",
  borderRadius: "8px",
  flexWrap: "wrap",
  alignItems: "center",
};
const inputSearchStyle = {
  width: "100%",
  padding: "10px 10px 10px 35px",
  borderRadius: "5px",
  border: "1px solid #ddd",
};
const selectStyle = {
  flex: 1,
  minWidth: "150px",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ddd",
  cursor: "pointer",
};
const tableContainerStyle = {
  background: "white",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
};
const thStyle = {
  padding: "15px",
  textAlign: "left",
  fontSize: "14px",
  color: "#555",
};
const tdStyle = { padding: "15px", color: "#333" };
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
const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "5px",
  color: "#333",
};
const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};
const btnSaveStyle = {
  padding: "10px 20px",
  background: "#2e7d32",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
const btnCancelStyle = {
  padding: "10px 20px",
  background: "#757575",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default AdminDashboard;

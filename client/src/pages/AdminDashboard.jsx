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
  FaEye,
  FaBars, // <-- Icon Menu Mobile
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("plants"); // plants | categories | users

  // --- RESPONSIVE STATES ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- STATES CHO PLANT ---
  const [plants, setPlants] = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingPlant, setViewingPlant] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // --- STATES CHO CATEGORY ---
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catFormData, setCatFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  // --- STATES CHO USER ---
  const [users, setUsers] = useState([]);

  // --- LOAD DATA & RESIZE EVENT ---
  useEffect(() => {
    fetchCategories();
    if (activeTab === "plants") fetchPlants();
    if (activeTab === "users") fetchUsers();

    // Lắng nghe resize màn hình
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsSidebarOpen(false); // Reset khi về PC
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  // --- API CALLS ---
  const fetchPlants = async () => {
    /* Giữ nguyên logic cũ */
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
  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // --- XỬ LÝ CLICK MENU (Mobile: Chọn xong tự đóng sidebar) ---
  const handleMenuClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) setIsSidebarOpen(false);
  };

  // --- LOGIC XỬ LÝ DỮ LIỆU (Plant/Category/User) - GIỮ NGUYÊN ---
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
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [itemsPerPage, totalPages, currentPage]);
  const currentPlants = filteredPlants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Category Logic
  const generateSlug = (text) =>
    text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  const handleCatInputChange = (e) => {
    const { name, value } = e.target;
    setCatFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "name" && !editingCategory)
        newData.slug = generateSlug(value);
      return newData;
    });
  };
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axiosClient.put(`/categories/${editingCategory.id}`, catFormData);
        alert("Cập nhật thành công!");
      } else {
        await axiosClient.post("/categories", catFormData);
        alert("Thêm thành công!");
      }
      fetchCategories();
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCatFormData({ name: "", slug: "", description: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi lưu!");
    }
  };
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("CẢNH BÁO: Xóa danh mục sẽ ảnh hưởng đến cây.")) return;
    try {
      await axiosClient.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      alert("Lỗi xóa danh mục!");
    }
  };

  // User Logic
  const handleDeleteUser = async (id) => {
    if (window.confirm("Xóa user này?")) {
      try {
        await axiosClient.delete(`/users/${id}`);
        fetchUsers();
      } catch {
        alert("Lỗi xóa user!");
      }
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // --- STYLES RESPONSIVE ---
  const sidebarStyle = {
    width: "250px",
    background: "#1a1a1a",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    height: "100%",
    zIndex: 1000,
    transition: "0.3s ease-in-out",
    left: isMobile ? (isSidebarOpen ? "0" : "-260px") : "0", // Ẩn/Hiện Sidebar Mobile
    top: 0,
    boxShadow: isSidebarOpen ? "2px 0 10px rgba(0,0,0,0.5)" : "none",
  };

  const mainContentStyle = {
    marginLeft: isMobile ? "0" : "250px", // Mobile full width
    flex: 1,
    padding: "30px",
    paddingTop: isMobile ? "80px" : "30px", // Né Mobile Header
    transition: "0.3s",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f8" }}>
      {/* --- 1. MOBILE HEADER (Chỉ hiện khi isMobile = true) --- */}
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

      {/* --- 2. OVERLAY (Lớp phủ đen khi mở menu mobile) --- */}
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

      {/* --- 3. SIDEBAR MENU --- */}
      <div style={sidebarStyle}>
        <div
          style={{
            padding: "20px",
            fontSize: "20px",
            fontWeight: "bold",
            borderBottom: "1px solid #333",
            color: "#4caf50",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Garder Admin</span>
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#888",
                fontSize: "20px",
              }}
            >
              <FaTimes />
            </button>
          )}
        </div>

        <nav style={{ flex: 1, padding: "20px 0", overflowY: "auto" }}>
          <MenuButton
            active={activeTab === "plants"}
            onClick={() => handleMenuClick("plants")}
            icon={<FaLeaf />}
            label="Quản lý Cây"
          />
          <MenuButton
            active={activeTab === "categories"}
            onClick={() => handleMenuClick("categories")}
            icon={<FaList />}
            label="Quản lý Danh mục"
          />
          <MenuButton
            active={activeTab === "users"}
            onClick={() => handleMenuClick("users")}
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
              style={linkStyle}
              onClick={() => isMobile && setIsSidebarOpen(false)}
            >
              {" "}
              <FaCog /> Cấu hình Popup{" "}
            </Link>
            <Link
              to="/admin/layout"
              style={linkStyle}
              onClick={() => isMobile && setIsSidebarOpen(false)}
            >
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

      {/* --- 4. MAIN CONTENT --- */}
      <div style={mainContentStyle}>
        {/* === TAB PLANTS === */}
        {activeTab === "plants" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <h2>🌿 Danh Sách Cây</h2>
              <button
                onClick={() => {
                  setEditingPlant(null);
                  setShowForm(true);
                }}
                className="btn-add"
                style={btnAddStyle}
              >
                <FaPlus />{" "}
                <span style={{ display: isMobile ? "none" : "inline" }}>
                  Thêm Mới
                </span>
              </button>
            </div>

            {/* FORM MODAL */}
            {showForm && (
              <div style={formContainerStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                  }}
                >
                  <h3>{editingPlant ? "Sửa Cây" : "Thêm Cây"}</h3>
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

            {/* DETAIL MODAL */}
            {viewingPlant && (
              <div style={modalOverlayStyle}>
                <div style={modalContentStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    <h3 style={{ color: "#2e7d32", margin: 0 }}>
                      Chi Tiết: {viewingPlant.name}
                    </h3>
                    <button
                      onClick={() => setViewingPlant(null)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                      }}
                    >
                      &times;
                    </button>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <img
                        src={`http://localhost:3000${viewingPlant.thumbnail}`}
                        alt={viewingPlant.name}
                        style={{
                          width: "100%",
                          borderRadius: "10px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div>
                      <p>
                        <strong>Giá:</strong>{" "}
                        {Number(viewingPlant.price).toLocaleString()} đ
                      </p>
                      <p>
                        <strong>Danh mục:</strong> {viewingPlant.category_name}
                      </p>
                      <p>
                        <strong>Mô tả:</strong> {viewingPlant.description}
                      </p>
                      <div style={{ marginTop: "15px" }}>
                        <strong>Hướng dẫn chăm sóc:</strong>
                        <p
                          style={{
                            whiteSpace: "pre-line",
                            fontSize: "0.9rem",
                            background: "#f9f9f9",
                            padding: "10px",
                            borderRadius: "5px",
                          }}
                        >
                          {viewingPlant.care_instruction}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TOOLBAR */}
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
                  placeholder="Tìm tên cây..."
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
                <option value="all">-- Danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {" "}
                    {cat.name}{" "}
                  </option>
                ))}
              </select>
              <div style={{ flex: 1, minWidth: "150px", position: "relative" }}>
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
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá tăng</option>
                  <option value="price-desc">Giá giảm</option>
                </select>
              </div>
            </div>

            {/* TABLE (Responsive Scroll) */}
            <div style={{ ...tableContainerStyle, overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "600px",
                }}
              >
                {" "}
                {/* MinWidth để không vỡ table trên mobile */}
                <thead style={{ background: "#eee" }}>
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
                              width: "40px",
                              height: "40px",
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
                      <td style={{ ...tdStyle, color: "#d32f2f" }}>
                        {Number(plant.price).toLocaleString()}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button
                            onClick={() => handleViewDetails(plant.id)}
                            style={btnViewStyle}
                            title="Xem"
                          >
                            {" "}
                            <FaEye />{" "}
                          </button>
                          <button
                            onClick={() => {
                              setEditingPlant(plant);
                              setShowForm(true);
                              window.scrollTo(0, 0);
                            }}
                            style={btnEditStyle}
                            title="Sửa"
                          >
                            {" "}
                            <FaEdit />{" "}
                          </button>
                          <button
                            onClick={() => handleDeletePlant(plant.id)}
                            style={btnDeleteStyle}
                            title="Xóa"
                          >
                            {" "}
                            <FaTrash />{" "}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentPlants.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ padding: "20px", textAlign: "center" }}
                      >
                        Không có dữ liệu.
                      </td>
                    </tr>
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
        )}

        {/* === TAB CATEGORIES === */}
        {activeTab === "categories" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2>📂 Danh Mục</h2>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCatFormData({ name: "", slug: "", description: "" });
                  setShowCategoryForm(true);
                }}
                style={btnAddStyle}
              >
                {" "}
                <FaPlus />{" "}
              </button>
            </div>

            {showCategoryForm && (
              <div style={formContainerStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                  }}
                >
                  <h3>{editingCategory ? "Sửa Danh Mục" : "Thêm Danh Mục"}</h3>
                  <button
                    onClick={() => setShowCategoryForm(false)}
                    style={closeBtnStyle}
                  >
                    <FaTimes />
                  </button>
                </div>
                <form onSubmit={handleSubmitCategory}>
                  <div style={{ marginBottom: "15px" }}>
                    {" "}
                    <label style={labelStyle}>Tên</label>{" "}
                    <input
                      type="text"
                      name="name"
                      required
                      value={catFormData.name}
                      onChange={handleCatInputChange}
                      style={inputStyle}
                    />{" "}
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    {" "}
                    <label style={labelStyle}>Slug</label>{" "}
                    <input
                      type="text"
                      name="slug"
                      required
                      value={catFormData.slug}
                      onChange={handleCatInputChange}
                      style={inputStyle}
                    />{" "}
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    {" "}
                    <label style={labelStyle}>Mô tả</label>{" "}
                    <textarea
                      name="description"
                      rows="2"
                      value={catFormData.description}
                      onChange={handleCatInputChange}
                      style={inputStyle}
                    />{" "}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {" "}
                    <button type="submit" style={btnSaveStyle}>
                      Lưu
                    </button>{" "}
                  </div>
                </form>
              </div>
            )}

            <div style={{ ...tableContainerStyle, overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "500px",
                }}
              >
                <thead style={{ background: "#eee" }}>
                  <tr>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Tên</th>
                    <th style={thStyle}>Slug</th>
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
                      <td style={tdStyle}>{cat.slug}</td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button
                            onClick={() => {
                              setEditingCategory(cat);
                              setCatFormData({
                                name: cat.name,
                                slug: cat.slug,
                                description: cat.description || "",
                              });
                              setShowCategoryForm(true);
                            }}
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === TAB USERS === */}
        {activeTab === "users" && (
          <div>
            <h2>👥 Người Dùng</h2>
            <div
              style={{
                ...tableContainerStyle,
                marginTop: "20px",
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "500px",
                }}
              >
                <thead style={{ background: "#eee" }}>
                  <tr>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Tên</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Action</th>
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
                      <td style={tdStyle}>{user.role}</td>
                      <td style={tdStyle}>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            style={btnDeleteStyle}
                          >
                            Xóa
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
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ fontSize: "14px", color: "#555" }}>Hiện:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{
            padding: "5px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: "5px" }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          style={{ ...btnPageStyle, opacity: currentPage === 1 ? 0.5 : 1 }}
        >
          {" "}
          &lt;{" "}
        </button>
        <span
          style={{
            padding: "5px 10px",
            fontWeight: "bold",
            fontSize: "0.9rem",
          }}
        >
          {" "}
          {currentPage}/{totalPages}{" "}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          style={{
            ...btnPageStyle,
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          {" "}
          &gt;{" "}
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

// --- CSS STYLES ---
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
  padding: "10px 15px",
  borderRadius: "5px",
  border: "none",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  cursor: "pointer",
  height: "40px",
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
  gap: "10px",
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
  minWidth: "130px",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ddd",
  cursor: "pointer",
};
const tableContainerStyle = {
  background: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
};
const thStyle = {
  padding: "12px",
  textAlign: "left",
  fontSize: "14px",
  color: "#555",
  whiteSpace: "nowrap",
};
const tdStyle = {
  padding: "12px",
  color: "#333",
  borderBottom: "1px solid #eee",
};
const btnViewStyle = {
  padding: "6px 10px",
  background: "#fbc02d",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const btnEditStyle = {
  padding: "6px 10px",
  background: "#1976d2",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const btnDeleteStyle = {
  padding: "6px 10px",
  background: "#d32f2f",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const btnPageStyle = {
  padding: "5px 10px",
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
  fontSize: "0.9rem",
};
const inputStyle = {
  width: "100%",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};
const btnSaveStyle = {
  padding: "8px 20px",
  background: "#2e7d32",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

// Modal Styles
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  zIndex: 1100,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "10px",
};
const modalContentStyle = {
  background: "white",
  width: "800px",
  maxWidth: "100%",
  maxHeight: "90vh",
  overflowY: "auto",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
};

export default AdminDashboard;

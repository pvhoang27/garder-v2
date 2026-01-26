import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axiosClient from "../api/axiosClient";
import { FaSave, FaPlus, FaTrash, FaEdit, FaTimes, FaBars } from "react-icons/fa"; // Import FaBars
import AdminSidebar from "../components/AdminSidebar"; // Import Sidebar

const AdminPopupConfig = () => {
  const navigate = useNavigate();
  const [popups, setPopups] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // --- STATE CHO LAYOUT & SIDEBAR ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- RESIZE EVENT (Để xử lý responsive) ---
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Xử lý khi click vào menu bên Sidebar (Quay về Dashboard chính)
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

  // State form
  const [config, setConfig] = useState(initialState());
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  function initialState() {
    return {
      id: null,
      title: "",
      content: "",
      link_url: "",
      position: "center",
      is_active: true,
      image_url: "",
    };
  }

  // Load danh sách
  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = () => {
    axiosClient
      .get("/popup/all")
      .then((res) => {
        setPopups(res.data);
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (popup) => {
    setConfig({ ...popup, is_active: popup.is_active === 1 });
    setFile(null);
    setPreview(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddNew = () => {
    setConfig(initialState());
    setFile(null);
    setPreview(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setConfig(initialState());
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa popup này?")) {
      try {
        await axiosClient.delete(`/popup/${id}`);
        fetchPopups();
      } catch (error) {
        alert("Lỗi khi xóa");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", config.title);
    formData.append("content", config.content);
    formData.append("link_url", config.link_url);
    formData.append("position", config.position);
    formData.append("is_active", config.is_active);

    if (file) formData.append("image", file);
    else formData.append("old_image_url", config.image_url);

    try {
      if (config.id) {
        // Update
        await axiosClient.put(`/popup/${config.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create
        await axiosClient.post("/popup", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      alert("Lưu thành công!");
      setIsEditing(false);
      fetchPopups();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu");
    }
  };

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
          <div style={{ fontWeight: "bold", fontSize: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{ background: "none", border: "none", color: "white", fontSize: "24px", cursor: "pointer" }}
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
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.5)", zIndex: 999,
          }}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <AdminSidebar
        activeTab="popup" // Đặt activeTab khác plants/categories/users để không highlight nhầm
        setActiveTab={handleSidebarClick} // Quay về Dashboard khi click menu
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* --- MAIN CONTENT (Bọc nội dung cũ vào đây) --- */}
      <div style={mainContentStyle}>
        <div
          className="container"
          style={{ paddingBottom: "50px" }}
        >
          <h2
            style={{ color: "#2e7d32", textAlign: "center", marginBottom: "30px" }}
          >
            ⚙️ Quản Lý Popup Quảng Cáo
          </h2>

          {/* Nếu đang không sửa thì hiện nút Thêm mới */}
          {!isEditing && (
            <div style={{ marginBottom: "20px", textAlign: "right" }}>
              <button
                onClick={handleAddNew}
                style={{
                  background: "#2e7d32",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <FaPlus /> Thêm Popup Mới
              </button>
            </div>
          )}

          {/* FORM THÊM / SỬA */}
          {isEditing && (
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                marginBottom: "30px",
              }}
            >
              <h3 style={{ marginBottom: "20px" }}>
                {config.id ? "Sửa Popup" : "Thêm Popup Mới"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={config.is_active}
                      onChange={handleChange}
                      style={{ marginRight: "10px" }}
                    />
                    <b>Kích hoạt hiển thị</b>
                  </label>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    <label>Tiêu đề:</label>
                    <input
                      type="text"
                      name="title"
                      value={config.title}
                      onChange={handleChange}
                      style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                  </div>
                  <div>
                    <label>Link liên kết:</label>
                    <input
                      type="text"
                      name="link_url"
                      value={config.link_url}
                      onChange={handleChange}
                      style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: "15px" }}>
                  <label>Nội dung:</label>
                  <textarea
                    name="content"
                    value={config.content}
                    onChange={handleChange}
                    rows="3"
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                  ></textarea>
                </div>
                <div style={{ marginTop: "15px" }}>
                  <label>Vị trí:</label>
                  <select
                    name="position"
                    value={config.position}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                  >
                    <option value="center">Giữa màn hình</option>
                    <option value="bottom-right">Góc phải dưới</option>
                    <option value="bottom-left">Góc trái dưới</option>
                  </select>
                </div>
                <div style={{ marginTop: "15px" }}>
                  <label>Hình ảnh:</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "block", marginTop: "5px" }}
                  />
                  {(preview || config.image_url) && (
                    <img
                      src={preview || `http://localhost:3000${config.image_url}`}
                      alt="Preview"
                      style={{
                        height: "80px",
                        marginTop: "10px",
                        borderRadius: "5px",
                      }}
                    />
                  )}
                </div>

                <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    style={{
                      background: "#2e7d32",
                      color: "white",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <FaSave /> Lưu lại
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      background: "#666",
                      color: "white",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <FaTimes /> Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* DANH SÁCH POPUP */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {popups.map((popup) => (
              <div
                key={popup.id}
                style={{
                  background: "white",
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  borderLeft: popup.is_active
                    ? "5px solid #2e7d32"
                    : "5px solid #ccc",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <h4 style={{ margin: 0, color: "#333" }}>
                    {popup.title || "(Không tiêu đề)"}
                  </h4>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      background: "#eee",
                      padding: "2px 8px",
                      borderRadius: "10px",
                    }}
                  >
                    {popup.position}
                  </span>
                </div>
                <p style={{ fontSize: "0.9rem", color: "#666", margin: "10px 0" }}>
                  {popup.content}
                </p>
                {popup.image_url && (
                  <img
                    src={`http://localhost:3000${popup.image_url}`}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                    alt=""
                  />
                )}

                <div
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => handleEdit(popup)}
                    style={{
                      background: "#ff9800",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    <FaEdit /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(popup.id)}
                    style={{
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "3px",
                      cursor: "pointer",
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

export default AdminPopupConfig;
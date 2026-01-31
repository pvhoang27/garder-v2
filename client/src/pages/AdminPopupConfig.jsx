import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { FaPlus, FaBars } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

// Import components
import AdminPopupForm from "../components/admin/popup/AdminPopupForm";
import AdminPopupList from "../components/admin/popup/AdminPopupList";
import "../components/admin/popup/AdminPopup.css";

const AdminPopupConfig = () => {
  const navigate = useNavigate();
  const [popups, setPopups] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // --- STATE LAYOUT ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // State form
  const [config, setConfig] = useState(initialState());
  const [files, setFiles] = useState([]); 
  const [previews, setPreviews] = useState([]); 

  function initialState() {
    return {
      id: null,
      title: "",
      content: "",
      link_url: "",
      position: "center",
      is_active: true,
      media_urls: "[]",
      width: "500px",
      height: "auto",
    };
  }

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = () => {
    // FIX: /popups/all
    axiosClient
      .get("/popups/all")
      .then((res) => {
        setPopups(res.data);
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (popup) => {
    setConfig({
      ...popup,
      is_active: popup.is_active === 1,
      media_urls: popup.media_urls || "[]",
    });
    setFiles([]);

    try {
      const oldMedia = JSON.parse(popup.media_urls || "[]");
      setPreviews(
        oldMedia.map((url) => ({
          type: "url",
          url: `http://localhost:3000${url}`,
        })),
      );
    } catch (e) {
      setPreviews([]);
    }

    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddNew = () => {
    setConfig(initialState());
    setFiles([]);
    setPreviews([]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setConfig(initialState());
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa popup này?")) {
      try {
        // FIX: /popups/:id
        await axiosClient.delete(`/popups/${id}`);
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
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const newPreviews = selectedFiles.map((file) => ({
      type: file.type.startsWith("video") ? "video" : "image",
      url: URL.createObjectURL(file),
    }));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", config.title);
    formData.append("content", config.content);
    formData.append("link_url", config.link_url);
    formData.append("position", config.position);
    formData.append("is_active", config.is_active);
    formData.append("width", config.width);
    formData.append("height", config.height);

    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("media", file);
      });
    } else {
      formData.append("old_media_urls", config.media_urls);
    }

    try {
      if (config.id) {
        // FIX: PUT /popups/:id
        await axiosClient.put(`/popups/${config.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // FIX: POST /popups
        await axiosClient.post("/popups", formData, {
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
      {/* Mobile Header */}
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

      {/* Overlay */}
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

      {/* Sidebar */}
      <AdminSidebar
        activeTab="popup"
        setActiveTab={handleSidebarClick}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div className="container admin-popup-page">
          <h2 className="page-title">⚙️ Quản Lý Popup (Đa phương tiện)</h2>

          {!isEditing && (
            <div className="page-top-actions">
              <button onClick={handleAddNew} className="btn-popup btn-add">
                <FaPlus /> Thêm Popup Mới
              </button>
            </div>
          )}

          {isEditing ? (
            <AdminPopupForm
              config={config}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
              previews={previews}
              isEditing={isEditing}
            />
          ) : (
            <AdminPopupList
              popups={popups}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPopupConfig;
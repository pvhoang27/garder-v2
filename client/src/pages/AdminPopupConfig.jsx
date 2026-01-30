import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { FaPlus, FaBars } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

// Import các component con đã tách
import AdminPopupForm from "../components/admin/popup/AdminPopupForm";
import AdminPopupList from "../components/admin/popup/AdminPopupList";

const AdminPopupConfig = () => {
  const navigate = useNavigate();
  const [popups, setPopups] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // --- STATE CHO LAYOUT & SIDEBAR ---
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
  const [files, setFiles] = useState([]); // Mảng file upload mới
  const [previews, setPreviews] = useState([]); // Preview ảnh/video

  function initialState() {
    return {
      id: null,
      title: "",
      content: "",
      link_url: "",
      position: "center",
      is_active: true,
      media_urls: "[]", // Lưu JSON string
      width: "500px",
      height: "auto",
    };
  }

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
    setConfig({
      ...popup,
      is_active: popup.is_active === 1,
      media_urls: popup.media_urls || "[]",
    });
    setFiles([]);

    // Parse JSON media cũ để hiện preview
    try {
      const oldMedia = JSON.parse(popup.media_urls || "[]");
      // Đánh dấu là url cũ (string) để phân biệt với file blob mới
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
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Tạo preview cho file mới
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

    // Nếu có file mới, gửi file mới. Nếu không, gửi lại list url cũ
    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("media", file);
      });
    } else {
      formData.append("old_media_urls", config.media_urls);
    }

    try {
      if (config.id) {
        await axiosClient.put(`/popup/${config.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
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

      {/* --- OVERLAY --- */}
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

      {/* --- SIDEBAR --- */}
      <AdminSidebar
        activeTab="popup"
        setActiveTab={handleSidebarClick}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* --- MAIN CONTENT --- */}
      <div style={mainContentStyle}>
        <div className="container" style={{ paddingBottom: "50px" }}>
          <h2
            style={{
              color: "#2e7d32",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            ⚙️ Quản Lý Popup (Đa phương tiện)
          </h2>

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

          {/* HIỂN THỊ FORM HOẶC LIST */}
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
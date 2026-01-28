import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import {
  FaSave,
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaBars,
  FaImages,
  FaVideo,
} from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

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

  // Helper render media preview
  const renderPreviewMedia = (item, index) => {
    const isVideo =
      item.type === "video" ||
      (typeof item.url === "string" && item.url.match(/\.(mp4|webm)$/i));

    return (
      <div
        key={index}
        style={{
          position: "relative",
          width: "100px",
          height: "100px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {isVideo ? (
          <video
            src={item.url}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <img
            src={item.url}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        {isVideo && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.3)",
              color: "white",
            }}
          >
            <FaVideo />
          </div>
        )}
      </div>
    );
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
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "5px",
                      }}
                    />
                  </div>
                  <div>
                    <label>Link liên kết (khi bấm vào):</label>
                    <input
                      type="text"
                      name="link_url"
                      value={config.link_url}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "5px",
                      }}
                    />
                  </div>
                </div>

                {/* CẤU HÌNH KÍCH THƯỚC & VỊ TRÍ */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "20px",
                    marginTop: "15px",
                    background: "#f9f9f9",
                    padding: "15px",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <label>Vị trí:</label>
                    <select
                      name="position"
                      value={config.position}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "5px",
                      }}
                    >
                      <option value="center">Giữa màn hình</option>
                      <option value="top-left">Góc trái trên</option>
                      <option value="top-right">Góc phải trên</option>
                      <option value="bottom-left">Góc trái dưới</option>
                      <option value="bottom-right">Góc phải dưới</option>
                      <option value="top-center">Giữa trên</option>
                      <option value="bottom-center">Giữa dưới</option>
                    </select>
                  </div>
                  <div>
                    <label>Chiều rộng (px hoặc %):</label>
                    <input
                      type="text"
                      name="width"
                      value={config.width}
                      onChange={handleChange}
                      placeholder="VD: 500px, 80%"
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "5px",
                      }}
                    />
                  </div>
                  <div>
                    <label>Chiều cao (px hoặc auto):</label>
                    <input
                      type="text"
                      name="height"
                      value={config.height}
                      onChange={handleChange}
                      placeholder="VD: 400px, auto"
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "5px",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: "15px" }}>
                  <label>Nội dung text:</label>
                  <textarea
                    name="content"
                    value={config.content}
                    onChange={handleChange}
                    rows="3"
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                  ></textarea>
                </div>

                {/* UPLOAD MULTIPLE MEDIA */}
                <div style={{ marginTop: "15px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <FaImages /> Hình ảnh / Video (Chọn nhiều):
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    style={{ display: "block", marginTop: "5px" }}
                  />

                  {previews.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      {previews.map((item, index) =>
                        renderPreviewMedia(item, index),
                      )}
                    </div>
                  )}
                </div>

                <div
                  style={{ marginTop: "20px", display: "flex", gap: "10px" }}
                >
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

          {/* LIST POPUP */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {popups.map((popup) => {
              let mediaList = [];
              try {
                mediaList = JSON.parse(popup.media_urls || "[]");
              } catch (e) {}
              return (
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
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#666",
                      margin: "5px 0",
                    }}
                  >
                    Size: {popup.width} x {popup.height}
                  </p>

                  {/* Preview ảnh đầu tiên trong list */}
                  {mediaList.length > 0 && (
                    <div
                      style={{
                        marginTop: "10px",
                        height: "120px",
                        background: "#f0f0f0",
                        borderRadius: "5px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {mediaList[0].match(/\.(mp4|webm)$/i) ? (
                        <video
                          src={`http://localhost:3000${mediaList[0]}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <img
                          src={`http://localhost:3000${mediaList[0]}`}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      {mediaList.length > 1 && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 5,
                            right: 5,
                            background: "rgba(0,0,0,0.6)",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "10px",
                            fontSize: "0.7rem",
                          }}
                        >
                          +{mediaList.length - 1}
                        </div>
                      )}
                    </div>
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPopupConfig;

import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { FaUpload, FaTimes } from "react-icons/fa";
import { API_URL } from "../config";

const AdminNewsForm = ({ initialData, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "", // Nội dung chi tiết
    image: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        summary: initialData.summary,
        content: initialData.content || "",
        image: initialData.image,
      });
      // Nếu là URL ảnh (đã có trên server)
      if (initialData.image && typeof initialData.image === "string") {
        // Xử lý hiển thị ảnh cũ
        setPreview(
          initialData.image.startsWith("http")
            ? initialData.image
            : `${API_URL}${initialData.image}`,
        );
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("summary", formData.summary);
    data.append("content", formData.content);
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    try {
      if (initialData) {
        await axiosClient.put(`/news/${initialData.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Cập nhật tin tức thành công!");
      } else {
        await axiosClient.post("/news", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Thêm tin tức thành công!");
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ padding: "20px", background: "white", borderRadius: "8px" }}
    >
      <div style={{ marginBottom: "15px" }}>
        <label>Tiêu đề tin tức:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Tóm tắt ngắn:</label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          required
          rows="3"
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Nội dung chi tiết:</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="6"
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Hình ảnh bìa:</label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "5px",
          }}
        >
          <label
            style={{
              cursor: "pointer",
              padding: "8px 15px",
              background: "#f0f0f0",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FaUpload /> Chọn ảnh
            <input
              type="file"
              hidden
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
          {preview && (
            <div
              style={{ position: "relative", width: "100px", height: "60px" }}
            >
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setFormData({ ...formData, image: null });
                }}
                style={{
                  position: "absolute",
                  top: -5,
                  right: -5,
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  border: "none",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaTimes size={10} />
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          background: "#2e7d32",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {initialData ? "Cập Nhật" : "Đăng Tin"}
      </button>
    </form>
  );
};

export default AdminNewsForm;

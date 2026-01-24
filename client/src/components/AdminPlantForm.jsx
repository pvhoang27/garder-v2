import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axiosClient from "../api/axiosClient";
import { useNavigate, useParams } from "react-router-dom";

const AdminPlantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    scientific_name: "",
    age: "",
    category_id: "",
    description: "",
    care_instruction: "",
    is_featured: false,
  });

  const [categories, setCategories] = useState([]);

  // Quản lý file
  const [thumbnailFile, setThumbnailFile] = useState(null); // File mới chọn
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // Preview ảnh mới
  const [oldThumbnail, setOldThumbnail] = useState(null); // Ảnh cũ từ server

  const [galleryFiles, setGalleryFiles] = useState([]); // List file mới chọn (File Object)
  const [galleryPreview, setGalleryPreview] = useState([]); // List URL preview file mới
  const [oldMedia, setOldMedia] = useState([]); // List ảnh/video cũ từ server (để hiện và xóa)

  // Helper: Check file là video hay ảnh
  const isVideo = (filename) => {
    if (!filename) return false;
    const ext = filename.split(".").pop().toLowerCase();
    return ["mp4", "mov", "avi", "webm"].includes(ext);
  };

  useEffect(() => {
    axiosClient.get("/categories").then((res) => setCategories(res.data));

    if (isEdit) {
      axiosClient.get(`/plants/${id}`).then((res) => {
        const d = res.data;
        setFormData({
          name: d.name,
          scientific_name: d.scientific_name || "",
          age: d.age || "",
          category_id: d.category_id,
          description: d.description || "",
          care_instruction: d.care_instruction || "",
          is_featured: d.is_featured === 1,
        });
        setOldThumbnail(d.thumbnail);
        setOldMedia(d.media || []);
      });
    }
  }, [id, isEdit]);

  // Xử lý chọn Thumbnail mới
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Xử lý chọn Album mới (Nhiều file)
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles((prev) => [...prev, ...files]); // Cộng dồn file

    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      fileObj: file,
    }));
    setGalleryPreview((prev) => [...prev, ...newPreviews]);
  };

  // Xóa file MỚI chọn (chưa up lên server)
  const removeNewFile = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // Xóa file CŨ (đã có trên server) - Gọi API xóa luôn
  const removeOldMedia = async (mediaId) => {
    if (window.confirm("Bạn chắc chắn muốn xóa ảnh/video này vĩnh viễn?")) {
      try {
        await axiosClient.delete(`/plants/images/${mediaId}`);
        setOldMedia((prev) => prev.filter((item) => item.id !== mediaId));
        alert("Đã xóa!");
      } catch (error) {
        console.error(error);
        alert("Lỗi khi xóa!");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    if (thumbnailFile) data.append("thumbnail", thumbnailFile);

    // Append Album
    for (let i = 0; i < galleryFiles.length; i++) {
      data.append("gallery", galleryFiles[i]);
    }

    try {
      const url = isEdit ? `/plants/${id}` : "/plants";
      const method = isEdit ? "put" : "post";

      await axiosClient[method](url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Thành công!");
      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "1000px" }}>
      <h2>{isEdit ? "Chỉnh Sửa & Quản Lý Ảnh" : "Thêm Cây Mới"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Tên cây"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{ padding: "10px" }}
          />
          <select
            name="category_id"
            value={formData.category_id}
            onChange={(e) =>
              setFormData({ ...formData, category_id: e.target.value })
            }
            required
            style={{ padding: "10px" }}
          >
            <option value="">-- Chọn Danh Mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <input
            type="text"
            name="scientific_name"
            placeholder="Tên khoa học"
            value={formData.scientific_name}
            onChange={(e) =>
              setFormData({ ...formData, scientific_name: e.target.value })
            }
            style={{ padding: "10px" }}
          />
          <input
            type="text"
            name="age"
            placeholder="Tuổi đời"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            style={{ padding: "10px" }}
          />
        </div>

        <ReactQuill
          theme="snow"
          value={formData.description}
          onChange={(val) => setFormData({ ...formData, description: val })}
          style={{ height: "150px", marginBottom: "40px" }}
        />

        <textarea
          name="care_instruction"
          placeholder="Cách chăm sóc"
          value={formData.care_instruction}
          onChange={(e) =>
            setFormData({ ...formData, care_instruction: e.target.value })
          }
          rows="4"
          style={{ padding: "10px" }}
        ></textarea>

        {/* --- KHU VỰC QUẢN LÝ ẢNH --- */}
        <div
          style={{
            border: "2px dashed #ccc",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>1. Ảnh Đại Diện (Thumbnail)</h3>
          <input
            type="file"
            onChange={handleThumbnailChange}
            accept="image/*"
          />

          {/* Preview Thumbnail Mới */}
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="New"
              style={{
                height: "100px",
                marginTop: "10px",
                display: "block",
                border: "2px solid green",
              }}
            />
          )}

          {/* Thumbnail Cũ */}
          {isEdit && !thumbnailPreview && oldThumbnail && (
            <div style={{ marginTop: "10px" }}>
              <p>Ảnh hiện tại:</p>
              <img
                src={`http://localhost:3000${oldThumbnail}`}
                alt="Old"
                style={{ height: "100px" }}
              />
            </div>
          )}
        </div>

        <div
          style={{
            border: "2px dashed #ccc",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>2. Thư Viện Ảnh & Video (Gallery)</h3>
          <input
            type="file"
            multiple
            onChange={handleGalleryChange}
            accept="image/*,video/*"
          />
          <p style={{ fontSize: "0.9em", color: "#666" }}>
            Giữ phím Ctrl để chọn nhiều file.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            {/* A. HIỆN FILE CŨ (Server) */}
            {oldMedia.map((item) => (
              <div
                key={item.id}
                style={{
                  position: "relative",
                  width: "150px",
                  height: "150px",
                  border: "1px solid #ddd",
                }}
              >
                {isVideo(item.image_url) ? (
                  <video
                    src={`http://localhost:3000${item.image_url}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={`http://localhost:3000${item.image_url}`}
                    alt="old"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeOldMedia(item.id)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    padding: "5px",
                  }}
                >
                  XÓA
                </button>
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    background: "rgba(0,0,0,0.5)",
                    color: "white",
                    width: "100%",
                    fontSize: "10px",
                    textAlign: "center",
                  }}
                >
                  Đã lưu
                </span>
              </div>
            ))}

            {/* B. HIỆN FILE MỚI CHỌN (Preview) */}
            {galleryPreview.map((item, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: "150px",
                  height: "150px",
                  border: "2px solid #2e7d32",
                }}
              >
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={item.url}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeNewFile(index)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "#666",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    padding: "5px",
                  }}
                >
                  HỦY
                </button>
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    background: "green",
                    color: "white",
                    width: "100%",
                    fontSize: "10px",
                    textAlign: "center",
                  }}
                >
                  Mới (Chưa lưu)
                </span>
              </div>
            ))}
          </div>
        </div>

        <label>
          <input
            type="checkbox"
            name="is_featured"
            checked={formData.is_featured}
            onChange={(e) =>
              setFormData({ ...formData, is_featured: e.target.checked })
            }
          />{" "}
          Nổi bật
        </label>

        <button
          type="submit"
          style={{
            padding: "15px",
            background: "#2e7d32",
            color: "white",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          {isEdit ? "LƯU TẤT CẢ THAY ĐỔI" : "TẠO CÂY MỚI"}
        </button>
      </form>
    </div>
  );
};

export default AdminPlantForm;

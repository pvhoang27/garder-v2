import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axiosClient from "../api/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash, FaPlus } from "react-icons/fa";

const AdminPlantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    price: "", // <--- THÊM STATE PRICE
    scientific_name: "",
    age: "",
    category_id: "",
    description: "",
    care_instruction: "",
    is_featured: false,
  });

  // --- STATE CHO ATTRIBUTES (NEW) ---
  const [attributes, setAttributes] = useState([]); // [{ key: '', value: '' }]

  const [categories, setCategories] = useState([]);

  // Quản lý file
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [oldThumbnail, setOldThumbnail] = useState(null);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [oldMedia, setOldMedia] = useState([]);

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
          price: d.price || "", // <--- LOAD GIÁ TỪ API
          scientific_name: d.scientific_name || "",
          age: d.age || "",
          category_id: d.category_id,
          description: d.description || "",
          care_instruction: d.care_instruction || "",
          is_featured: d.is_featured === 1,
        });
        setOldThumbnail(d.thumbnail);
        setOldMedia(d.media || []);

        // Load attributes từ server về state
        if (d.attributes && d.attributes.length > 0) {
          setAttributes(
            d.attributes.map((a) => ({ key: a.attr_key, value: a.attr_value })),
          );
        }
      });
    }
  }, [id, isEdit]);

  // --- HÀM XỬ LÝ ATTRIBUTES ---
  const addAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const removeAttribute = (index) => {
    const newAttrs = [...attributes];
    newAttrs.splice(index, 1);
    setAttributes(newAttrs);
  };

  const handleAttrChange = (index, field, val) => {
    const newAttrs = [...attributes];
    newAttrs[index][field] = val;
    setAttributes(newAttrs);
  };

  // ... (Giữ nguyên các hàm xử lý ảnh) ...
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      fileObj: file,
    }));
    setGalleryPreview((prev) => [...prev, ...newPreviews]);
  };

  const removeNewFile = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreview((prev) => prev.filter((_, i) => i !== index));
  };

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
    for (let i = 0; i < galleryFiles.length; i++) {
      data.append("gallery", galleryFiles[i]);
    }

    // --- QUAN TRỌNG: GỬI ATTRIBUTES DẠNG JSON STRING ---
    const validAttrs = attributes.filter((a) => a.key.trim() !== "");
    data.append("attributes", JSON.stringify(validAttrs));

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
    <div
      className="container"
      style={{ maxWidth: "1000px", paddingBottom: "50px" }}
    >
      <h2>{isEdit ? "Chỉnh Sửa Cây" : "Thêm Cây Mới"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
        {/* Các input cơ bản */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr", // Điều chỉnh cột
            gap: "15px",
          }}
        >
          <input
            type="text"
            placeholder="Tên cây"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{ padding: "10px" }}
          />

          {/* INPUT GIÁ */}
          <input
            type="number"
            placeholder="Giá (VNĐ)"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
            style={{ padding: "10px" }}
          />

          <select
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
            placeholder="Tên khoa học"
            value={formData.scientific_name}
            onChange={(e) =>
              setFormData({ ...formData, scientific_name: e.target.value })
            }
            style={{ padding: "10px" }}
          />
          <input
            type="text"
            placeholder="Tuổi đời"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            style={{ padding: "10px" }}
          />
        </div>

        {/* --- KHU VỰC THÔNG SỐ KỸ THUẬT (ATTRIBUTES) --- */}
        <div
          style={{
            background: "#f9f9f9",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #eee",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
              Thông số chi tiết (Tùy chọn)
            </h3>
            <button
              type="button"
              onClick={addAttribute}
              style={{
                background: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <FaPlus /> Thêm dòng
            </button>
          </div>

          {attributes.length === 0 && (
            <p style={{ color: "#888", fontStyle: "italic" }}>
              Chưa có thông số nào.
            </p>
          )}

          {attributes.map((attr, index) => (
            <div
              key={index}
              style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
            >
              <input
                type="text"
                placeholder="Tên thuộc tính (VD: Chiều cao)"
                value={attr.key}
                onChange={(e) => handleAttrChange(index, "key", e.target.value)}
                style={{ flex: 1, padding: "8px" }}
              />
              <input
                type="text"
                placeholder="Giá trị (VD: 1.5m)"
                value={attr.value}
                onChange={(e) =>
                  handleAttrChange(index, "value", e.target.value)
                }
                style={{ flex: 1, padding: "8px" }}
              />
              <button
                type="button"
                onClick={() => removeAttribute(index)}
                style={{
                  background: "#d32f2f",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  width: "40px",
                  cursor: "pointer",
                }}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <ReactQuill
          theme="snow"
          value={formData.description}
          onChange={(val) => setFormData({ ...formData, description: val })}
          style={{ height: "150px", marginBottom: "40px" }}
        />

        <textarea
          placeholder="Cách chăm sóc"
          value={formData.care_instruction}
          onChange={(e) =>
            setFormData({ ...formData, care_instruction: e.target.value })
          }
          rows="4"
          style={{ padding: "10px" }}
        ></textarea>

        {/* ... (Phần Upload Ảnh giữ nguyên) ... */}
        <div
          style={{
            border: "2px dashed #ccc",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>1. Ảnh Đại Diện</h3>
          <input
            type="file"
            onChange={handleThumbnailChange}
            accept="image/*"
          />
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
          <h3 style={{ marginTop: 0 }}>2. Thư Viện Ảnh & Video</h3>
          <input
            type="file"
            multiple
            onChange={handleGalleryChange}
            accept="image/*,video/*"
          />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              marginTop: "20px",
            }}
          >
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
                  X
                </button>
              </div>
            ))}
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
              </div>
            ))}
          </div>
        </div>

        <label>
          <input
            type="checkbox"
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
          {isEdit ? "LƯU THAY ĐỔI" : "TẠO CÂY MỚI"}
        </button>
      </form>
    </div>
  );
};

export default AdminPlantForm;
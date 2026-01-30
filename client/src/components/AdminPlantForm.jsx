import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axiosClient from "../api/axiosClient";
import { useNavigate, useParams } from "react-router-dom";

// Components & CSS
import PlantAttributes from "./admin/plants/PlantAttributes";
import PlantMedia from "./admin/plants/PlantMedia";
import "./AdminPlantForm.css";

const AdminPlantForm = ({ initialData, onSuccess }) => {
  // Hỗ trợ cả dùng trong Modal (có initialData) và trang riêng (có useParams)
  const { id } = useParams(); 
  const navigate = useNavigate();
  const plantId = initialData?.id || id;
  const isEdit = Boolean(plantId);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    scientific_name: "",
    age: "",
    category_id: "",
    description: "",
    care_instruction: "",
    is_featured: false,
  });

  const [attributes, setAttributes] = useState([]); 
  const [categories, setCategories] = useState([]);

  // Media State
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [oldThumbnail, setOldThumbnail] = useState(null);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [oldMedia, setOldMedia] = useState([]);

  useEffect(() => {
    axiosClient.get("/categories").then((res) => setCategories(res.data));

    if (isEdit) {
      if (initialData) {
        fillData(initialData);
      } else {
        axiosClient.get(`/plants/${plantId}`).then((res) => fillData(res.data));
      }
    }
  }, [plantId, isEdit, initialData]);

  const fillData = (d) => {
    setFormData({
      name: d.name,
      price: d.price || "",
      scientific_name: d.scientific_name || "",
      age: d.age || "",
      category_id: d.category_id,
      description: d.description || "",
      care_instruction: d.care_instruction || "",
      is_featured: d.is_featured === 1,
    });
    setOldThumbnail(d.thumbnail);
    setOldMedia(d.media || []);
    if (d.attributes && d.attributes.length > 0) {
      setAttributes(
        d.attributes.map((a) => ({ key: a.attr_key, value: a.attr_value }))
      );
    }
  };

  // --- HANDLERS MEDIA ---
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
      } catch (error) {
        console.error(error);
        alert("Lỗi khi xóa!");
      }
    }
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    if (thumbnailFile) data.append("thumbnail", thumbnailFile);
    for (let i = 0; i < galleryFiles.length; i++) {
      data.append("gallery", galleryFiles[i]);
    }

    const validAttrs = attributes.filter((a) => a.key.trim() !== "");
    data.append("attributes", JSON.stringify(validAttrs));

    try {
      const url = isEdit ? `/plants/${plantId}` : "/plants";
      const method = isEdit ? "put" : "post";

      await axiosClient[method](url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Thành công!");
      if (onSuccess) onSuccess(); // Nếu là component con (Modal)
      else navigate("/admin"); // Nếu là trang riêng
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="container admin-form-container">
      <h2 className="form-title">{isEdit ? "Chỉnh Sửa Cây" : "Thêm Cây Mới"}</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        
        {/* Row 1: Tên, Giá, Danh mục */}
        <div className="row-3-cols">
          <input
            type="text"
            placeholder="Tên cây"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="form-input"
          />
          <input
            type="number"
            placeholder="Giá (VNĐ)"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            className="form-input"
          />
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            required
            className="form-select"
          >
            <option value="">-- Chọn Danh Mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Row 2: Tên KH, Tuổi */}
        <div className="row-2-cols">
          <input
            type="text"
            placeholder="Tên khoa học"
            value={formData.scientific_name}
            onChange={(e) => setFormData({ ...formData, scientific_name: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Tuổi đời"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="form-input"
          />
        </div>

        {/* Components con: Attributes & Media */}
        <PlantAttributes attributes={attributes} setAttributes={setAttributes} />

        <ReactQuill
          theme="snow"
          value={formData.description}
          onChange={(val) => setFormData({ ...formData, description: val })}
          style={{ height: "150px", marginBottom: "50px" }}
        />

        <textarea
          placeholder="Cách chăm sóc"
          value={formData.care_instruction}
          onChange={(e) => setFormData({ ...formData, care_instruction: e.target.value })}
          rows="4"
          className="form-textarea"
        ></textarea>

        <PlantMedia
          thumbnailPreview={thumbnailPreview}
          handleThumbnailChange={handleThumbnailChange}
          oldThumbnail={oldThumbnail}
          galleryPreview={galleryPreview}
          handleGalleryChange={handleGalleryChange}
          oldMedia={oldMedia}
          removeOldMedia={removeOldMedia}
          removeNewFile={removeNewFile}
          isEdit={isEdit}
        />

        <label>
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
          />{" "}
          Nổi bật (Hiển thị lên trang chủ nếu có cấu hình)
        </label>

        <button type="submit" className="btn-submit">
          {isEdit ? "LƯU THAY ĐỔI" : "TẠO CÂY MỚI"}
        </button>
      </form>
    </div>
  );
};

export default AdminPlantForm;
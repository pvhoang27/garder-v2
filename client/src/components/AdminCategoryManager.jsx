import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const AdminCategoryManager = ({ isMobile }) => {
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catFormData, setCatFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

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

  // --- STYLES ---
  const styles = {
    btnAdd: {
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
    },
    formContainer: {
      background: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      marginBottom: "20px",
    },
    closeBtn: {
      background: "transparent",
      border: "none",
      fontSize: "20px",
      cursor: "pointer",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "5px",
      color: "#333",
      fontSize: "0.9rem",
    },
    input: {
      width: "100%",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    btnSave: {
      padding: "8px 20px",
      background: "#2e7d32",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    tableContainer: {
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      overflowX: "auto",
    },
    th: {
      padding: "12px",
      textAlign: "left",
      fontSize: "14px",
      color: "#555",
      whiteSpace: "nowrap",
      background: "#eee",
    },
    td: {
      padding: "12px",
      color: "#333",
      borderBottom: "1px solid #eee",
      fontSize: "14px",
    },
    btnEdit: {
      padding: "6px 10px",
      background: "#1976d2",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    btnDelete: {
      padding: "6px 10px",
      background: "#d32f2f",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }}>
          📂 Danh Mục
        </h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setCatFormData({ name: "", slug: "", description: "" });
            setShowCategoryForm(true);
          }}
          style={styles.btnAdd}
        >
          <FaPlus />{" "}
          <span style={{ display: isMobile ? "none" : "inline" }}>Thêm</span>
        </button>
      </div>

      {showCategoryForm && (
        <div style={styles.formContainer}>
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
              style={styles.closeBtn}
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleSubmitCategory}>
            <div style={{ marginBottom: "15px" }}>
              <label style={styles.label}>Tên</label>
              <input
                type="text"
                name="name"
                required
                value={catFormData.name}
                onChange={handleCatInputChange}
                style={styles.input}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={styles.label}>Slug</label>
              <input
                type="text"
                name="slug"
                required
                value={catFormData.slug}
                onChange={handleCatInputChange}
                style={styles.input}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={styles.label}>Mô tả</label>
              <textarea
                name="description"
                rows="2"
                value={catFormData.description}
                onChange={handleCatInputChange}
                style={styles.input}
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <button type="submit" style={styles.btnSave}>
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.tableContainer}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "500px",
          }}
        >
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Tên</th>
              <th style={styles.th}>Slug</th>
              <th style={styles.th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={styles.td}>#{cat.id}</td>
                <td style={styles.td}>
                  <strong>{cat.name}</strong>
                </td>
                <td style={styles.td}>{cat.slug}</td>
                <td style={styles.td}>
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
                      style={styles.btnEdit}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      style={styles.btnDelete}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategoryManager;

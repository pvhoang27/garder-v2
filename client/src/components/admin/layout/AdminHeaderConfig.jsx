import React, { useState } from "react";
import { FaImage, FaSave, FaCheckCircle, FaExclamationCircle, FaSpinner, FaArrowUp, FaArrowDown, FaTrash, FaPlus } from "react-icons/fa";

const AdminHeaderConfig = ({
  headerConfig,
  setHeaderConfig,
  headerPreviewUrl,
  handleHeaderFileChange,
  handleSaveHeaderConfig,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const onSaveWrapper = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    try {
      await handleSaveHeaderConfig(e);
      setNotification({
        type: "success",
        message: "Đã lưu cấu hình Header thành công!",
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error(error);
      setNotification({
        type: "error",
        message: "Có lỗi xảy ra khi lưu. Vui lòng thử lại!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- CÁC HÀM XỬ LÝ MENU ---
  const handleMenuChange = (index, field, value) => {
    const newMenuItems = [...(headerConfig.menuItems || [])];
    newMenuItems[index][field] = value;
    setHeaderConfig({ ...headerConfig, menuItems: newMenuItems });
  };

  const moveMenuItem = (index, direction) => {
    const newMenuItems = [...(headerConfig.menuItems || [])];
    if (index + direction < 0 || index + direction >= newMenuItems.length) return;
    
    // Hoán đổi vị trí
    const temp = newMenuItems[index];
    newMenuItems[index] = newMenuItems[index + direction];
    newMenuItems[index + direction] = temp;
    
    setHeaderConfig({ ...headerConfig, menuItems: newMenuItems });
  };

  const addMenuItem = () => {
    const newMenuItems = [...(headerConfig.menuItems || [])];
    newMenuItems.push({ id: Date.now(), label: "Menu Mới", path: "/" });
    setHeaderConfig({ ...headerConfig, menuItems: newMenuItems });
  };

  const removeMenuItem = (index) => {
    const newMenuItems = [...(headerConfig.menuItems || [])];
    newMenuItems.splice(index, 1);
    setHeaderConfig({ ...headerConfig, menuItems: newMenuItems });
  };

  const formGroupStyle = { marginBottom: "20px" };
  const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" };
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    transition: "border-color 0.3s",
    outline: "none",
  };

  return (
    <div className="admin-card" style={{ padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
      <h3 style={{ marginBottom: "25px", color: "#2e7d32", borderBottom: "2px solid #e8f5e9", paddingBottom: "10px" }}>
        Cấu Hình Thanh Điều Hướng (Header)
      </h3>

      <form onSubmit={onSaveWrapper} encType="multipart/form-data">
        {/* KHU VỰC THƯƠNG HIỆU */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Tên thương hiệu (Brand Name):</label>
          <input
            type="text"
            style={inputStyle}
            value={headerConfig.brandName}
            onChange={(e) =>
              setHeaderConfig({ ...headerConfig, brandName: e.target.value })
            }
            placeholder='VD: Garder (Để trống sẽ dùng chữ mặc định của "Đa ngôn ngữ")'
            onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Logo:</label>
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "250px" }}>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "10px 20px",
                  backgroundColor: "#f5f5f5",
                  color: "#333",
                  border: "1px dashed #999",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginBottom: "10px",
                  transition: "all 0.2s",
                  fontWeight: "500",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#e8f5e9";
                  e.currentTarget.style.borderColor = "#2e7d32";
                  e.currentTarget.style.color = "#2e7d32";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                  e.currentTarget.style.borderColor = "#999";
                  e.currentTarget.style.color = "#333";
                }}
              >
                <FaImage style={{ marginRight: "8px" }} /> Chọn Logo mới
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeaderFileChange}
                  style={{ display: "none" }}
                />
              </label>
              <div style={{ fontSize: "13px", color: "#666", marginTop: "5px", fontStyle: "italic" }}>
                {headerConfig.logoFile
                  ? `📂 Đã chọn: ${headerConfig.logoFile.name}`
                  : "ℹ️ Để trống để dùng logo gốc của hệ thống."}
              </div>
            </div>

            <div
              style={{
                width: "150px",
                height: "60px",
                border: "2px solid #eee",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fafafa",
                boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)"
              }}
            >
              {headerPreviewUrl ? (
                <img
                  src={headerPreviewUrl}
                  alt="Header Preview"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <span style={{ color: "#aaa", fontSize: "12px" }}>Chưa có logo mới</span>
              )}
            </div>
          </div>
        </div>

        {/* KHU VỰC QUẢN LÝ MENU ITEMS */}
        <div style={{ marginTop: "30px", borderTop: "2px solid #e8f5e9", paddingTop: "20px" }}>
          <h4 style={{ color: "#2e7d32", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Quản Lý Menu Gắn Trên Header</span>
            <button
              type="button"
              onClick={addMenuItem}
              style={{ 
                padding: "8px 15px", background: "#e8f5e9", color: "#2e7d32", 
                border: "1px solid #a5d6a7", borderRadius: "6px", cursor: "pointer", 
                display: "flex", alignItems: "center", gap: "5px", fontSize: "14px", fontWeight: "bold"
              }}
            >
              <FaPlus /> Thêm Menu Mới
            </button>
          </h4>

          {(headerConfig.menuItems || []).map((item, index) => (
            <div key={item.id || index} style={{ 
              display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px", 
              background: "#f9f9f9", padding: "10px", borderRadius: "6px", border: "1px solid #eee" 
            }}>
              
              <input
                type="text"
                style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                placeholder="Tên hiển thị (VD: Trang chủ)"
                value={item.label}
                onChange={(e) => handleMenuChange(index, "label", e.target.value)}
              />
              
              <input
                type="text"
                style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                placeholder="Đường dẫn (VD: /categories)"
                value={item.path}
                onChange={(e) => handleMenuChange(index, "path", e.target.value)}
              />
              
              {/* Hành động sửa vị trí, xoá */}
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  type="button"
                  onClick={() => moveMenuItem(index, -1)}
                  disabled={index === 0}
                  style={{ 
                    padding: "8px", cursor: index === 0 ? "not-allowed" : "pointer", 
                    background: "white", border: "1px solid #ddd", borderRadius: "4px", color: index === 0 ? "#ccc" : "#333" 
                  }}
                  title="Di chuyển lên"
                >
                  <FaArrowUp />
                </button>
                <button
                  type="button"
                  onClick={() => moveMenuItem(index, 1)}
                  disabled={index === (headerConfig.menuItems || []).length - 1}
                  style={{ 
                    padding: "8px", cursor: index === (headerConfig.menuItems || []).length - 1 ? "not-allowed" : "pointer", 
                    background: "white", border: "1px solid #ddd", borderRadius: "4px", color: index === (headerConfig.menuItems || []).length - 1 ? "#ccc" : "#333" 
                  }}
                  title="Di chuyển xuống"
                >
                  <FaArrowDown />
                </button>
                <button
                  type="button"
                  onClick={() => removeMenuItem(index)}
                  style={{ 
                    padding: "8px", cursor: "pointer", background: "#ffebee", 
                    border: "1px solid #ffcdd2", borderRadius: "4px", color: "#c62828" 
                  }}
                  title="Xóa Menu"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          {/* Thông báo nếu chưa có Menu */}
          {(headerConfig.menuItems || []).length === 0 && (
            <div style={{ textAlign: "center", padding: "20px", color: "#999", fontStyle: "italic", background: "#fafafa", borderRadius: "6px" }}>
              Chưa có menu nào được cấu hình. (Sẽ hiển thị mặc định trang chủ, danh mục...).
            </div>
          )}
        </div>

        {/* KHU VỰC LƯU VÀ THÔNG BÁO */}
        <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
          {notification && (
            <div
              style={{
                padding: "10px 15px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
                fontWeight: "500",
                backgroundColor: notification.type === "success" ? "#e8f5e9" : "#ffebee",
                color: notification.type === "success" ? "#2e7d32" : "#c62828",
                border: `1px solid ${notification.type === "success" ? "#a5d6a7" : "#ef9a9a"}`,
              }}
            >
              {notification.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
              {notification.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              backgroundColor: isLoading ? "#7cb342" : "#2e7d32",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: "6px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "600",
              boxShadow: "0 4px 6px rgba(46, 125, 50, 0.2)",
              transition: "all 0.3s ease",
              width: "fit-content",
            }}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spin-icon" /> Đang lưu...
              </>
            ) : (
              <>
                <FaSave /> Lưu Thay Đổi Header
              </>
            )}
          </button>
        </div>
      </form>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spin-icon {
            animation: spin 1s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default AdminHeaderConfig;
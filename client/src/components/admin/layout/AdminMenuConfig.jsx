import React, { useState } from "react";
import { FaSave, FaCheckCircle, FaExclamationCircle, FaSpinner, FaArrowUp, FaArrowDown, FaTrash, FaPlus } from "react-icons/fa";

const AdminMenuConfig = ({ menuConfig, setMenuConfig, handleSaveMenuConfig }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const onSaveWrapper = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    try {
      await handleSaveMenuConfig(e);
      setNotification({ type: "success", message: "Đã lưu cấu trúc Menu thành công!" });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: "error", message: "Có lỗi xảy ra khi lưu!" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuChange = (index, field, value) => {
    const newMenuItems = [...(menuConfig.menuItems || [])];
    newMenuItems[index][field] = value;
    setMenuConfig({ ...menuConfig, menuItems: newMenuItems });
  };

  const moveMenuItem = (index, direction) => {
    const newMenuItems = [...(menuConfig.menuItems || [])];
    if (index + direction < 0 || index + direction >= newMenuItems.length) return;
    
    const temp = newMenuItems[index];
    newMenuItems[index] = newMenuItems[index + direction];
    newMenuItems[index + direction] = temp;
    setMenuConfig({ ...menuConfig, menuItems: newMenuItems });
  };

  const addMenuItem = () => {
    const newMenuItems = [...(menuConfig.menuItems || [])];
    newMenuItems.push({ id: Date.now(), label: "Menu Mới", path: "/" });
    setMenuConfig({ ...menuConfig, menuItems: newMenuItems });
  };

  const removeMenuItem = (index) => {
    const newMenuItems = [...(menuConfig.menuItems || [])];
    newMenuItems.splice(index, 1);
    setMenuConfig({ ...menuConfig, menuItems: newMenuItems });
  };

  const inputStyle = {
    padding: "10px 12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", outline: "none",
  };

  return (
    <div className="admin-card" style={{ padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "2px solid #e8f5e9", paddingBottom: "10px" }}>
        <h3 style={{ color: "#2e7d32", margin: 0 }}>Cấu Hình Menu Điều Hướng</h3>
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
      </div>

      <form onSubmit={onSaveWrapper}>
        {(menuConfig.menuItems || []).map((item, index) => (
          <div key={item.id || index} style={{ 
            display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px", 
            background: "#f9f9f9", padding: "10px", borderRadius: "6px", border: "1px solid #eee" 
          }}>
            <input
              type="text"
              style={{ ...inputStyle, flex: 1 }}
              placeholder="Tên hiển thị (VD: Trang chủ)"
              value={item.label}
              onChange={(e) => handleMenuChange(index, "label", e.target.value)}
            />
            
            <div style={{ display: "flex", gap: "5px" }}>
              <button type="button" onClick={() => moveMenuItem(index, -1)} disabled={index === 0}
                style={{ padding: "8px", cursor: index === 0 ? "not-allowed" : "pointer", background: "white", border: "1px solid #ddd", borderRadius: "4px", color: index === 0 ? "#ccc" : "#333" }}>
                <FaArrowUp />
              </button>
              <button type="button" onClick={() => moveMenuItem(index, 1)} disabled={index === (menuConfig.menuItems || []).length - 1}
                style={{ padding: "8px", cursor: index === (menuConfig.menuItems || []).length - 1 ? "not-allowed" : "pointer", background: "white", border: "1px solid #ddd", borderRadius: "4px", color: index === (menuConfig.menuItems || []).length - 1 ? "#ccc" : "#333" }}>
                <FaArrowDown />
              </button>
              <button type="button" onClick={() => removeMenuItem(index)}
                style={{ padding: "8px", cursor: "pointer", background: "#ffebee", border: "1px solid #ffcdd2", borderRadius: "4px", color: "#c62828" }}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        {(menuConfig.menuItems || []).length === 0 && (
          <div style={{ textAlign: "center", padding: "20px", color: "#999", fontStyle: "italic", background: "#fafafa", borderRadius: "6px" }}>
            Chưa có menu nào được cấu hình.
          </div>
        )}

        <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
          {notification && (
            <div style={{ padding: "10px 15px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "500", backgroundColor: notification.type === "success" ? "#e8f5e9" : "#ffebee", color: notification.type === "success" ? "#2e7d32" : "#c62828", border: `1px solid ${notification.type === "success" ? "#a5d6a7" : "#ef9a9a"}` }}>
              {notification.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />} {notification.message}
            </div>
          )}

          <button type="submit" disabled={isLoading}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", backgroundColor: isLoading ? "#7cb342" : "#2e7d32", color: "white", padding: "12px 24px", border: "none", borderRadius: "6px", cursor: isLoading ? "not-allowed" : "pointer", fontSize: "16px", fontWeight: "600", boxShadow: "0 4px 6px rgba(46, 125, 50, 0.2)", width: "fit-content" }}>
            {isLoading ? <><FaSpinner className="spin-icon" /> Đang lưu...</> : <><FaSave /> Lưu Cấu Trúc Menu</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminMenuConfig;
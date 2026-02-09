import React, { useState } from "react";
import { FaImage, FaSave, FaCheckCircle, FaExclamationCircle, FaSpinner } from "react-icons/fa";

const AdminAboutConfig = ({
  aboutConfig,
  setAboutConfig,
  aboutPreviews,
  handleAboutFileChange,
  handleSaveAboutConfig,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const onSaveWrapper = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);
    try {
      await handleSaveAboutConfig(e);
      setNotification({ type: "success", message: "Đã lưu About Section thành công!" });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: "error", message: "Lỗi khi lưu!" });
    } finally {
      setIsLoading(false);
    }
  };

  const formGroupStyle = { marginBottom: "20px" };
  const labelStyle = { display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" };
  const inputStyle = { width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px" };
  const textAreaStyle = { ...inputStyle, height: "80px", resize: "vertical" };

  const renderImageInput = (key, label) => (
    <div style={{ flex: 1, minWidth: "200px" }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ marginBottom: "10px" }}>
        {aboutPreviews[key] ? (
            <img src={aboutPreviews[key]} alt="Preview" style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }} />
        ) : (
            <div style={{ width: "100%", height: "150px", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>Chưa có ảnh</div>
        )}
      </div>
      <label className="btn-upload" style={{ display: "inline-flex", alignItems: "center", gap: "5px", cursor: "pointer", background: "#f0f0f0", padding: "5px 10px", borderRadius: "4px" }}>
        <FaImage /> Chọn ảnh
        <input type="file" hidden accept="image/*" onChange={(e) => handleAboutFileChange(e, key)} />
      </label>
    </div>
  );

  return (
    <div className="admin-card" style={{ padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
      <h3 style={{ marginBottom: "20px", color: "#2e7d32", borderBottom: "2px solid #e8f5e9", paddingBottom: "10px" }}>
        Cấu Hình "Về Chúng Tôi" (About Section)
      </h3>

      <form onSubmit={onSaveWrapper}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Tiêu đề chính:</label>
          <input type="text" style={inputStyle} value={aboutConfig.title} onChange={(e) => setAboutConfig({...aboutConfig, title: e.target.value})} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Mô tả đoạn 1:</label>
            <textarea style={textAreaStyle} value={aboutConfig.description1} onChange={(e) => setAboutConfig({...aboutConfig, description1: e.target.value})} />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Mô tả đoạn 2:</label>
            <textarea style={textAreaStyle} value={aboutConfig.description2} onChange={(e) => setAboutConfig({...aboutConfig, description2: e.target.value})} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", background: "#f9f9f9", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
           <div>
              <label style={labelStyle}>Thống kê 1 (Số):</label>
              <input type="text" style={inputStyle} value={aboutConfig.stat1Number} onChange={(e) => setAboutConfig({...aboutConfig, stat1Number: e.target.value})} placeholder="VD: 15+" />
              <label style={{...labelStyle, marginTop: "10px"}}>Thống kê 1 (Chữ):</label>
              <input type="text" style={inputStyle} value={aboutConfig.stat1Text} onChange={(e) => setAboutConfig({...aboutConfig, stat1Text: e.target.value})} placeholder="VD: Năm kinh nghiệm" />
           </div>
           <div>
              <label style={labelStyle}>Thống kê 2 (Số):</label>
              <input type="text" style={inputStyle} value={aboutConfig.stat2Number} onChange={(e) => setAboutConfig({...aboutConfig, stat2Number: e.target.value})} placeholder="VD: 100%" />
              <label style={{...labelStyle, marginTop: "10px"}}>Thống kê 2 (Chữ):</label>
              <input type="text" style={inputStyle} value={aboutConfig.stat2Text} onChange={(e) => setAboutConfig({...aboutConfig, stat2Text: e.target.value})} placeholder="VD: Tâm huyết" />
           </div>
        </div>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
           {renderImageInput('image1', 'Hình ảnh 1 (Trái trên)')}
           {renderImageInput('image2', 'Hình ảnh 2 (Trái dưới)')}
           {renderImageInput('image3', 'Hình ảnh 3 (Phải)')}
        </div>

        <div style={{ marginTop: "30px" }}>
            {notification && (
                <div style={{ marginBottom: "15px", padding: "10px", borderRadius: "5px", background: notification.type === "success" ? "#e8f5e9" : "#ffebee", color: notification.type === "success" ? "#2e7d32" : "#c62828", display: "flex", alignItems: "center", gap: "10px" }}>
                    {notification.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />} {notification.message}
                </div>
            )}
            <button type="submit" disabled={isLoading} style={{ backgroundColor: "#2e7d32", color: "white", padding: "12px 24px", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", fontWeight: "bold" }}>
                {isLoading ? <FaSpinner className="spin-icon" /> : <FaSave />} Lưu Thay Đổi
            </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAboutConfig;
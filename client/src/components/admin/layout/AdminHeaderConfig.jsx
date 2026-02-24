import React, { useState } from "react";
import { FaImage, FaSave, FaCheckCircle, FaExclamationCircle, FaSpinner } from "react-icons/fa";

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
        message: "Đã lưu cấu hình Logo & Tên thành công!",
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
        Cấu Hình Tên & Logo Website
      </h3>

      <form onSubmit={onSaveWrapper} encType="multipart/form-data">
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
            }}
          >
            {isLoading ? <><FaSpinner className="spin-icon" /> Đang lưu...</> : <><FaSave /> Lưu Thay Đổi</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminHeaderConfig;
import React, { useState } from "react";
import { FaImage, FaSave, FaCheckCircle, FaExclamationCircle, FaSpinner } from "react-icons/fa";

const AdminHeroConfig = ({
  heroConfig,
  setHeroConfig,
  previewUrl,
  handleHeroFileChange,
  handleSaveHeroConfig,
}) => {
  // State quản lý hiệu ứng loading và thông báo
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }

  // Xử lý khi bấm lưu
  const onSaveWrapper = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    try {
      // Gọi hàm lưu từ props (Giả định hàm cha trả về Promise hoặc chạy đồng bộ)
      // Lưu ý: Nếu ở file cha bạn đang có lệnh alert(), hãy xóa nó đi để dùng giao diện này
      await handleSaveHeroConfig(e);

      // Hiển thị thông báo thành công
      setNotification({
        type: "success",
        message: "Đã lưu cấu hình Hero thành công!",
      });

      // Tự động tắt thông báo sau 3 giây
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

  // Styles cục bộ
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

  const inputFocusStyle = { borderColor: "#2e7d32" };

  return (
    <div className="admin-card" style={{ padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
      <h3 style={{ marginBottom: "25px", color: "#2e7d32", borderBottom: "2px solid #e8f5e9", paddingBottom: "10px" }}>
        Cấu Hình Banner Đầu Trang (Hero Section)
      </h3>

      <form onSubmit={onSaveWrapper} encType="multipart/form-data">
        <div
          className="form-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
        >
          <div style={formGroupStyle}>
            <label style={labelStyle}>Phần tiêu đề (Đầu):</label>
            <input
              type="text"
              style={inputStyle}
              value={heroConfig.titlePrefix}
              onChange={(e) =>
                setHeroConfig({ ...heroConfig, titlePrefix: e.target.value })
              }
              placeholder="VD: Khám phá vẻ đẹp"
              onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Phần tiêu đề (Nổi bật - Màu xanh):</label>
            <input
              type="text"
              style={inputStyle}
              value={heroConfig.titleHighlight}
              onChange={(e) =>
                setHeroConfig({ ...heroConfig, titleHighlight: e.target.value })
              }
              placeholder="VD: thiên nhiên"
              onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Phần tiêu đề (Cuối):</label>
          <input
            type="text"
            style={inputStyle}
            value={heroConfig.titleSuffix}
            onChange={(e) =>
              setHeroConfig({ ...heroConfig, titleSuffix: e.target.value })
            }
            placeholder="VD: qua từng tác phẩm"
            onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          />
        </div>

        {/* KHU VỰC UPLOAD ẢNH & PREVIEW */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Hình ảnh Banner:</label>

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
                <FaImage style={{ marginRight: "8px" }} /> Chọn ảnh mới
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroFileChange}
                  style={{ display: "none" }}
                />
              </label>

              <div style={{ fontSize: "13px", color: "#666", marginTop: "5px", fontStyle: "italic" }}>
                {heroConfig.imageFile
                  ? `📂 Đã chọn: ${heroConfig.imageFile.name}`
                  : "ℹ️ Đang dùng ảnh hiện tại."}
              </div>
            </div>

            {/* Khung Preview */}
            <div
              style={{
                width: "300px",
                height: "160px",
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
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Hero Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "#aaa", fontSize: "14px" }}>Chưa có ảnh</span>
              )}
            </div>
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Mô tả chi tiết:</label>
          <textarea
            style={{ ...inputStyle, height: "100px", resize: "vertical" }}
            value={heroConfig.description}
            onChange={(e) =>
              setHeroConfig({ ...heroConfig, description: e.target.value })
            }
            placeholder="Nhập nội dung mô tả giới thiệu..."
            onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          ></textarea>
        </div>

        {/* --- PHẦN NÚT BẤM VÀ THÔNG BÁO --- */}
        <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
          
          {/* Thông báo (Notification Banner) */}
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
                animation: "fadeIn 0.3s ease-in-out",
                backgroundColor: notification.type === "success" ? "#e8f5e9" : "#ffebee",
                color: notification.type === "success" ? "#2e7d32" : "#c62828",
                border: `1px solid ${notification.type === "success" ? "#a5d6a7" : "#ef9a9a"}`,
              }}
            >
              {notification.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
              {notification.message}
            </div>
          )}

          {/* Nút Save đẹp hơn */}
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
              opacity: isLoading ? 0.8 : 1,
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.transform = "translateY(0)")}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spin-icon" /> Đang lưu...
              </>
            ) : (
              <>
                <FaSave /> Lưu Thay Đổi Hero
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* CSS Animation cho icon xoay */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spin-icon {
            animation: spin 1s linear infinite;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default AdminHeroConfig;
import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { FaBullhorn, FaMousePointer, FaEye } from "react-icons/fa";
import Pagination from "./Pagination"; 

const AdminTrackingPopupStats = () => {
  const [stats, setStats] = useState({ summary: {}, history: [] });
  const [loading, setLoading] = useState(true);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axiosClient.get("/tracking-popup/stats");
      if (res.data && res.data.success) {
        setStats({
          summary: res.data.data.summary || { views: 0, clicks: 0 },
          history: res.data.data.history || []
        });
      }
    } catch (error) {
      console.error("Lỗi fetch tracking popup stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  // Tính toán dữ liệu phân trang
  const totalPages = Math.ceil(stats.history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHistory = stats.history.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
      <h2 style={{ marginBottom: "20px", color: "#2e7d32" }}>Thống kê Tương tác Popup</h2>
      
      {/* Khối thống kê tổng quan */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "200px", padding: "20px", background: "#f5f5f5", borderRadius: "8px", borderLeft: "5px solid #2196F3" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 10px 0" }}>
            <FaEye color="#2196F3" /> Tổng Lượt Hiển Thị
          </h3>
          <p style={{ margin: "10px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            {stats.summary.views || 0} <span style={{fontSize: "14px", fontWeight: "normal"}}>lượt</span>
          </p>
        </div>
        <div style={{ flex: 1, minWidth: "200px", padding: "20px", background: "#f5f5f5", borderRadius: "8px", borderLeft: "5px solid #FF9800" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 10px 0" }}>
            <FaMousePointer color="#FF9800" /> Tổng Lượt Bấm "Xem Chi Tiết"
          </h3>
          <p style={{ margin: "10px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            {stats.summary.clicks || 0} <span style={{fontSize: "14px", fontWeight: "normal"}}>lượt</span>
          </p>
        </div>
      </div>

      {/* Khối thống kê lịch sử chi tiết */}
      <h3 style={{ marginBottom: "15px" }}>Lịch sử tương tác chi tiết</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ background: "#4caf50", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Thời gian</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Tên Popup</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Hành động</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Địa chỉ IP</th>
            </tr>
          </thead>
          <tbody>
            {currentHistory.map((item, idx) => {
              const dateObj = new Date(item.created_at || item.interaction_time);
              const formattedTime = dateObj.toLocaleTimeString("vi-VN", { 
                hour: '2-digit', minute: '2-digit', second: '2-digit' 
              });
              const formattedDate = dateObj.toLocaleDateString("vi-VN");

              // [SỬA ĐỔI] Text rõ ràng hơn cho các loại hành động
              let actionText = "Hiển thị (Xuất hiện)";
              let actionColor = "#2196F3"; // Xanh dương
              if (item.action === "click") {
                 actionText = "Nhấn 'Xem Chi Tiết'";
                 actionColor = "#FF9800"; // Cam
              } else if (item.action === "close") {
                 actionText = "Tắt Popup (Bấm X)";
                 actionColor = "#F44336"; // Đỏ
              }

              return (
                <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <b>{formattedTime}</b> - {formattedDate}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaBullhorn color="#FF5722" /> {item.popup_title || `Popup ID: ${item.popup_id}`}
                    </span>
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd", fontWeight: "bold", color: actionColor }}>
                    {actionText}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd", color: "#666" }}>
                    {item.ip_address || "N/A"}
                  </td>
                </tr>
              );
            })}
            {currentHistory.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: "20px", textAlign: "center", border: "1px solid #ddd" }}>
                  Chưa có dữ liệu lịch sử
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Hiển thị thanh phân trang */}
      {stats.history.length > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      )}
    </div>
  );
};

export default AdminTrackingPopupStats;
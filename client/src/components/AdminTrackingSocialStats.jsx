import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { FaFacebook, FaTiktok } from "react-icons/fa";

const AdminTrackingSocialStats = () => {
  const [stats, setStats] = useState({ summary: [], history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axiosClient.get("/tracking-social/stats");
      if (res.data.success) {
        setStats({
          summary: res.data.data.summary || [],
          history: res.data.data.history || []
        });
      }
    } catch (error) {
      console.error("Lỗi fetch tracking social stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
      <h2 style={{ marginBottom: "20px", color: "#2e7d32" }}>Thống kê Click Mạng Xã Hội</h2>
      
      {/* Khối thống kê tổng quan */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
        {stats.summary.map((item, idx) => (
          <div key={idx} style={{ flex: 1, minWidth: "200px", padding: "20px", background: "#f5f5f5", borderRadius: "8px", borderLeft: "5px solid #4caf50" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 10px 0" }}>
              {item.platform === 'facebook' ? <FaFacebook color="#1877F2" /> : <FaTiktok color="#000" />} 
              {item.platform.toUpperCase()}
            </h3>
            <p style={{ margin: 0, color: "#666" }}>Vị trí: <b>{item.location}</b></p>
            <p style={{ margin: "10px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#333" }}>{item.total_clicks} <span style={{fontSize: "14px", fontWeight: "normal"}}>lượt</span></p>
          </div>
        ))}
        {stats.summary.length === 0 && <p>Chưa có dữ liệu tổng quan.</p>}
      </div>

      {/* Khối thống kê lịch sử chi tiết (7 ngày gần nhất) */}
      <h3 style={{ marginBottom: "15px" }}>Lịch sử click chi tiết (7 ngày gần đây)</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ background: "#4caf50", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Thời gian</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Nền tảng</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Vị trí click</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Địa chỉ IP</th>
            </tr>
          </thead>
          <tbody>
            {stats.history.map((item, idx) => {
              // Format lại thời gian ra chuẩn: HH:mm:ss DD/MM/YYYY
              const dateObj = new Date(item.created_at);
              const formattedTime = dateObj.toLocaleTimeString("vi-VN", { 
                hour: '2-digit', minute: '2-digit', second: '2-digit' 
              });
              const formattedDate = dateObj.toLocaleDateString("vi-VN");

              return (
                <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <b>{formattedTime}</b> - {formattedDate}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd", textTransform: "capitalize" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {item.platform === 'facebook' ? <FaFacebook color="#1877F2" /> : <FaTiktok color="#000" />} 
                      {item.platform}
                    </span>
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {item.location}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd", color: "#666" }}>
                    {item.ip_address || "N/A"}
                  </td>
                </tr>
              );
            })}
            {stats.history.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: "20px", textAlign: "center", border: "1px solid #ddd" }}>
                  Chưa có dữ liệu lịch sử
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTrackingSocialStats;
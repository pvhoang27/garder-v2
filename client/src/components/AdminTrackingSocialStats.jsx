import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { FaFacebook, FaTiktok, FaDesktop, FaMobileAlt } from "react-icons/fa";
import Pagination from "./Pagination"; // [MỚI] Import component phân trang có sẵn của bạn

const AdminTrackingSocialStats = () => {
  const [stats, setStats] = useState({ summary: [], history: [] });
  const [loading, setLoading] = useState(true);

  // [MỚI] Khai báo State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Mặc định hiển thị 10 dòng 1 trang

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

  // Hàm helper để phân tích User Agent và trả về loại thiết bị
  const getDeviceType = (userAgent) => {
    if (!userAgent) return "Unknown";
    const ua = userAgent.toLowerCase();
    // Regex kiểm tra các từ khóa phổ biến của thiết bị di động/tablet
    if (/(android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile)/i.test(ua)) {
      return "Mobile";
    }
    return "Desktop";
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  // [MỚI] Tính toán dữ liệu cắt ra để hiển thị cho trang hiện tại
  const totalPages = Math.ceil(stats.history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHistory = stats.history.slice(startIndex, startIndex + itemsPerPage);

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
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
          <thead>
            <tr style={{ background: "#4caf50", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Thời gian</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Nền tảng</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Vị trí click</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Địa chỉ IP</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Thiết bị</th>
            </tr>
          </thead>
          <tbody>
            {/* [SỬA] Đổi từ stats.history.map thành currentHistory.map để chỉ hiển thị số lượng theo trang */}
            {currentHistory.map((item, idx) => {
              const dateObj = new Date(item.created_at);
              const formattedTime = dateObj.toLocaleTimeString("vi-VN", { 
                hour: '2-digit', minute: '2-digit', second: '2-digit' 
              });
              const formattedDate = dateObj.toLocaleDateString("vi-VN");
              
              const deviceType = getDeviceType(item.user_agent);

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
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }} title={item.user_agent}>
                      {deviceType === "Mobile" ? (
                        <FaMobileAlt style={{ minWidth: '16px', marginTop: '3px' }} />
                      ) : (
                        <FaDesktop style={{ minWidth: '16px', marginTop: '3px' }} />
                      )}
                      <span>
                        <strong style={{ color: deviceType === "Mobile" ? "#e67e22" : "#2980b9" }}>
                          [{deviceType}]
                        </strong>{" "}
                        <span style={{ fontSize: "13px", color: "#555", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.user_agent}
                        </span>
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {currentHistory.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: "20px", textAlign: "center", border: "1px solid #ddd" }}>
                  Chưa có dữ liệu lịch sử
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* [MỚI] Hiển thị thanh phân trang nếu có dữ liệu */}
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

export default AdminTrackingSocialStats;
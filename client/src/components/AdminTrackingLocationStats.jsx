import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AdminTrackingLocationStats = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data } = await axiosClient.get("/tracking-location/stats");
      setLocations(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu vị trí:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Danh sách Vị trí Khách hàng</h2>
      
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ background: "#4caf50", color: "#fff", textAlign: "left" }}>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>ID</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Tọa độ (Lat, Lng)</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Thời gian</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Thiết bị (User Agent)</th>
                <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>Bản đồ</th>
              </tr>
            </thead>
            <tbody>
              {locations.length > 0 ? (
                locations.map((loc) => (
                  <tr key={loc.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>{loc.id}</td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {loc.latitude}, {loc.longitude}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {new Date(loc.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd", fontSize: "13px", color: "#555" }}>
                      {loc.user_agent}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                      <a 
                        href={`https://www.google.com/maps?q=$${loc.latitude},${loc.longitude}`}
                        target="_blank" 
                        rel="noreferrer"
                        style={{ color: "#2196f3", textDecoration: "none", fontWeight: "bold" }}
                      >
                        Xem Map
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                    Chưa có dữ liệu vị trí nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Đảm bảo dòng này phải có ở cuối file thì mới import được sang AdminDashboard
export default AdminTrackingLocationStats;
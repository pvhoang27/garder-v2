import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import "./AdminTrackingStats.css"; // Dùng chung CSS của các bảng tracking khác

const AdminTrackingPlantStats = () => {
  const [summary, setSummary] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/tracking-plant/stats");
      setSummary(res.data.summary);
      setRecentLogs(res.data.recentLogs);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu tracking. Vui lòng thử lại sau.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Hàm format thời gian giây thành chữ (VD: 65s -> 1m 5s)
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0s";
    const secNum = parseInt(seconds, 10);
    const h = Math.floor(secNum / 3600);
    const m = Math.floor((secNum - h * 3600) / 60);
    const s = secNum - h * 3600 - m * 60;

    let timeString = "";
    if (h > 0) timeString += `${h}h `;
    if (m > 0) timeString += `${m}m `;
    if (s > 0 || timeString === "") timeString += `${s}s`;
    
    return timeString;
  };

  // Hàm kiểm tra User-Agent để phân loại Desktop hay Mobile
  const getDeviceType = (userAgent) => {
    if (!userAgent) return "Không xác định";
    const ua = userAgent.toLowerCase();
    // Nếu chứa các từ khóa phổ biến của điện thoại/tablet
    if (ua.includes("mobi") || ua.includes("android") || ua.includes("iphone") || ua.includes("ipad")) {
      return "Mobile";
    }
    return "Desktop";
  };

  if (loading) return <div className="tracking-stats-container">Đang tải dữ liệu...</div>;
  if (error) return <div className="tracking-stats-container text-red-500">{error}</div>;

  return (
    <div className="tracking-stats-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>Thống Kê Thời Gian Xem Cây</h2>
        {/* Đã bỏ nút "Làm mới" theo yêu cầu */}
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "1fr" }}>
        {/* Bảng 1: Tổng hợp theo từng cây */}
        <div className="stat-card full-width">
          <h3>Top Cây Được Xem Nhiều Thời Gian Nhất</h3>
          <div className="table-responsive">
            <table className="tracking-table">
              <thead>
                <tr>
                  <th>Tên cây</th>
                  <th>Tổng thời gian xem</th>
                  <th>TB Thời gian xem</th>
                  <th>Thời gian xem lâu nhất (1 phiên)</th>
                </tr>
              </thead>
              <tbody>
                {summary.length > 0 ? (
                  summary.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: "bold", color: "#2e7d32" }}>{item.plant_name}</td>
                      <td style={{ fontWeight: "bold", color: "#d32f2f" }}>{formatTime(item.total_duration_seconds)}</td>
                      <td>{formatTime(item.avg_duration_seconds)}</td>
                      <td>{formatTime(item.max_duration_seconds)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      Chưa có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bảng 2: Lịch sử chi tiết */}
        <div className="stat-card full-width">
          <h3>Lịch Sử Xem Gần Đây (100 log mới nhất)</h3>
          <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="tracking-table">
              <thead>
                <tr>
                  <th>Thời gian (Hệ thống)</th>
                  <th>Tên cây</th>
                  <th>IP / Thiết bị</th>
                  <th>Thời gian xem</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.length > 0 ? (
                  recentLogs.map((log) => {
                    const deviceType = getDeviceType(log.device_info);
                    return (
                      <tr key={log.id}>
                        <td>{new Date(log.created_at).toLocaleString('vi-VN')}</td>
                        <td style={{ fontWeight: "bold" }}>{log.plant_name}</td>
                        <td>
                          <div style={{ fontSize: "13px" }}><strong>IP:</strong> {log.ip_address}</div>
                          {/* Hiển thị phân loại Mobile / Desktop */}
                          <div style={{ fontSize: "12px", marginTop: "4px" }}>
                            <strong>Loại:</strong> <span style={{ color: deviceType === "Mobile" ? "#1976d2" : "#388e3c", fontWeight: "bold" }}>{deviceType}</span>
                          </div>
                          {/* Dòng User-Agent thô làm mờ đi một chút */}
                          <div style={{ fontSize: "11px", color: "#888", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "2px" }} title={log.device_info}>
                            {log.device_info}
                          </div>
                        </td>
                        <td style={{ color: "#d32f2f", fontWeight: "bold", fontSize: "15px" }}>
                          {formatTime(log.duration_seconds)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      Chưa có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTrackingPlantStats;
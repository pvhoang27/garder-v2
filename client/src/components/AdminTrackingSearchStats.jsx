import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  FaSearch,
  FaCalendarDay,
  FaClock,
  FaDesktop,
  FaMobileAlt,
  FaChartLine,
  FaFilter,
  FaListOl,
} from "react-icons/fa";
import "./AdminTrackingStats.css"; 

const AdminTrackingSearchStats = () => {
  const [stats, setStats] = useState({
    totalSearches: 0,
    todaySearches: 0,
    topKeywords: [],
    recentLogs: [],
  });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchStats = async (start = "", end = "") => {
    try {
      setLoading(true);
      let url = "/tracking-search/stats";
      const params = new URLSearchParams();

      if (start) params.append("startDate", start);
      if (end) params.append("endDate", end);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axiosClient.get(url);
      if (response && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching tracking search stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilter = () => {
    fetchStats(startDate, endDate);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    fetchStats();
  };

  const getDeviceType = (userAgent) => {
    if (!userAgent) return "Unknown";
    const ua = userAgent.toLowerCase();
    if (/(android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile)/i.test(ua)) {
      return "Mobile";
    }
    return "Desktop";
  };

  if (loading) {
    return (
      <div className="tracking-loading">
        <div className="tracking-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="tracking-stats-container">
      <div className="tracking-stats-inner">
        {/* Date Filter Section */}
        <div className="tracking-filter-section">
          <div className="tracking-filter-inputs">
            <div className="tracking-date-input-group">
              <label><FaClock /> Từ ngày</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="tracking-date-input" />
            </div>
            <div className="tracking-date-input-group">
              <label><FaClock /> Đến ngày</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="tracking-date-input" />
            </div>
          </div>
          <div className="tracking-filter-buttons">
            <button onClick={handleFilter} className="tracking-btn-filter"><FaFilter /> Lọc</button>
            <button onClick={handleReset} className="tracking-btn-reset">Đặt lại</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="tracking-stats-grid">
          <div className="tracking-stat-card green">
            <div className="tracking-card-content">
              <p className="tracking-card-label">Tổng lượt tìm kiếm</p>
              <h3 className="tracking-card-value">{stats.totalSearches ? stats.totalSearches.toLocaleString() : 0}</h3>
              <p className="tracking-card-subtext">Toàn thời gian</p>
            </div>
            <div className="tracking-card-icon"><FaSearch /></div>
          </div>

          <div className="tracking-stat-card blue">
            <div className="tracking-card-content">
              <p className="tracking-card-label">Tìm kiếm hôm nay</p>
              <h3 className="tracking-card-value">{stats.todaySearches ? stats.todaySearches.toLocaleString() : 0}</h3>
              <p className="tracking-card-subtext">24 giờ qua</p>
            </div>
            <div className="tracking-card-icon"><FaCalendarDay /></div>
          </div>
        </div>

        {/* Top Keywords Table */}
        {stats.topKeywords && stats.topKeywords.length > 0 && (
          <div className="tracking-table-section" style={{ marginBottom: "30px" }}>
            <div className="tracking-table-header">
              <h3 className="tracking-table-title"><FaListOl /> Top từ khóa tìm kiếm</h3>
            </div>
            <div className="tracking-table-wrapper">
              <table className="tracking-table">
                <thead>
                  <tr>
                    <th>Từ khóa</th>
                    <th>Số lượt tìm kiếm</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topKeywords.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: "bold", color: "#2e7d32" }}>{item.keyword}</td>
                      <td>{item.count} lượt</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Logs Table */}
        <div className="tracking-table-section">
          <div className="tracking-table-header">
            <h3 className="tracking-table-title"><FaChartLine /> Nhật ký tìm kiếm gần nhất</h3>
            <span className="tracking-table-badge">{stats.recentLogs ? stats.recentLogs.length : 0} logs</span>
          </div>

          <div className="tracking-table-wrapper">
            <table className="tracking-table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Từ khóa</th>
                  <th>Thời gian</th>
                  <th>IP Address</th>
                  <th>Thiết bị (User Agent)</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLogs && stats.recentLogs.length > 0 ? (
                  stats.recentLogs.map((log) => {
                    const deviceType = getDeviceType(log.user_agent);
                    return (
                      <tr key={log.id}>
                        <td className="tracking-table-id">#{log.id}</td>
                        <td style={{ fontWeight: "bold" }}>{log.keyword}</td>
                        <td className="tracking-table-time">
                          {log.search_time
                            ? new Date(log.search_time).toLocaleString("vi-VN", {
                                year: "numeric", month: "2-digit", day: "2-digit",
                                hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
                              })
                            : "N/A"}
                        </td>
                        <td><span className="tracking-table-ip">{log.ip_address}</span></td>
                        <td>
                          <div className="tracking-table-agent" title={log.user_agent}>
                            {deviceType === "Mobile" ? <FaMobileAlt style={{ minWidth: '16px' }} /> : <FaDesktop style={{ minWidth: '16px' }} />}
                            <span className="tracking-agent-text">
                              <strong style={{ color: deviceType === "Mobile" ? "#e67e22" : "#2980b9" }}>[{deviceType}]</strong> {log.user_agent}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="tracking-table-empty">Chưa có dữ liệu nào được ghi nhận.</td>
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

export default AdminTrackingSearchStats;
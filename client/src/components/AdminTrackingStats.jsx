import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  FaGlobe,
  FaCalendarDay,
  FaClock,
  FaDesktop,
  FaChartLine,
  FaFilter,
} from "react-icons/fa";
import "./AdminTrackingStats.css";

const AdminTrackingStats = () => {
  const [stats, setStats] = useState({
    totalVisits: 0,
    todayVisits: 0,
    recentLogs: [],
  });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchStats = async (start = "", end = "") => {
    try {
      setLoading(true);
      let url = "/tracking/stats";
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
      console.error("Error fetching tracking stats:", error);
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
              <label>
                <FaClock /> Từ ngày
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="tracking-date-input"
              />
            </div>
            <div className="tracking-date-input-group">
              <label>
                <FaClock /> Đến ngày
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="tracking-date-input"
              />
            </div>
          </div>
          <div className="tracking-filter-buttons">
            <button onClick={handleFilter} className="tracking-btn-filter">
              <FaFilter /> Lọc
            </button>
            <button onClick={handleReset} className="tracking-btn-reset">
              Đặt lại
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="tracking-stats-grid">
          {/* Total Visits Card */}
          <div className="tracking-stat-card green">
            <div className="tracking-card-content">
              <p className="tracking-card-label">Tổng lượt truy cập</p>
              <h3 className="tracking-card-value">
                {stats.totalVisits ? stats.totalVisits.toLocaleString() : 0}
              </h3>
              <p className="tracking-card-subtext">Toàn thời gian</p>
            </div>
            <div className="tracking-card-icon">
              <FaGlobe />
            </div>
          </div>

          {/* Today Visits Card */}
          <div className="tracking-stat-card blue">
            <div className="tracking-card-content">
              <p className="tracking-card-label">Truy cập hôm nay</p>
              <h3 className="tracking-card-value">
                {stats.todayVisits ? stats.todayVisits.toLocaleString() : 0}
              </h3>
              <p className="tracking-card-subtext">24 giờ qua</p>
            </div>
            <div className="tracking-card-icon">
              <FaCalendarDay />
            </div>
          </div>
        </div>

        {/* Recent Logs Table */}
        <div className="tracking-table-section">
          <div className="tracking-table-header">
            <h3 className="tracking-table-title">
              <FaChartLine />
              Nhật ký truy cập gần nhất
            </h3>
            <span className="tracking-table-badge">
              {stats.recentLogs ? stats.recentLogs.length : 0} logs
            </span>
          </div>

          <div className="tracking-table-wrapper">
            <table className="tracking-table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Thời gian</th>
                  <th>IP Address</th>
                  <th>Thiết bị (User Agent)</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLogs && stats.recentLogs.length > 0 ? (
                  stats.recentLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="tracking-table-id">#{log.id}</td>
                      <td className="tracking-table-time">
                        {log.visit_time
                          ? new Date(log.visit_time).toLocaleString("vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                            })
                          : "N/A"}
                      </td>
                      <td>
                        <span className="tracking-table-ip">
                          {log.ip_address}
                        </span>
                      </td>
                      <td>
                        <div
                          className="tracking-table-agent"
                          title={log.user_agent}
                        >
                          <FaDesktop />
                          <span className="tracking-agent-text">
                            {log.user_agent}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="tracking-table-empty">
                      Chưa có dữ liệu nào được ghi nhận.
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

export default AdminTrackingStats;

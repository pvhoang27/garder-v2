import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { API_URL } from "../config";
import {
  FaChartPie,
  FaEye,
  FaHome,
  FaMobileAlt,
  FaDesktop,
  FaSeedling,
  FaCalendarDay
} from "react-icons/fa";
import "./AdminTrackingOverview.css";

const AdminTrackingOverview = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    generalVisits: 0,
    todayVisits: 0,
    homepageVisits: 0,
    deviceStats: [],
    topPlants: [],
  });

  useEffect(() => {
    const fetchOverviewData = async () => {
      setLoading(true);
      try {
        // Gọi song song các API thống kê hiện có để gộp data chung 1 trang
        const [trackingRes, homeRes, dashRes] = await Promise.all([
          axiosClient.get("/tracking/stats").catch(() => ({ data: { totalVisits: 0, todayVisits: 0 } })),
          axiosClient.get("/tracking-homepage/stats").catch(() => ({ data: { totalVisits: 0, deviceStats: [] } })),
          axiosClient.get("/dashboard/stats").catch(() => ({ data: { topViews: [] } }))
        ]);

        setData({
          generalVisits: trackingRes.data.totalVisits || 0,
          todayVisits: trackingRes.data.todayVisits || 0,
          homepageVisits: homeRes.data.totalVisits || 0,
          deviceStats: homeRes.data.deviceStats || [],
          topPlants: dashRes.data.topViews ? dashRes.data.topViews.slice(0, 5) : [],
        });
      } catch (error) {
        console.error("Lỗi khi tải tổng quan tracking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <div className="tracking-overview-loading">
        <div className="spinner"></div>
        <p>Đang tổng hợp dữ liệu Tracking...</p>
      </div>
    );
  }

  // Tính toán % thiết bị
  const totalDeviceHits = data.deviceStats.reduce((sum, item) => sum + item.count, 0);
  const getDevicePercentage = (type) => {
    if (totalDeviceHits === 0) return 0;
    const device = data.deviceStats.find(d => d.device_type === type);
    return device ? Math.round((device.count / totalDeviceHits) * 100) : 0;
  };

  const mobilePercent = getDevicePercentage("Mobile");
  const desktopPercent = getDevicePercentage("Desktop");

  return (
    <div className="tracking-overview-container">
      <h2 className="tracking-overview-title">
        <FaChartPie className="icon-title" /> Dashboard Tracking Tổng Hợp
      </h2>

      {/* --- PHẦN 1: KPI CARDS --- */}
      <div className="tracking-kpi-grid">
        <div className="kpi-card bg-gradient-blue">
          <div className="kpi-info">
            <p>Tổng Lượt Truy Cập</p>
            <h3>{data.generalVisits.toLocaleString()}</h3>
            <span>Toàn bộ website</span>
          </div>
          <FaEye className="kpi-icon" />
        </div>
        
        <div className="kpi-card bg-gradient-green">
          <div className="kpi-info">
            <p>Truy Cập Hôm Nay</p>
            <h3>{data.todayVisits.toLocaleString()}</h3>
            <span>24 giờ qua</span>
          </div>
          <FaCalendarDay className="kpi-icon" />
        </div>

        <div className="kpi-card bg-gradient-orange">
          <div className="kpi-info">
            <p>Lượt Vào Trang Chủ</p>
            <h3>{data.homepageVisits.toLocaleString()}</h3>
            <span>Homepage Views</span>
          </div>
          <FaHome className="kpi-icon" />
        </div>
      </div>

      {/* --- PHẦN 2: BIỂU ĐỒ CSS & BẢNG XẾP HẠNG --- */}
      <div className="tracking-details-grid">
        
        {/* Box Thiết bị */}
        <div className="overview-box">
          <h3>Tỷ Lệ Thiết Bị Truy Cập</h3>
          <div className="device-stats-wrapper">
            
            <div className="device-bar-container">
              <div className="device-label">
                <span><FaMobileAlt color="#e67e22" /> Điện thoại (Mobile)</span>
                <strong>{mobilePercent}%</strong>
              </div>
              <div className="progress-bg">
                <div className="progress-fill mobile-fill" style={{ width: `${mobilePercent}%` }}></div>
              </div>
            </div>

            <div className="device-bar-container">
              <div className="device-label">
                <span><FaDesktop color="#2980b9" /> Máy tính (Desktop)</span>
                <strong>{desktopPercent}%</strong>
              </div>
              <div className="progress-bg">
                <div className="progress-fill desktop-fill" style={{ width: `${desktopPercent}%` }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* Box Top Cây */}
        <div className="overview-box">
          <h3><FaSeedling color="#4caf50" /> Top 5 Cây Xem Nhiều Nhất</h3>
          <ul className="top-plants-list">
            {data.topPlants.map((plant, index) => (
              <li key={plant.id} className="top-plant-item">
                <div className="plant-rank rank-badge">{index + 1}</div>
                <img src={`${API_URL}${plant.thumbnail}`} alt={plant.name} className="plant-avatar" />
                <div className="plant-info">
                  <span className="plant-name">{plant.name}</span>
                </div>
                <div className="plant-views">
                  <strong>{plant.view_count.toLocaleString()}</strong> <span>lượt xem</span>
                </div>
              </li>
            ))}
            {data.topPlants.length === 0 && (
              <li className="empty-text">Chưa có dữ liệu lượt xem cây.</li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AdminTrackingOverview;
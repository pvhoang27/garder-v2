import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  FaChartPie,
  FaEye,
  FaHome,
  FaMobileAlt,
  FaDesktop,
  FaCalendarDay,
  FaSearch,
  FaWindowRestore,
  FaShareAlt
} from "react-icons/fa";
import "./AdminTrackingOverview.css";

const AdminTrackingOverview = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    generalVisits: 0,
    todayVisits: 0,
    homepageVisits: 0,
    deviceStats: [],
    totalSearches: 0,
    popupViews: 0,
    popupClicks: 0,
    socialClicks: 0
  });

  useEffect(() => {
    const fetchOverviewData = async () => {
      setLoading(true);
      try {
        // Gọi song song tất cả các API thống kê tracking con
        const [
          trackingRes, 
          homeRes, 
          searchRes, 
          popupRes, 
          socialRes
        ] = await Promise.all([
          axiosClient.get("/tracking/stats").catch(() => ({ data: { totalVisits: 0, todayVisits: 0 } })),
          axiosClient.get("/tracking-homepage/stats").catch(() => ({ data: { totalVisits: 0, deviceStats: [] } })),
          axiosClient.get("/tracking-search/stats").catch(() => ({ data: { totalSearches: 0 } })),
          axiosClient.get("/tracking-popup/stats").catch(() => ({ data: { data: { summary: { views: 0, clicks: 0 } } } })),
          axiosClient.get("/tracking-social/stats").catch(() => ({ data: { data: { summary: [] } } }))
        ]);

        // Tính tổng số lượt click social từ mảng summary
        const socialClicksTotal = socialRes.data?.data?.summary?.reduce(
          (sum, item) => sum + (item.total_clicks || 0), 0
        ) || 0;

        setData({
          generalVisits: trackingRes.data?.totalVisits || 0,
          todayVisits: trackingRes.data?.todayVisits || 0,
          homepageVisits: homeRes.data?.totalVisits || 0,
          deviceStats: homeRes.data?.deviceStats || [],
          totalSearches: searchRes.data?.totalSearches || 0,
          popupViews: popupRes.data?.data?.summary?.views || 0,
          popupClicks: popupRes.data?.data?.summary?.clicks || 0,
          socialClicks: socialClicksTotal
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
      {/* <h2 className="tracking-overview-title">
        <FaChartPie className="icon-title" /> Dashboard Tracking Tổng Hợp
      </h2> */}

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

        <div className="kpi-card bg-gradient-purple">
          <div className="kpi-info">
            <p>Lượt Tìm Kiếm</p>
            <h3>{data.totalSearches.toLocaleString()}</h3>
            <span>Tìm kiếm trên web</span>
          </div>
          <FaSearch className="kpi-icon" />
        </div>

        <div className="kpi-card bg-gradient-teal">
          <div className="kpi-info">
            <p>Tương Tác Popup</p>
            <h3>{data.popupViews.toLocaleString()} / {data.popupClicks.toLocaleString()}</h3>
            <span>Views / Clicks</span>
          </div>
          <FaWindowRestore className="kpi-icon" />
        </div>

        <div className="kpi-card bg-gradient-pink">
          <div className="kpi-info">
            <p>Lượt Click Mạng Xã Hội</p>
            <h3>{data.socialClicks.toLocaleString()}</h3>
            <span>Social Clicks</span>
          </div>
          <FaShareAlt className="kpi-icon" />
        </div>
      </div>

      {/* --- PHẦN 2: BIỂU ĐỒ CSS & THIẾT BỊ --- */}
      <div className="tracking-details-grid">
        
        {/* Box Thiết bị */}
        <div className="overview-box">
          <h3>Tỷ Lệ Thiết Bị Truy Cập Trang Chủ</h3>
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

      </div>
    </div>
  );
};

export default AdminTrackingOverview;
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { FaGlobe, FaCalendarDay, FaClock, FaDesktop } from "react-icons/fa";

const AdminTrackingStats = () => {
  const [stats, setStats] = useState({
    totalVisits: 0,
    todayVisits: 0,
    recentLogs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosClient.get("/tracking/stats");
        if (response && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching tracking stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );

  return (
    <div style={styles.container}>
      {/* Inject CSS keyframes for animations */}
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .hover-row:hover { background-color: rgba(255, 255, 255, 0.1) !important; transition: background-color 0.2s; }
        `}
      </style>

      <div style={styles.header}>
        <div>
          {/* [ĐÃ SỬA] Màu chữ trắng sáng, bỏ gradient mờ */}
          <h2 style={styles.title}>Tracking Dashboard</h2>
          {/* [ĐÃ SỬA] Màu chữ sáng hơn để dễ đọc */}
          <p style={styles.subtitle}>Thống kê lượt truy cập hệ thống</p>
        </div>
        <div style={styles.dateBadge}>
          <FaClock style={{ marginRight: "8px" }} />
          {new Date().toLocaleDateString("vi-VN", { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
        </div>
      </div>

      {/* --- STAT CARDS --- */}
      <div style={styles.grid}>
        {/* Card Total */}
        <div style={{ ...styles.card, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
          <div style={styles.cardContent}>
            <p style={styles.cardLabel}>Tổng lượt truy cập</p>
            <h3 style={styles.cardValue}>
              {stats.totalVisits ? stats.totalVisits.toLocaleString() : 0}
            </h3>
            <p style={styles.cardSubText}>Toàn thời gian</p>
          </div>
          <div style={styles.iconWrapper}>
            <FaGlobe />
          </div>
        </div>

        {/* Card Today */}
        <div style={{ ...styles.card, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}>
          <div style={styles.cardContent}>
            <p style={styles.cardLabel}>Truy cập hôm nay</p>
            <h3 style={styles.cardValue}>
              {stats.todayVisits ? stats.todayVisits.toLocaleString() : 0}
            </h3>
            <p style={styles.cardSubText}>24 giờ qua</p>
          </div>
          <div style={styles.iconWrapper}>
            <FaCalendarDay />
          </div>
        </div>
      </div>

      {/* --- RECENT LOGS TABLE --- */}
      <div style={styles.tableSection}>
        <div style={styles.tableHeaderContainer}>
          <h3 style={styles.tableTitle}>Nhật ký truy cập gần nhất</h3>
          <span style={styles.badge}>20 logs</span>
        </div>
        
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#ID</th>
                <th style={styles.th}>Thời gian</th>
                <th style={styles.th}>IP Address</th>
                <th style={styles.th}>Thiết bị (User Agent)</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentLogs && stats.recentLogs.length > 0 ? (
                stats.recentLogs.map((log) => (
                  <tr key={log.id} className="hover-row" style={styles.tr}>
                    <td style={{ ...styles.td, color: "#9ca3af" }}>#{log.id}</td>
                    <td style={{ ...styles.td, color: "#e5e7eb", fontWeight: "500" }}>
                      {log.visit_time
                        ? new Date(log.visit_time).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                          })
                        : "N/A"}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.ipBadge}>{log.ip_address}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.agentWrapper} title={log.user_agent}>
                        <FaDesktop style={{ marginRight: "8px", color: "#9ca3af" }} />
                        {log.user_agent}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={styles.emptyState}>
                    Chưa có dữ liệu nào được ghi nhận.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- STYLES OBJECT ---
const styles = {
  container: {
    padding: "30px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: "#fff",
    maxWidth: "1200px",
    margin: "0 auto",
    animation: "fadeIn 0.5s ease-out",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "300px",
    color: "#e0e0e0",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "30px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: "20px",
  },
  title: {
    fontSize: "32px", // Tăng kích thước chữ
    fontWeight: "700",
    margin: "0 0 8px 0",
    color: "#ffffff", // [QUAN TRỌNG] Màu trắng tinh khiết
    letterSpacing: "0.5px",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)", // Thêm đổ bóng nhẹ để nổi bật trên nền bất kỳ
  },
  subtitle: {
    margin: 0,
    color: "#e0e0e0", // [QUAN TRỌNG] Màu xám rất sáng, gần như trắng
    fontSize: "15px",
    fontWeight: "400",
  },
  dateBadge: {
    background: "rgba(255,255,255,0.1)", // Tăng độ sáng nền badge
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    color: "#ffffff", // Chữ trắng
    display: "flex",
    alignItems: "center",
    border: "1px solid rgba(255,255,255,0.2)",
    fontWeight: "500",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },
  card: {
    borderRadius: "16px",
    padding: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
    position: "relative",
    overflow: "hidden",
  },
  cardContent: {
    zIndex: 2,
  },
  cardLabel: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)", // Tăng độ rõ
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cardValue: {
    margin: "10px 0 5px 0",
    fontSize: "36px",
    fontWeight: "800",
    color: "#fff",
  },
  cardSubText: {
    margin: 0,
    fontSize: "13px",
    color: "rgba(255,255,255,0.8)", // Tăng độ rõ
  },
  iconWrapper: {
    fontSize: "48px",
    color: "rgba(255,255,255,0.25)",
    zIndex: 1,
  },
  tableSection: {
    background: "#1f2937", // Slate-800
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
  },
  tableHeaderContainer: {
    padding: "20px 25px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255,255,255,0.03)",
  },
  tableTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "#ffffff", // Chữ trắng
  },
  badge: {
    background: "#374151",
    color: "#e5e7eb",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    textAlign: "left",
    padding: "16px 25px",
    color: "#d1d5db", // Xám sáng hơn
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  tr: {
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    transition: "background 0.2s",
  },
  td: {
    padding: "16px 25px",
    verticalAlign: "middle",
  },
  ipBadge: {
    fontFamily: "'Roboto Mono', monospace",
    background: "rgba(16, 185, 129, 0.15)", // Green tint rõ hơn
    color: "#34d399",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
  },
  agentWrapper: {
    display: "flex",
    alignItems: "center",
    color: "#e5e7eb", // Sáng hơn
    maxWidth: "300px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#9ca3af",
    fontStyle: "italic",
  },
};

export default AdminTrackingStats;
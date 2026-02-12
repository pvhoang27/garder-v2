import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  FaEye,
  FaCommentDots,
  FaLeaf,
  FaNewspaper,
  FaUsers,
  FaChartBar,
} from "react-icons/fa";
import { API_URL } from "../config";

const AdminStats = () => {
  const [stats, setStats] = useState({
    topViews: [],
    topComments: [],
    summary: { totalPlants: 0, totalNews: 0, totalUsers: 0, totalComments: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axiosClient.get("/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Lỗi tải thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div style={{ padding: "20px" }}>Đang tải dữ liệu...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2
        style={{
          marginBottom: "20px",
          color: "#333",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <FaChartBar /> Thống Kê Tổng Quan
      </h2>

      {/* --- PHẦN 1: THẺ SUMMARY --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <SummaryCard
          icon={<FaLeaf />}
          title="Tổng cây cảnh"
          value={stats.summary.totalPlants}
          color="#4caf50"
          bg="#e8f5e9"
        />
        <SummaryCard
          icon={<FaNewspaper />}
          title="Bài viết tin tức"
          value={stats.summary.totalNews}
          color="#2196f3"
          bg="#e3f2fd"
        />
        <SummaryCard
          icon={<FaCommentDots />}
          title="Tổng bình luận"
          value={stats.summary.totalComments}
          color="#9c27b0"
          bg="#f3e5f5"
        />
        <SummaryCard
          icon={<FaUsers />}
          title="Người dùng"
          value={stats.summary.totalUsers}
          color="#ff9800"
          bg="#fff3e0"
        />
      </div>

      {/* --- PHẦN 2: HAI BẢNG RIÊNG BIỆT --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
          gap: "30px",
        }}
      >
        {/* BẢNG 1: TOP XEM NHIỀU */}
        <div style={sectionStyle}>
          <h3 style={{ ...headerStyle, borderBottom: "2px solid #4caf50" }}>
            <FaEye style={{ color: "#4caf50" }} /> Top Cây Xem Nhiều
          </h3>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#f9f9f9", textAlign: "left" }}>
                <th style={thStyle}>Ảnh</th>
                <th style={thStyle}>Tên cây</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Lượt xem</th>
              </tr>
            </thead>
            <tbody>
              {stats.topViews.map((plant, index) => (
                <tr key={plant.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>
                    <div
                      style={{
                        position: "relative",
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      <img
                        src={`${API_URL}${plant.thumbnail}`}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                      <span style={rankBadgeStyle(index)}>{index + 1}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>{plant.name}</td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      fontWeight: "bold",
                      color: "#4caf50",
                    }}
                  >
                    {plant.view_count ? plant.view_count.toLocaleString() : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BẢNG 2: TOP BÌNH LUẬN NHIỀU */}
        <div style={sectionStyle}>
          <h3 style={{ ...headerStyle, borderBottom: "2px solid #2196f3" }}>
            <FaCommentDots style={{ color: "#2196f3" }} /> Top Thảo Luận Sôi Nổi
          </h3>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#f9f9f9", textAlign: "left" }}>
                <th style={thStyle}>Ảnh</th>
                <th style={thStyle}>Tên cây</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Bình luận</th>
              </tr>
            </thead>
            <tbody>
              {stats.topComments.map((plant, index) => (
                <tr key={plant.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>
                    <div
                      style={{
                        position: "relative",
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      <img
                        src={`${API_URL}${plant.thumbnail}`}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                      <span style={rankBadgeStyle(index)}>{index + 1}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>{plant.name}</td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      fontWeight: "bold",
                      color: "#2196f3",
                    }}
                  >
                    {plant.total_comments}
                  </td>
                </tr>
              ))}
              {stats.topComments.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    Chưa có bình luận nào
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

// --- STYLES & COMPONENTS ---
const SummaryCard = ({ icon, title, value, color, bg }) => (
  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      display: "flex",
      alignItems: "center",
      gap: "20px",
      borderLeft: `5px solid ${color}`,
    }}
  >
    <div
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        color: color,
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ color: "#666", fontSize: "14px", marginBottom: "5px" }}>
        {title}
      </div>
      <div style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
        {value}
      </div>
    </div>
  </div>
);

const rankBadgeStyle = (index) => ({
  position: "absolute",
  top: "-5px",
  left: "-5px",
  background:
    index === 0
      ? "#FFD700"
      : index === 1
        ? "#C0C0C0"
        : index === 2
          ? "#CD7F32"
          : "#333",
  color: "white",
  fontSize: "10px",
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
});

const sectionStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};
const headerStyle = {
  margin: "0 0 20px 0",
  paddingBottom: "10px",
  fontSize: "18px",
  color: "#333",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thStyle = {
  padding: "12px 10px",
  color: "#555",
  fontSize: "14px",
  fontWeight: "600",
};
const tdStyle = {
  padding: "12px 10px",
  fontSize: "14px",
  color: "#333",
  verticalAlign: "middle",
};

export default AdminStats;

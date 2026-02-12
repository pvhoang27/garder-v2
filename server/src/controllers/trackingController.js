// server/src/controllers/trackingController.js
const db = require("../config/db");

// Ghi nhận lượt truy cập mới
exports.logVisit = async (req, res) => {
  try {
    const ip_address =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const user_agent = req.headers["user-agent"];

    // Lưu vào DB
    const sql =
      "INSERT INTO access_logs (ip_address, user_agent) VALUES (?, ?)";
    await db.query(sql, [ip_address, user_agent]);

    res.status(200).json({ message: "Visit logged successfully" });
  } catch (error) {
    console.error("Error logging visit:", error);
    // Không trả về lỗi 500 để tránh ảnh hưởng trải nghiệm người dùng, chỉ log lỗi server
    res.status(200).json({ message: "Error logging but continued" });
  }
};

// Lấy thống kê cho Admin
exports.getTrackingStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = "";
    let params = [];

    // Xây dựng điều kiện lọc theo ngày
    if (startDate && endDate) {
      dateFilter = "WHERE DATE(visit_time) BETWEEN ? AND ?";
      params = [startDate, endDate];
    } else if (startDate) {
      dateFilter = "WHERE DATE(visit_time) >= ?";
      params = [startDate];
    } else if (endDate) {
      dateFilter = "WHERE DATE(visit_time) <= ?";
      params = [endDate];
    }

    // 1. Lấy tổng số lượt truy cập (theo filter hoặc tất cả)
    const [totalRows] = await db.query(
      `SELECT COUNT(*) as total FROM access_logs ${dateFilter}`,
      params,
    );
    const totalVisits = totalRows[0].total;

    // 2. Lấy số lượt truy cập hôm nay
    const [todayRows] = await db.query(
      "SELECT COUNT(*) as today FROM access_logs WHERE DATE(visit_time) = CURDATE()",
    );
    const todayVisits = todayRows[0].today;

    // 3. Lấy danh sách 50 lượt truy cập gần nhất (theo filter hoặc tất cả)
    const [recentLogs] = await db.query(
      `SELECT * FROM access_logs ${dateFilter} ORDER BY visit_time DESC LIMIT 50`,
      params,
    );

    res.json({
      totalVisits,
      todayVisits,
      recentLogs,
    });
  } catch (error) {
    console.error("Error fetching tracking stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

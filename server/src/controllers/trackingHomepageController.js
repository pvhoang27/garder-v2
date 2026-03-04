const db = require("../config/db");

exports.logHomepageVisit = async (req, res) => {
  try {
    const ip_address = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const user_agent = req.headers["user-agent"] || "";

    // Phân tích loại thiết bị
    let device_type = "Desktop";
    if (/(android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile)/i.test(user_agent.toLowerCase())) {
      device_type = "Mobile";
    }

    const sql = "INSERT INTO tracking_homepage (ip_address, device_type, user_agent) VALUES (?, ?, ?)";
    const [result] = await db.query(sql, [ip_address, device_type, user_agent]);

    // Trả về logId để client biết bản ghi nào cần cập nhật thời gian
    res.status(200).json({ message: "Homepage visit logged successfully", logId: result.insertId });
  } catch (error) {
    console.error("Error logging homepage visit:", error);
    res.status(200).json({ message: "Error logging but continued" });
  }
};

exports.updateHomepageDuration = async (req, res) => {
  try {
    const { logId, duration } = req.body;
    if (!logId || duration === undefined) {
      return res.status(400).json({ message: "Missing logId or duration" });
    }
    const sql = "UPDATE tracking_homepage SET duration = ? WHERE id = ?";
    await db.query(sql, [duration, logId]);
    res.status(200).json({ message: "Duration updated successfully" });
  } catch (error) {
    console.error("Error updating homepage duration:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getTrackingHomepageStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = "";
    let params = [];

    if (startDate && endDate) {
      dateFilter = "WHERE DATE(visited_at) BETWEEN ? AND ?";
      params = [startDate, endDate];
    } else if (startDate) {
      dateFilter = "WHERE DATE(visited_at) >= ?";
      params = [startDate];
    } else if (endDate) {
      dateFilter = "WHERE DATE(visited_at) <= ?";
      params = [endDate];
    }

    // 1. Tổng lượt truy cập & Thời gian trung bình
    const [totalRows] = await db.query(
      `SELECT COUNT(*) as total, AVG(duration) as avgDuration FROM tracking_homepage ${dateFilter}`,
      params
    );
    const totalVisits = totalRows[0].total;
    const avgDuration = totalRows[0].avgDuration ? Math.round(totalRows[0].avgDuration) : 0;

    // 2. Truy cập hôm nay
    const [todayRows] = await db.query(
      "SELECT COUNT(*) as today FROM tracking_homepage WHERE DATE(visited_at) = CURDATE()"
    );
    const todayVisits = todayRows[0].today;

    // 3. Thống kê theo loại thiết bị
    const [deviceStats] = await db.query(
      `SELECT device_type, COUNT(*) as count FROM tracking_homepage ${dateFilter} GROUP BY device_type`,
      params
    );

    // 4. Lịch sử truy cập gần nhất
    const [recentLogs] = await db.query(
      `SELECT * FROM tracking_homepage ${dateFilter} ORDER BY visited_at DESC LIMIT 50`,
      params
    );

    res.json({
      totalVisits,
      avgDuration,
      todayVisits,
      deviceStats,
      recentLogs,
    });
  } catch (error) {
    console.error("Error fetching homepage stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
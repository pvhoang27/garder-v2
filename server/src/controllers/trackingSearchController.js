const db = require("../config/db");

exports.logSearch = async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const ip_address = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const user_agent = req.headers["user-agent"];

    const sql = "INSERT INTO tracking_search (keyword, ip_address, user_agent) VALUES (?, ?, ?)";
    await db.query(sql, [keyword, ip_address, user_agent]);

    res.status(200).json({ message: "Search logged successfully" });
  } catch (error) {
    console.error("Error logging search:", error);
    res.status(200).json({ message: "Error logging but continued" });
  }
};

exports.getTrackingSearchStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = "";
    let params = [];

    if (startDate && endDate) {
      dateFilter = "WHERE DATE(search_time) BETWEEN ? AND ?";
      params = [startDate, endDate];
    } else if (startDate) {
      dateFilter = "WHERE DATE(search_time) >= ?";
      params = [startDate];
    } else if (endDate) {
      dateFilter = "WHERE DATE(search_time) <= ?";
      params = [endDate];
    }

    // 1. Lấy tổng số lượt tìm kiếm
    const [totalRows] = await db.query(
      `SELECT COUNT(*) as total FROM tracking_search ${dateFilter}`,
      params
    );
    const totalSearches = totalRows[0].total;

    // 2. Lấy số lượt tìm kiếm hôm nay
    const [todayRows] = await db.query(
      "SELECT COUNT(*) as today FROM tracking_search WHERE DATE(search_time) = CURDATE()"
    );
    const todaySearches = todayRows[0].today;

    // 3. Lấy top keywords
    const [topKeywords] = await db.query(
      `SELECT keyword, COUNT(*) as count FROM tracking_search ${dateFilter} GROUP BY keyword ORDER BY count DESC LIMIT 5`,
      params
    );

    // 4. Lấy danh sách logs gần nhất
    const [recentLogs] = await db.query(
      `SELECT * FROM tracking_search ${dateFilter} ORDER BY search_time DESC LIMIT 50`,
      params
    );

    res.json({
      totalSearches,
      todaySearches,
      topKeywords,
      recentLogs,
    });
  } catch (error) {
    console.error("Error fetching search stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
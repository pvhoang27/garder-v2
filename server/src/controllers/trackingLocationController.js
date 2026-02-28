const db = require("../config/db");

// Lưu vị trí khách hàng gửi lên
exports.logLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const user_agent = req.headers["user-agent"];

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Thiếu thông tin vị trí" });
    }

    const sql = "INSERT INTO tracking_location (latitude, longitude, user_agent) VALUES (?, ?, ?)";
    await db.query(sql, [latitude, longitude, user_agent]);

    res.status(200).json({ message: "Lưu vị trí thành công" });
  } catch (error) {
    console.error("Error logging location:", error);
    res.status(500).json({ message: "Lỗi server khi lưu vị trí" });
  }
};

// Admin lấy danh sách vị trí
exports.getLocationStats = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tracking_location ORDER BY created_at DESC");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching location stats:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
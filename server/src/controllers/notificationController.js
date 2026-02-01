const db = require('../config/db');

// Lấy thông báo (Giữ nguyên)
exports.getNotifications = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20");
        const [countRows] = await db.query("SELECT COUNT(*) as count FROM notifications WHERE is_read = 0");
        
        res.json({
            notifications: rows,
            unreadCount: countRows[0].count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Đánh dấu 1 cái đã đọc (Giữ nguyên)
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
        res.json({ message: "Đã đọc" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// --- THÊM HÀM NÀY: Đánh dấu TẤT CẢ đã đọc ---
exports.markAllAsRead = async (req, res) => {
    try {
        await db.query("UPDATE notifications SET is_read = 1 WHERE is_read = 0");
        res.json({ message: "Đã đọc tất cả" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
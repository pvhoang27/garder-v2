const db = require('../config/db');

// Ghi nhận View hoặc Click từ người dùng
exports.logInteraction = async (req, res) => {
    try {
        const { popup_id, action, device_type } = req.body;
        const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        
        // Lấy thêm chuỗi User Agent từ header của request
        const user_agent = req.headers['user-agent'] || 'Unknown';
        
        if (!popup_id) {
            return res.status(400).json({ success: false, message: "Thiếu popup_id" });
        }

        const sql = "INSERT INTO popup_interactions (popup_id, action, device_type, user_agent, ip_address) VALUES (?, ?, ?, ?, ?)";
        await db.query(sql, [popup_id, action || 'view', device_type || 'desktop', user_agent, ip_address]);

        res.status(200).json({ success: true, message: "Logged interaction successfully" });
    } catch (error) {
        console.error("Lỗi log popup interaction:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Lấy thống kê cho Admin
exports.getStats = async (req, res) => {
    try {
        // 1. Lấy tổng quan views và clicks
        const [viewRows] = await db.query("SELECT COUNT(*) as views FROM popup_interactions WHERE action = 'view'");
        const [clickRows] = await db.query("SELECT COUNT(*) as clicks FROM popup_interactions WHERE action = 'click'");

        // 2. Lấy lịch sử chi tiết (Join với popup_config để lấy tên popup)
        const [history] = await db.query(`
            SELECT pi.*, p.title as popup_title 
            FROM popup_interactions pi
            LEFT JOIN popup_config p ON pi.popup_id = p.id
            ORDER BY pi.interaction_time DESC
        `);

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    views: viewRows[0].views || 0,
                    clicks: clickRows[0].clicks || 0
                },
                history: history || []
            }
        });
    } catch (error) {
        console.error("Lỗi get popup stats:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
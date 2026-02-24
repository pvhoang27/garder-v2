const db = require('../config/db');

exports.logClick = async (req, res) => {
    try {
        const { platform, location } = req.body;
        // Lấy IP nếu cần, express req.ip hoạt động tốt nếu cấu hình trust proxy
        const ipAddress = req.ip || req.connection?.remoteAddress || '';
        const userAgent = req.headers['user-agent'] || '';

        const sql = `INSERT INTO tracking_social_logs (platform, location, ip_address, user_agent) VALUES (?, ?, ?, ?)`;
        await db.execute(sql, [platform, location, ipAddress, userAgent]);

        res.status(200).json({ success: true, message: 'Social click logged' });
    } catch (error) {
        console.error('Lỗi log social click:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getStats = async (req, res) => {
    try {
        // Thống kê tổng lượt click nhóm theo nền tảng và vị trí
        const [summaryRows] = await db.execute(`
            SELECT platform, location, COUNT(*) as total_clicks
            FROM tracking_social_logs
            GROUP BY platform, location
        `);

        // [SỬA ĐỔI] Lấy danh sách lịch sử CHI TIẾT từng lượt click trong 7 ngày gần nhất
        const [historyRows] = await db.execute(`
            SELECT id, platform, location, ip_address, created_at
            FROM tracking_social_logs
            WHERE created_at >= NOW() - INTERVAL 7 DAY
            ORDER BY created_at DESC
        `);

        res.status(200).json({
            success: true,
            data: {
                summary: summaryRows,
                history: historyRows // Đổi tên trả về thành history cho hợp nghĩa
            }
        });
    } catch (error) {
        console.error('Lỗi get social stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
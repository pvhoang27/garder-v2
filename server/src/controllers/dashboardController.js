const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // --- 1. LẤY TOP 5 CÂY XEM NHIỀU NHẤT (Riêng) ---
        const sqlViews = `
            SELECT id, name, thumbnail, view_count, category_id 
            FROM plants 
            ORDER BY view_count DESC 
            LIMIT 5
        `;
        const [topViews] = await db.query(sqlViews);

        // --- 2. LẤY TOP 5 CÂY BÌNH LUẬN NHIỀU NHẤT (Riêng) ---
        // Đếm số dòng trong bảng comments có entity_type = 'plant'
        const sqlComments = `
            SELECT p.id, p.name, p.thumbnail, COUNT(c.id) as total_comments
            FROM plants p
            JOIN comments c ON p.id = c.entity_id AND c.entity_type = 'plant'
            GROUP BY p.id
            ORDER BY total_comments DESC
            LIMIT 5
        `;
        const [topComments] = await db.query(sqlComments);

        // (Optional) Lấy tổng số liệu hệ thống để hiển thị thẻ tổng quan
        const [countPlants] = await db.query("SELECT COUNT(*) as total FROM plants");
        const [countNews] = await db.query("SELECT COUNT(*) as total FROM news");
        const [countUsers] = await db.query("SELECT COUNT(*) as total FROM users");
        const [countComments] = await db.query("SELECT COUNT(*) as total FROM comments");

        res.json({
            topViews,      // Danh sách 1
            topComments,   // Danh sách 2
            summary: {
                totalPlants: countPlants[0].total,
                totalNews: countNews[0].total,
                totalUsers: countUsers[0].total,
                totalComments: countComments[0].total
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi lấy thống kê dashboard" });
    }
};
const db = require('../config/db');

// Lấy danh sách bình luận theo bài viết/cây
exports.getComments = async (req, res) => {
    try {
        const { entity_type, entity_id } = req.query;
        // Join với bảng users để lấy tên nếu là thành viên
        const sql = `
            SELECT c.*, u.full_name as user_name, u.avatar 
            FROM comments c 
            LEFT JOIN users u ON c.user_id = u.id 
            WHERE c.entity_type = ? AND c.entity_id = ? 
            ORDER BY c.created_at DESC
        `;
        const [rows] = await db.query(sql, [entity_type, entity_id]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi lấy bình luận" });
    }
};

// Thêm bình luận mới & Tạo thông báo
exports.addComment = async (req, res) => {
    try {
        const { user_id, guest_name, entity_type, entity_id, content } = req.body;

        // 1. Validate
        if (!content) return res.status(400).json({ message: "Nội dung không được để trống" });
        const nameDisplay = guest_name || "Khách ẩn danh";

        // 2. Insert Comment
        await db.query(
            "INSERT INTO comments (user_id, guest_name, entity_type, entity_id, content) VALUES (?, ?, ?, ?, ?)",
            [user_id || null, nameDisplay, entity_type, entity_id, content]
        );

        // 3. Insert Notification cho Admin
        const notifMsg = `${guest_name || 'Một thành viên'} đã bình luận về ${entity_type === 'plant' ? 'cây cảnh' : 'tin tức'}: "${content.substring(0, 30)}..."`;
        await db.query(
            "INSERT INTO notifications (message, type) VALUES (?, ?)",
            [notifMsg, 'comment']
        );

        res.status(201).json({ message: "Đã gửi bình luận" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi bình luận" });
    }
};
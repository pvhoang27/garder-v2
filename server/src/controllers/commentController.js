const db = require('../config/db');

// 1. Lấy danh sách bình luận (Public - Cho Client xem)
exports.getComments = async (req, res) => {
    try {
        const { entity_type, entity_id } = req.query;
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

// 2. Thêm bình luận (BẮT BUỘC ĐĂNG NHẬP)
exports.addComment = async (req, res) => {
    try {
        const { user_id, guest_name, entity_type, entity_id, content } = req.body;

        if (!content) return res.status(400).json({ message: "Nội dung không được để trống" });

        // Validate bắt buộc có user_id
        if (!user_id) {
            return res.status(401).json({ message: "Bạn cần đăng nhập để bình luận." });
        }

        // Lấy tên hiển thị từ guest_name (đã được client gửi là full_name của user)
        const nameDisplay = guest_name;

        // Insert vào bảng comments
        await db.query(
            "INSERT INTO comments (user_id, guest_name, entity_type, entity_id, content) VALUES (?, ?, ?, ?, ?)",
            [user_id, nameDisplay, entity_type, entity_id, content]
        );

        // Tạo thông báo cho Admin
        const notifMsg = `${nameDisplay} đã bình luận về ${entity_type === 'plant' ? 'cây cảnh' : 'tin tức'}: "${content.substring(0, 30)}..."`;
        await db.query(
            "INSERT INTO notifications (message, type, entity_type, entity_id) VALUES (?, ?, ?, ?)",
            [notifMsg, 'comment', entity_type, entity_id]
        );

        res.status(201).json({ message: "Đã gửi bình luận" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi bình luận" });
    }
};

// 3. Admin lấy tất cả bình luận (ĐÃ SỬA: JOIN THÊM PLANTS VÀ NEWS)
exports.getAllCommentsForAdmin = async (req, res) => {
    try {
        // Left join thêm bảng plants và news để lấy tên
        const sql = `
            SELECT c.*, u.full_name as user_full_name,
                   p.name as plant_name,
                   n.title as news_title
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            LEFT JOIN plants p ON c.entity_type = 'plant' AND c.entity_id = p.id
            LEFT JOIN news n ON c.entity_type = 'news' AND c.entity_id = n.id
            ORDER BY c.created_at DESC
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 4. Admin xóa bình luận
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM comments WHERE id = ?", [id]);
        res.json({ message: "Đã xóa bình luận" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi xóa" });
    }
};
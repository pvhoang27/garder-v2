const db = require('../config/db');

// 1. Lấy danh sách bình luận theo bài viết/cây (Cho trang chi tiết ở Client)
exports.getComments = async (req, res) => {
    try {
        const { entity_type, entity_id } = req.query;
        // Join với bảng users để lấy tên/avatar nếu là thành viên đã đăng nhập
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

// 2. Thêm bình luận mới & Tạo thông báo (CẬP NHẬT QUAN TRỌNG)
exports.addComment = async (req, res) => {
    try {
        const { user_id, guest_name, entity_type, entity_id, content } = req.body;

        // Validate
        if (!content) return res.status(400).json({ message: "Nội dung không được để trống" });
        const nameDisplay = guest_name || "Khách ẩn danh";

        // Insert vào bảng comments
        await db.query(
            "INSERT INTO comments (user_id, guest_name, entity_type, entity_id, content) VALUES (?, ?, ?, ?, ?)",
            [user_id || null, nameDisplay, entity_type, entity_id, content]
        );

        // Insert vào bảng notifications (KÈM entity_type VÀ entity_id ĐỂ CLICK LINK)
        const notifMsg = `${guest_name || 'Một thành viên'} đã bình luận về ${entity_type === 'plant' ? 'cây cảnh' : 'tin tức'}: "${content.substring(0, 30)}..."`;
        
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

// 3. Lấy TẤT CẢ bình luận (Dành cho trang Admin quản lý)
exports.getAllCommentsForAdmin = async (req, res) => {
    try {
        // Join user để lấy tên hiển thị, sắp xếp mới nhất lên đầu
        const sql = `
            SELECT c.*, u.full_name as user_full_name
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            ORDER BY c.created_at DESC
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 4. Xóa bình luận
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
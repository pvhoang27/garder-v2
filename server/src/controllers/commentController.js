const db = require('../config/db');

// --- BỘ NHỚ TẠM ĐỂ LƯU THỜI GIAN BÌNH LUẬN CỦA KHÁCH ---
// Cấu trúc: Map<IP_Address, Timestamp>
const guestRateLimit = new Map();

// 1. Lấy danh sách bình luận (Giữ nguyên)
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

// 2. Thêm bình luận (ĐÃ SỬA: CHỈ CHO PHÉP THÀNH VIÊN)
exports.addComment = async (req, res) => {
    try {
        const { user_id, guest_name, entity_type, entity_id, content } = req.body;

        // Validate nội dung
        if (!content) return res.status(400).json({ message: "Nội dung không được để trống" });

        // --- SỬA: BẮT BUỘC PHẢI CÓ USER_ID (ĐĂNG NHẬP) ---
        if (!user_id) {
            return res.status(401).json({ message: "Bạn cần đăng nhập để bình luận." });
        }

        /* --- COMMENT LẠI LOGIC CHẶN SPAM CHO KHÁCH ---
        if (!user_id) { 
            // Lấy IP người dùng
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const now = Date.now();
            const limitTime = 5 * 60 * 1000; // 5 phút (đổi ra milliseconds)

            if (guestRateLimit.has(ip)) {
                const lastTime = guestRateLimit.get(ip);
                if (now - lastTime < limitTime) {
                    const minutesLeft = Math.ceil((limitTime - (now - lastTime)) / 60000);
                    return res.status(429).json({ 
                        message: `Bạn bình luận quá nhanh! Vui lòng đợi ${minutesLeft} phút nữa.` 
                    });
                }
            }
            // Cập nhật thời gian mới cho IP này
            guestRateLimit.set(ip, now);
        }
        ------------------------------------------ */

        // const nameDisplay = guest_name || "Khách ẩn danh";
        const nameDisplay = guest_name; // Lấy tên từ user đã đăng nhập

        // Insert vào bảng comments
        await db.query(
            "INSERT INTO comments (user_id, guest_name, entity_type, entity_id, content) VALUES (?, ?, ?, ?, ?)",
            [user_id, nameDisplay, entity_type, entity_id, content]
        );

        // Insert thông báo cho Admin
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

// 3. Admin lấy tất cả bình luận (Giữ nguyên)
exports.getAllCommentsForAdmin = async (req, res) => {
    try {
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

// 4. Admin xóa bình luận (Giữ nguyên)
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
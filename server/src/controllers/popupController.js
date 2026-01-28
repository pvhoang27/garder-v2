const db = require('../config/db');

// Public: Chỉ lấy những popup đang bật (is_active = 1)
exports.getPublicPopups = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM popup_config WHERE is_active = 1');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Admin: Lấy tất cả popup
exports.getAllPopups = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM popup_config ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Admin: Tạo mới popup
exports.createPopup = async (req, res) => {
    try {
        const { title, content, link_url, position, is_active, width, height } = req.body;
        
        // Xử lý nhiều file
        let mediaUrls = [];
        if (req.files && req.files.length > 0) {
            mediaUrls = req.files.map(file => `/uploads/${file.filename}`);
        }

        const activeStatus = is_active === 'true' || is_active === true ? 1 : 0;
        const mediaJson = JSON.stringify(mediaUrls); // Lưu dạng JSON String

        await db.query(
            `INSERT INTO popup_config (title, content, media_urls, link_url, position, is_active, width, height) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, content, mediaJson, link_url, position, activeStatus, width || 'auto', height || 'auto']
        );
        res.json({ message: 'Tạo popup thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi tạo popup' });
    }
};

// Admin: Cập nhật popup
exports.updatePopup = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, link_url, position, is_active, old_media_urls, width, height } = req.body;
        
        let mediaUrls = [];

        // Nếu có upload file mới thì dùng file mới
        if (req.files && req.files.length > 0) {
            mediaUrls = req.files.map(file => `/uploads/${file.filename}`);
        } else {
            // Nếu không upload mới, dùng lại list cũ (parse từ string gửi lên)
            if (old_media_urls) {
                try {
                    mediaUrls = JSON.parse(old_media_urls);
                } catch (e) {
                    mediaUrls = [old_media_urls]; // Fallback nếu dữ liệu cũ không phải JSON
                }
            }
        }

        const activeStatus = is_active === 'true' || is_active === true || is_active === '1' ? 1 : 0;
        const mediaJson = JSON.stringify(mediaUrls);

        await db.query(
            `UPDATE popup_config SET 
            title = ?, content = ?, media_urls = ?, link_url = ?, position = ?, is_active = ?, width = ?, height = ?
            WHERE id = ?`,
            [title, content, mediaJson, link_url, position, activeStatus, width, height, id]
        );

        res.json({ message: 'Cập nhật thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi cập nhật' });
    }
};

// Admin: Xóa popup
exports.deletePopup = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM popup_config WHERE id = ?', [id]);
        res.json({ message: 'Đã xóa popup' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa popup' });
    }
};
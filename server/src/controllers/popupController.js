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
        const { title, content, link_url, position, is_active } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : '';
        const activeStatus = is_active === 'true' || is_active === true ? 1 : 0;

        await db.query(
            `INSERT INTO popup_config (title, content, image_url, link_url, position, is_active) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, content, image_url, link_url, position, activeStatus]
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
        const { title, content, link_url, position, is_active, old_image_url } = req.body;
        
        let image_url = old_image_url;
        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }
        const activeStatus = is_active === 'true' || is_active === true || is_active === '1' ? 1 : 0;

        await db.query(
            `UPDATE popup_config SET 
            title = ?, content = ?, image_url = ?, link_url = ?, position = ?, is_active = ? 
            WHERE id = ?`,
            [title, content, image_url, link_url, position, activeStatus, id]
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
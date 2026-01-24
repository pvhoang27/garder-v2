const db = require('../config/db');

// Lấy thông tin Popup (Luôn lấy dòng đầu tiên id=1)
exports.getPopup = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM popup_config WHERE id = 1');
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.json({});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Cập nhật Popup (Admin)
exports.updatePopup = async (req, res) => {
    try {
        const { title, content, link_url, position, is_active } = req.body;
        
        // Xử lý ảnh (nếu có upload ảnh mới thì dùng, không thì giữ nguyên logic cũ ở frontend gửi lên hoặc null)
        let image_url = req.body.old_image_url; // Lấy lại đường dẫn cũ từ client gửi lên (nếu không đổi ảnh)
        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }

        // Chuyển is_active sang boolean (vì gửi từ form dạng chuỗi 'true'/'false' hoặc 'on')
        const activeStatus = is_active === 'true' || is_active === true || is_active === '1' ? 1 : 0;

        // Cập nhật vào ID = 1
        await db.query(
            `UPDATE popup_config SET 
            title = ?, content = ?, image_url = ?, link_url = ?, position = ?, is_active = ? 
            WHERE id = 1`,
            [title, content, image_url, link_url, position, activeStatus]
        );

        res.json({ message: 'Cập nhật Popup thành công!', image_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi cập nhật popup' });
    }
};
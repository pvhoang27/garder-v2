const db = require('../config/db');

// 1. Lấy tất cả danh mục
exports.getAllCategories = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories ORDER BY id ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server lấy danh mục' });
    }
};

// 2. Thêm danh mục mới
exports.createCategory = async (req, res) => {
    try {
        const { name, slug, description } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ message: 'Tên và Slug là bắt buộc' });
        }

        const sql = 'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [name, slug, description]);

        res.status(201).json({ 
            message: 'Thêm danh mục thành công', 
            categoryId: result.insertId 
        });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Slug này đã tồn tại, hãy chọn slug khác' });
        }
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 3. Cập nhật danh mục
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description } = req.body;

        const sql = 'UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?';
        await db.query(sql, [name, slug, description, id]);

        res.json({ message: 'Cập nhật danh mục thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 4. Xóa danh mục
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Lưu ý: Nếu xóa danh mục, các cây thuộc danh mục này sẽ bị set category_id = NULL (do cài đặt foreign key lúc đầu)
        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Đã xóa danh mục' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
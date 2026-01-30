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

// 2. Thêm danh mục mới (Có xử lý ảnh)
exports.createCategory = async (req, res) => {
    try {
        const { name, slug, description } = req.body;
        // Lấy tên file ảnh nếu có upload
        const image = req.file ? req.file.filename : null; 

        if (!name || !slug) {
            return res.status(400).json({ message: 'Tên và Slug là bắt buộc' });
        }

        const sql = 'INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [name, slug, description, image]);

        res.status(201).json({ 
            message: 'Thêm danh mục thành công', 
            categoryId: result.insertId,
            image: image 
        });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Slug này đã tồn tại' });
        }
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 3. Cập nhật danh mục (Có xử lý ảnh)
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description } = req.body;
        
        // Nếu có file ảnh mới thì cập nhật cả ảnh, không thì giữ nguyên
        let sql, params;
        if (req.file) {
            const image = req.file.filename;
            sql = 'UPDATE categories SET name = ?, slug = ?, description = ?, image = ? WHERE id = ?';
            params = [name, slug, description, image, id];
        } else {
            sql = 'UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?';
            params = [name, slug, description, id];
        }

        await db.query(sql, params);

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
        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Đã xóa danh mục' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
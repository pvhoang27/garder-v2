const db = require('../config/db');

// Lấy danh sách tin tức
exports.getAllNews = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM news ORDER BY created_at DESC");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Lấy chi tiết tin tức
exports.getNewsById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM news WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Không tìm thấy tin tức" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Tạo tin tức mới
exports.createNews = async (req, res) => {
    try {
        const { title, summary, content } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const [result] = await db.query(
            "INSERT INTO news (title, summary, content, image) VALUES (?, ?, ?, ?)",
            [title, summary, content, image]
        );

        res.status(201).json({ message: "Thêm tin tức thành công", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Cập nhật tin tức
exports.updateNews = async (req, res) => {
    try {
        const { title, summary, content } = req.body;
        let imageQuery = "";
        let params = [title, summary, content];

        if (req.file) {
            imageQuery = ", image = ?";
            params.push(`/uploads/${req.file.filename}`);
        }

        params.push(req.params.id);

        await db.query(
            `UPDATE news SET title = ?, summary = ?, content = ? ${imageQuery} WHERE id = ?`,
            params
        );

        res.json({ message: "Cập nhật thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Xóa tin tức
exports.deleteNews = async (req, res) => {
    try {
        await db.query("DELETE FROM news WHERE id = ?", [req.params.id]);
        res.json({ message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};
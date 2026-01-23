const db = require('../config/db');

// 1. Lấy danh sách (Giữ nguyên)
exports.getAllPlants = async (req, res) => {
    try {
        const { keyword, category_id, is_featured } = req.query;
        let sql = `
            SELECT p.*, c.name as category_name, 
            (SELECT image_url FROM plant_images WHERE plant_id = p.id AND is_thumbnail = 1 LIMIT 1) as thumbnail
            FROM plants p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1 
        `;
        const params = [];

        if (keyword) {
            sql += ` AND p.name LIKE ?`;
            params.push(`%${keyword}%`);
        }
        if (category_id) {
            sql += ` AND p.category_id = ?`;
            params.push(category_id);
        }
        if (is_featured) {
            sql += ` AND p.is_featured = ?`;
            params.push(is_featured === 'true' || is_featured === '1' ? 1 : 0);
        }

        sql += ` ORDER BY p.created_at DESC`;
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 2. Chi tiết (Giữ nguyên)
exports.getPlantById = async (req, res) => {
    try {
        const plantId = req.params.id;
        const [plantRows] = await db.query('SELECT * FROM plants WHERE id = ?', [plantId]);
        if (plantRows.length === 0) return res.status(404).json({ message: 'Không tìm thấy cây' });

        const plant = plantRows[0];
        const [imageRows] = await db.query('SELECT * FROM plant_images WHERE plant_id = ?', [plantId]);
        plant.images = imageRows;
        res.json(plant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 3. THÊM CÂY (NÂNG CẤP: Nhiều ảnh)
exports.createPlant = async (req, res) => {
    try {
        const { name, category_id, age, scientific_name, description, care_instruction, video_url, is_featured } = req.body;
        
        if (!name || !category_id) {
            return res.status(400).json({ message: 'Thiếu tên hoặc danh mục' });
        }

        const featuredVal = (is_featured === 'true' || is_featured === true || is_featured === '1') ? 1 : 0;

        // Insert thông tin cây
        const sqlPlant = `INSERT INTO plants (name, category_id, age, scientific_name, description, care_instruction, video_url, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(sqlPlant, [name, category_id, age, scientific_name, description, care_instruction, video_url, featuredVal]);
        const newPlantId = result.insertId;

        // Xử lý nhiều ảnh (req.files là mảng)
        if (req.files && req.files.length > 0) {
            const imageValues = req.files.map((file, index) => {
                // Ảnh đầu tiên (index 0) sẽ là thumbnail (is_thumbnail = 1), còn lại là 0
                return [newPlantId, `/uploads/${file.filename}`, index === 0];
            });

            // Insert một lần nhiều dòng (Bulk Insert)
            const sqlImage = `INSERT INTO plant_images (plant_id, image_url, is_thumbnail) VALUES ?`;
            await db.query(sqlImage, [imageValues]);
        }

        res.status(201).json({ message: 'Thêm cây thành công!', plantId: newPlantId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi thêm cây' });
    }
};

// 4. UPDATE CÂY (NÂNG CẤP: Thêm ảnh mới vào bộ sưu tập)
exports.updatePlant = async (req, res) => {
    try {
        const plantId = req.params.id;
        const { name, category_id, age, scientific_name, description, care_instruction, video_url, is_featured } = req.body;

        const featuredVal = (is_featured === 'true' || is_featured === true || is_featured === '1') ? 1 : 0;

        const sql = `UPDATE plants SET name=?, category_id=?, age=?, scientific_name=?, description=?, care_instruction=?, video_url=?, is_featured=? WHERE id=?`;
        await db.query(sql, [name, category_id, age, scientific_name, description, care_instruction, video_url, featuredVal, plantId]);

        // Nếu có upload thêm ảnh
        if (req.files && req.files.length > 0) {
            // Nếu muốn ảnh mới đè ảnh cũ làm thumbnail thì bỏ comment dòng dưới
            // await db.query('UPDATE plant_images SET is_thumbnail = false WHERE plant_id = ?', [plantId]);

            const imageValues = req.files.map(file => [plantId, `/uploads/${file.filename}`, false]); // Mặc định ảnh thêm vào không phải thumbnail
            const sqlImage = `INSERT INTO plant_images (plant_id, image_url, is_thumbnail) VALUES ?`;
            await db.query(sqlImage, [imageValues]);
        }

        res.json({ message: 'Cập nhật thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 5. Xóa (Giữ nguyên)
exports.deletePlant = async (req, res) => {
    try {
        await db.query('DELETE FROM plants WHERE id = ?', [req.params.id]);
        res.json({ message: 'Đã xóa cây' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
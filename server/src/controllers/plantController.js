const db = require("../config/db");

// 1. Lấy danh sách (Giữ nguyên)
exports.getAllPlants = async (req, res) => {
  try {
    const { keyword, category_id, is_featured } = req.query;
    let sql = `
            SELECT p.*, c.name as category_name 
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
      params.push(is_featured === "true" || is_featured === "1" ? 1 : 0);
    }

    sql += ` ORDER BY p.created_at DESC`;
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 2. Chi tiết (Đã cập nhật để lấy thêm Attributes)
exports.getPlantById = async (req, res) => {
  try {
    const plantId = req.params.id;
    const sql = `
      SELECT p.*, c.name as category_name 
      FROM plants p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `;
    const [plantRows] = await db.query(sql, [plantId]);

    if (plantRows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy cây" });

    const plant = plantRows[0];

    // Lấy album ảnh/video
    const [imageRows] = await db.query(
      "SELECT * FROM plant_images WHERE plant_id = ?",
      [plantId],
    );
    plant.media = imageRows;

    // --- LẤY THÊM CÁC THUỘC TÍNH ĐỘNG (NEW) ---
    const [attrRows] = await db.query(
      "SELECT * FROM plant_attributes WHERE plant_id = ?",
      [plantId],
    );
    plant.attributes = attrRows; // Trả về dạng [{ key: 'Cao', value: '1m' }, ...]

    res.json(plant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 3. THÊM CÂY MỚI (Có xử lý Attributes và Price)
exports.createPlant = async (req, res) => {
  try {
    const {
      name,
      price, // <--- THÊM GIÁ
      category_id,
      age,
      scientific_name,
      description,
      care_instruction,
      is_featured,
      attributes,
    } = req.body;

    const thumbnail = req.files["thumbnail"]
      ? `/uploads/${req.files["thumbnail"][0].filename}`
      : null;

    const featuredVal = is_featured === "true" || is_featured === "1" ? 1 : 0;
    const priceVal = price ? parseInt(price) : 0; // Xử lý giá

    // Insert bảng plants
    const sqlPlant = `INSERT INTO plants (name, price, category_id, age, scientific_name, description, care_instruction, thumbnail, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sqlPlant, [
      name,
      priceVal,
      category_id,
      age,
      scientific_name,
      description,
      care_instruction,
      thumbnail,
      featuredVal,
    ]);
    const newPlantId = result.insertId;

    // --- XỬ LÝ ATTRIBUTES (NEW) ---
    if (attributes) {
      const parsedAttrs = JSON.parse(attributes); // Client gửi dạng chuỗi JSON
      if (Array.isArray(parsedAttrs) && parsedAttrs.length > 0) {
        const attrValues = parsedAttrs.map((item) => [
          newPlantId,
          item.key,
          item.value,
        ]);
        await db.query(
          `INSERT INTO plant_attributes (plant_id, attr_key, attr_value) VALUES ?`,
          [attrValues],
        );
      }
    }

    // Xử lý Gallery
    if (req.files["gallery"] && req.files["gallery"].length > 0) {
      const mediaValues = req.files["gallery"].map((file) => [
        newPlantId,
        `/uploads/${file.filename}`,
        0,
      ]);
      await db.query(
        `INSERT INTO plant_images (plant_id, image_url, is_thumbnail) VALUES ?`,
        [mediaValues],
      );
    }

    res
      .status(201)
      .json({ message: "Thêm cây thành công!", plantId: newPlantId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi thêm cây" });
  }
};

// 4. UPDATE CÂY (Có xử lý Attributes và Price)
exports.updatePlant = async (req, res) => {
  try {
    const plantId = req.params.id;
    const {
      name,
      price, // <--- THÊM GIÁ
      category_id,
      age,
      scientific_name,
      description,
      care_instruction,
      is_featured,
      attributes,
    } = req.body;

    const featuredVal = is_featured === "true" || is_featured === "1" ? 1 : 0;
    const priceVal = price ? parseInt(price) : 0;

    let sql = `UPDATE plants SET name=?, price=?, category_id=?, age=?, scientific_name=?, description=?, care_instruction=?, is_featured=?`;
    const params = [
      name,
      priceVal,
      category_id,
      age,
      scientific_name,
      description,
      care_instruction,
      featuredVal,
    ];

    if (req.files["thumbnail"]) {
      sql += `, thumbnail=?`;
      params.push(`/uploads/${req.files["thumbnail"][0].filename}`);
    }

    sql += ` WHERE id=?`;
    params.push(plantId);

    await db.query(sql, params);

    // --- XỬ LÝ ATTRIBUTES (NEW) ---
    // 1. Xóa hết attributes cũ
    await db.query("DELETE FROM plant_attributes WHERE plant_id = ?", [
      plantId,
    ]);

    // 2. Thêm lại attributes mới từ Client
    if (attributes) {
      const parsedAttrs = JSON.parse(attributes);
      if (Array.isArray(parsedAttrs) && parsedAttrs.length > 0) {
        // Lọc bỏ những dòng trống (nếu có)
        const validAttrs = parsedAttrs.filter((item) => item.key && item.value);
        if (validAttrs.length > 0) {
          const attrValues = validAttrs.map((item) => [
            plantId,
            item.key,
            item.value,
          ]);
          await db.query(
            `INSERT INTO plant_attributes (plant_id, attr_key, attr_value) VALUES ?`,
            [attrValues],
          );
        }
      }
    }

    // Thêm Gallery mới
    if (req.files["gallery"] && req.files["gallery"].length > 0) {
      const mediaValues = req.files["gallery"].map((file) => [
        plantId,
        `/uploads/${file.filename}`,
        0,
      ]);
      await db.query(
        `INSERT INTO plant_images (plant_id, image_url, is_thumbnail) VALUES ?`,
        [mediaValues],
      );
    }

    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 5. Xóa Cây
exports.deletePlant = async (req, res) => {
  try {
    await db.query("DELETE FROM plants WHERE id = ?", [req.params.id]);
    res.json({ message: "Đã xóa cây" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 6. Xóa ảnh
exports.deletePlantImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    await db.query("DELETE FROM plant_images WHERE id = ?", [imageId]);
    res.json({ message: "Đã xóa ảnh/video thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa ảnh" });
  }
};
const db = require("../config/db");

// 1. Lấy danh sách
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

// 2. Chi tiết (ĐÃ SỬA: JOIN để lấy category_name)
exports.getPlantById = async (req, res) => {
  try {
    const plantId = req.params.id;
    // SỬA Ở ĐÂY: Thêm JOIN với bảng categories
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

    // Lấy album (bao gồm cả ảnh và video phụ)
    const [imageRows] = await db.query(
      "SELECT * FROM plant_images WHERE plant_id = ?",
      [plantId],
    );
    plant.media = imageRows;
    res.json(plant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 3. THÊM CÂY MỚI
exports.createPlant = async (req, res) => {
  try {
    const {
      name,
      category_id,
      age,
      scientific_name,
      description,
      care_instruction,
      is_featured,
    } = req.body;

    // Thumbnail là file ảnh đại diện duy nhất
    const thumbnail = req.files["thumbnail"]
      ? `/uploads/${req.files["thumbnail"][0].filename}`
      : null;

    const featuredVal =
      is_featured === "true" || is_featured === true || is_featured === "1"
        ? 1
        : 0;

    const sqlPlant = `INSERT INTO plants (name, category_id, age, scientific_name, description, care_instruction, thumbnail, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sqlPlant, [
      name,
      category_id,
      age,
      scientific_name,
      description,
      care_instruction,
      thumbnail,
      featuredVal,
    ]);
    const newPlantId = result.insertId;

    // Xử lý Album (Gallery): Chứa cả Ảnh và Video
    if (req.files["gallery"] && req.files["gallery"].length > 0) {
      const mediaValues = req.files["gallery"].map((file) => [
        newPlantId,
        `/uploads/${file.filename}`,
        0,
      ]);
      const sqlMedia = `INSERT INTO plant_images (plant_id, image_url, is_thumbnail) VALUES ?`;
      await db.query(sqlMedia, [mediaValues]);
    }

    res
      .status(201)
      .json({ message: "Thêm cây thành công!", plantId: newPlantId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi thêm cây" });
  }
};

// 4. UPDATE CÂY
exports.updatePlant = async (req, res) => {
  try {
    const plantId = req.params.id;
    const {
      name,
      category_id,
      age,
      scientific_name,
      description,
      care_instruction,
      is_featured,
    } = req.body;

    const featuredVal =
      is_featured === "true" || is_featured === true || is_featured === "1"
        ? 1
        : 0;

    let sql = `UPDATE plants SET name=?, category_id=?, age=?, scientific_name=?, description=?, care_instruction=?, is_featured=?`;
    const params = [
      name,
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

    // Thêm file vào Album (Gallery)
    if (req.files["gallery"] && req.files["gallery"].length > 0) {
      const mediaValues = req.files["gallery"].map((file) => [
        plantId,
        `/uploads/${file.filename}`,
        0,
      ]);
      const sqlMedia = `INSERT INTO plant_images (plant_id, image_url, is_thumbnail) VALUES ?`;
      await db.query(sqlMedia, [mediaValues]);
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

// 6. XÓA 1 ẢNH/VIDEO TRONG ALBUM (Mới)
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

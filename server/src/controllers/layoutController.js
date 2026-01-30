const db = require("../config/db");

// Lấy danh sách layout (chỉ lấy các section hiển thị, loại bỏ dòng config effect)
exports.getLayouts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM homepage_layouts WHERE type != 'global_effect' ORDER BY sort_order ASC",
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// API MỚI: Lấy danh sách cây thuộc 1 layout cụ thể
exports.getLayoutPlants = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT p.* FROM plants p 
             JOIN layout_items li ON p.id = li.plant_id 
             WHERE li.layout_id = ?`,
      [id],
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy cây của layout" });
  }
};

// --- LOGIC MỚI: XỬ LÝ HIỆU ỨNG GLOBAL ---
exports.getGlobalEffect = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT param_value FROM homepage_layouts WHERE type = 'global_effect' LIMIT 1"
    );
    // Nếu chưa có cấu hình thì trả về 'none'
    const effect = rows.length > 0 ? rows[0].param_value : 'none';
    res.json({ effect });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy hiệu ứng" });
  }
};

exports.updateGlobalEffect = async (req, res) => {
  try {
    const { effect } = req.body;
    
    // Kiểm tra xem đã có dòng cấu hình chưa
    const [check] = await db.query(
      "SELECT id FROM homepage_layouts WHERE type = 'global_effect'"
    );

    if (check.length > 0) {
      // Update
      await db.query(
        "UPDATE homepage_layouts SET param_value = ? WHERE type = 'global_effect'",
        [effect]
      );
    } else {
      // Insert mới (ẩn, không active để không hiện ra list layout thường)
      await db.query(
        "INSERT INTO homepage_layouts (title, type, param_value, sort_order, is_active) VALUES (?, ?, ?, ?, ?)",
        ['Global Effect', 'global_effect', effect, -1, 0]
      );
    }

    res.json({ message: "Cập nhật hiệu ứng thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi cập nhật hiệu ứng" });
  }
};
// ----------------------------------------

// Tạo section
exports.createSection = async (req, res) => {
  try {
    const { title, type, param_value, sort_order, is_active, plant_ids } =
      req.body;

    const [result] = await db.query(
      `INSERT INTO homepage_layouts (title, type, param_value, sort_order, is_active) 
             VALUES (?, ?, ?, ?, ?)`,
      [title, type, param_value || null, sort_order || 0, is_active ? 1 : 0],
    );

    const newLayoutId = result.insertId;

    if (type === "manual" && Array.isArray(plant_ids) && plant_ids.length > 0) {
      const values = plant_ids.map((plantId) => [newLayoutId, plantId]);
      await db.query(
        "INSERT INTO layout_items (layout_id, plant_id) VALUES ?",
        [values],
      );
    }

    res.json({ message: "Thêm section thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi thêm section" });
  }
};

// Cập nhật section
exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, param_value, sort_order, is_active, plant_ids } =
      req.body;

    await db.query(
      `UPDATE homepage_layouts SET 
             title = ?, type = ?, param_value = ?, sort_order = ?, is_active = ?
             WHERE id = ?`,
      [title, type, param_value || null, sort_order, is_active ? 1 : 0, id],
    );

    if (type === "manual" && Array.isArray(plant_ids)) {
      await db.query("DELETE FROM layout_items WHERE layout_id = ?", [id]);
      if (plant_ids.length > 0) {
        const values = plant_ids.map((plantId) => [id, plantId]);
        await db.query(
          "INSERT INTO layout_items (layout_id, plant_id) VALUES ?",
          [values],
        );
      }
    }

    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi cập nhật" });
  }
};

// Xóa section
exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM homepage_layouts WHERE id = ?", [id]);
    res.json({ message: "Đã xóa section" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa" });
  }
};
const db = require("../config/db");

// Lấy danh sách layout
exports.getLayouts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM homepage_layouts WHERE type != 'global_effect' AND type != 'hero_config' ORDER BY sort_order ASC",
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

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

exports.getGlobalEffect = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT param_value FROM homepage_layouts WHERE type = 'global_effect' LIMIT 1"
    );
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
    const [check] = await db.query(
      "SELECT id FROM homepage_layouts WHERE type = 'global_effect'"
    );

    if (check.length > 0) {
      await db.query(
        "UPDATE homepage_layouts SET param_value = ? WHERE type = 'global_effect'",
        [effect]
      );
    } else {
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

// --- LOGIC HERO SECTION (Đã sửa để LƯU ẢNH VÀO DB - Base64 & AN TOÀN HƠN) ---
exports.getHeroConfig = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT param_value FROM homepage_layouts WHERE type = 'hero_config' LIMIT 1"
    );
    
    // Cấu hình mặc định
    const defaultConfig = {
      type: 'hero_config',
      titlePrefix: '',
      titleHighlight: '',
      titleSuffix: '',
      description: '',
      imageUrl: ''
    };

    if (rows.length > 0 && rows[0].param_value) {
      try {
        // [QUAN TRỌNG] Thử parse JSON, nếu lỗi (do chuỗi bị cắt cụt) thì dùng mặc định
        const config = JSON.parse(rows[0].param_value);
        res.json({ ...config, type: 'hero_config' });
      } catch (parseError) {
        console.error("Lỗi JSON Parse Hero Config (Có thể do DB field quá nhỏ):", parseError);
        // Trả về mặc định để không crash frontend
        res.json(defaultConfig);
      }
    } else {
      res.json(defaultConfig);
    }
  } catch (error) {
    console.error("Lỗi lấy cấu hình Hero:", error);
    res.status(500).json({ message: "Lỗi lấy cấu hình Hero" });
  }
};

exports.updateHeroConfig = async (req, res) => {
  try {
    // req.body chứa các trường text
    // req.file chứa Buffer dữ liệu ảnh (do dùng memoryStorage)
    
    // 1. Lấy config cũ ra trước
    let currentConfig = {};
    try {
      const [rows] = await db.query(
        "SELECT param_value FROM homepage_layouts WHERE type = 'hero_config' LIMIT 1"
      );
      if (rows.length > 0 && rows[0].param_value) {
        currentConfig = JSON.parse(rows[0].param_value);
      }
    } catch (e) {
      console.log("Không đọc được config cũ, sẽ tạo mới hoàn toàn.");
    }

    // 2. Chuẩn bị object config mới
    const newConfig = {
      titlePrefix: req.body.titlePrefix || "",
      titleHighlight: req.body.titleHighlight || "",
      titleSuffix: req.body.titleSuffix || "",
      description: req.body.description || "",
      // Mặc định lấy ảnh cũ
      imageUrl: currentConfig.imageUrl || "" 
    };

    // 3. Xử lý lưu ảnh vào DB (Dạng Base64)
    if (req.file) {
      // Chuyển Buffer thành Base64 string
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const mimeType = req.file.mimetype; // ví dụ: image/jpeg
      
      // Tạo chuỗi Data URI
      newConfig.imageUrl = `data:${mimeType};base64,${b64}`;
    }

    const configString = JSON.stringify(newConfig);

    // 4. Lưu vào Database
    const [check] = await db.query(
      "SELECT id FROM homepage_layouts WHERE type = 'hero_config'"
    );

    if (check.length > 0) {
      await db.query(
        "UPDATE homepage_layouts SET param_value = ? WHERE type = 'hero_config'",
        [configString]
      );
    } else {
      await db.query(
        "INSERT INTO homepage_layouts (title, type, param_value, sort_order, is_active) VALUES (?, ?, ?, ?, ?)",
        ['Hero Config', 'hero_config', configString, -2, 0]
      );
    }

    res.json({ message: "Cập nhật Hero Section thành công", config: newConfig });
  } catch (error) {
    console.error("Lỗi update hero:", error);
    res.status(500).json({ message: "Lỗi cập nhật Hero Section" });
  }
};

// Các hàm CRUD section cũ (giữ nguyên)
exports.createSection = async (req, res) => {
  try {
    const { title, type, param_value, sort_order, is_active, plant_ids } = req.body;
    const [result] = await db.query(
      `INSERT INTO homepage_layouts (title, type, param_value, sort_order, is_active) VALUES (?, ?, ?, ?, ?)`,
      [title, type, param_value || null, sort_order || 0, is_active ? 1 : 0],
    );
    const newLayoutId = result.insertId;
    if (type === "manual" && Array.isArray(plant_ids) && plant_ids.length > 0) {
      const values = plant_ids.map((plantId) => [newLayoutId, plantId]);
      await db.query("INSERT INTO layout_items (layout_id, plant_id) VALUES ?", [values]);
    }
    res.json({ message: "Thêm section thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi thêm section" });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, param_value, sort_order, is_active, plant_ids } = req.body;
    await db.query(
      `UPDATE homepage_layouts SET title = ?, type = ?, param_value = ?, sort_order = ?, is_active = ? WHERE id = ?`,
      [title, type, param_value || null, sort_order, is_active ? 1 : 0, id],
    );
    if (type === "manual" && Array.isArray(plant_ids)) {
      await db.query("DELETE FROM layout_items WHERE layout_id = ?", [id]);
      if (plant_ids.length > 0) {
        const values = plant_ids.map((plantId) => [id, plantId]);
        await db.query("INSERT INTO layout_items (layout_id, plant_id) VALUES ?", [values]);
      }
    }
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi cập nhật" });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM homepage_layouts WHERE id = ?", [id]);
    res.json({ message: "Đã xóa section" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa" });
  }
};
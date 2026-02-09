const db = require("../config/db");

// Lấy danh sách layout
exports.getLayouts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM homepage_layouts WHERE type NOT IN ('global_effect', 'hero_config', 'about_config') ORDER BY sort_order ASC",
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

// --- LOGIC HERO SECTION ---
exports.getHeroConfig = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT param_value FROM homepage_layouts WHERE type = 'hero_config' LIMIT 1"
    );
    
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
        const config = JSON.parse(rows[0].param_value);
        res.json({ ...config, type: 'hero_config' });
      } catch (parseError) {
        console.error("Lỗi JSON Parse Hero Config:", parseError);
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

    const newConfig = {
      titlePrefix: req.body.titlePrefix || "",
      titleHighlight: req.body.titleHighlight || "",
      titleSuffix: req.body.titleSuffix || "",
      description: req.body.description || "",
      imageUrl: currentConfig.imageUrl || "" 
    };

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const mimeType = req.file.mimetype;
      newConfig.imageUrl = `data:${mimeType};base64,${b64}`;
    }

    const configString = JSON.stringify(newConfig);
    const [check] = await db.query("SELECT id FROM homepage_layouts WHERE type = 'hero_config'");

    if (check.length > 0) {
      await db.query("UPDATE homepage_layouts SET param_value = ? WHERE type = 'hero_config'", [configString]);
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

// --- LOGIC ABOUT SECTION (MỚI) ---
exports.getAboutConfig = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT param_value FROM homepage_layouts WHERE type = 'about_config' LIMIT 1"
    );
    
    // Cấu hình mặc định (theo file code cứng cũ của bạn)
    const defaultConfig = {
      title: "Đam mê tạo nên những tác phẩm sống động",
      description1: "Cây cảnh Xuân Thục được thành lập với niềm đam mê cây cảnh từ nhiều thế hệ trong gia đình. Mỗi cây trong bộ sưu tập đều được chăm sóc tỉ mỉ, từ việc lựa chọn giống, uốn nắn dáng thế đến chăm bón hàng ngày.",
      description2: "Chúng tôi tin rằng cây cảnh không chỉ là vật trang trí mà còn là người bạn đồng hành, mang lại sự bình yên và năng lượng tích cực cho không gian sống.",
      stat1Number: "15+",
      stat1Text: "Năm kinh nghiệm",
      stat2Number: "100%",
      stat2Text: "Tâm huyết",
      image1: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
      image2: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=80",
      image3: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80"
    };

    if (rows.length > 0 && rows[0].param_value) {
      try {
        const config = JSON.parse(rows[0].param_value);
        // Merge với default để đảm bảo đủ trường nếu thiếu
        res.json({ ...defaultConfig, ...config });
      } catch (parseError) {
        res.json(defaultConfig);
      }
    } else {
      res.json(defaultConfig);
    }
  } catch (error) {
    console.error("Lỗi lấy cấu hình About:", error);
    res.status(500).json({ message: "Lỗi lấy cấu hình About" });
  }
};

exports.updateAboutConfig = async (req, res) => {
  try {
    // 1. Lấy config cũ
    let currentConfig = {};
    try {
      const [rows] = await db.query(
        "SELECT param_value FROM homepage_layouts WHERE type = 'about_config' LIMIT 1"
      );
      if (rows.length > 0 && rows[0].param_value) {
        currentConfig = JSON.parse(rows[0].param_value);
      }
    } catch (e) {}

    // 2. Tạo config mới từ body
    const newConfig = {
      title: req.body.title || "",
      description1: req.body.description1 || "",
      description2: req.body.description2 || "",
      stat1Number: req.body.stat1Number || "",
      stat1Text: req.body.stat1Text || "",
      stat2Number: req.body.stat2Number || "",
      stat2Text: req.body.stat2Text || "",
      // Giữ ảnh cũ trước
      image1: currentConfig.image1 || "",
      image2: currentConfig.image2 || "",
      image3: currentConfig.image3 || ""
    };

    // 3. Xử lý upload ảnh (nếu có)
    // req.files là object do dùng upload.fields
    if (req.files) {
      const processFile = (fieldName) => {
        if (req.files[fieldName] && req.files[fieldName][0]) {
          const file = req.files[fieldName][0];
          const b64 = Buffer.from(file.buffer).toString('base64');
          newConfig[fieldName] = `data:${file.mimetype};base64,${b64}`;
        }
      };
      processFile('image1');
      processFile('image2');
      processFile('image3');
    }

    const configString = JSON.stringify(newConfig);

    // 4. Lưu vào DB
    const [check] = await db.query("SELECT id FROM homepage_layouts WHERE type = 'about_config'");
    if (check.length > 0) {
      await db.query("UPDATE homepage_layouts SET param_value = ? WHERE type = 'about_config'", [configString]);
    } else {
      await db.query(
        "INSERT INTO homepage_layouts (title, type, param_value, sort_order, is_active) VALUES (?, ?, ?, ?, ?)",
        ['About Config', 'about_config', configString, -1, 0] // sort_order âm để ẩn khỏi list chính
      );
    }

    res.json({ message: "Cập nhật About Section thành công", config: newConfig });
  } catch (error) {
    console.error("Lỗi update about:", error);
    res.status(500).json({ message: "Lỗi cập nhật About Section" });
  }
};

// Các hàm CRUD section cũ
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
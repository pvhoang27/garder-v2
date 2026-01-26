const db = require("../config/db");

// Lấy danh sách layout
exports.getLayouts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM homepage_layouts ORDER BY sort_order ASC",
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// API MỚI: Lấy danh sách cây thuộc 1 layout cụ thể (Dùng cho Homepage hiển thị)
exports.getLayoutPlants = async (req, res) => {
  try {
    const { id } = req.params;
    // Join bảng layout_items với bảng plants để lấy thông tin cây
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

// Tạo section (Hỗ trợ lưu danh sách cây)
exports.createSection = async (req, res) => {
  try {
    const { title, type, param_value, sort_order, is_active, plant_ids } =
      req.body;

    // 1. Tạo Layout
    const [result] = await db.query(
      `INSERT INTO homepage_layouts (title, type, param_value, sort_order, is_active) 
             VALUES (?, ?, ?, ?, ?)`,
      [title, type, param_value || null, sort_order || 0, is_active ? 1 : 0],
    );

    const newLayoutId = result.insertId;

    // 2. Nếu là loại thủ công (manual) và có danh sách cây, insert vào bảng layout_items
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

// Cập nhật section (ĐÃ FIX LỖI MẤT CÂY KHI SẮP XẾP)
exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, param_value, sort_order, is_active, plant_ids } =
      req.body;

    // 1. Update thông tin chính (Luôn chạy)
    await db.query(
      `UPDATE homepage_layouts SET 
             title = ?, type = ?, param_value = ?, sort_order = ?, is_active = ?
             WHERE id = ?`,
      [title, type, param_value || null, sort_order, is_active ? 1 : 0, id],
    );

    // 2. Xử lý danh sách cây (Xóa cũ -> Thêm mới)
    // FIX QUAN TRỌNG: Chỉ chạy logic này khi plant_ids THỰC SỰ LÀ MỘT MẢNG (Array)
    // Khi ấn nút Sắp xếp, plant_ids là undefined -> Bỏ qua đoạn này -> Giữ nguyên cây cũ.
    if (type === "manual" && Array.isArray(plant_ids)) {
      
      // Xóa hết liên kết cũ
      await db.query("DELETE FROM layout_items WHERE layout_id = ?", [id]);

      // Thêm mới nếu danh sách không rỗng
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
    // Nhờ ON DELETE CASCADE ở database, nó sẽ tự xóa dữ liệu bên bảng layout_items
    await db.query("DELETE FROM homepage_layouts WHERE id = ?", [id]);
    res.json({ message: "Đã xóa section" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa" });
  }
};
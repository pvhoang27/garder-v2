const db = require("../config/db");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

// 1. Lấy danh sách
exports.getAllPlants = async (req, res) => {
  try {
    const { keyword, category_id, is_featured, sort_by, limit } = req.query;
    
    let sql = `
            SELECT p.*, c.name as category_name,
            (SELECT COUNT(*) FROM comments WHERE comments.entity_id = p.id AND comments.entity_type = 'plant') as comment_count
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

    if (sort_by === 'views') {
        sql += ` ORDER BY p.view_count DESC`;
    } else if (sort_by === 'comments') {
        sql += ` ORDER BY comment_count DESC`;
    } else {
        sql += ` ORDER BY p.created_at DESC`;
    }

    if (limit) {
        sql += ` LIMIT ${parseInt(limit)}`;
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error("Lỗi getAllPlants:", error); 
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 2. Chi tiết
exports.getPlantById = async (req, res) => {
  try {
    const plantId = req.params.id;
    await db.query("UPDATE plants SET view_count = view_count + 1 WHERE id = ?", [plantId]);

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

    const [imageRows] = await db.query(
      "SELECT * FROM plant_images WHERE plant_id = ?",
      [plantId],
    );
    plant.media = imageRows;

    const [attrRows] = await db.query(
      "SELECT * FROM plant_attributes WHERE plant_id = ?",
      [plantId],
    );
    plant.attributes = attrRows; 

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
      name, price, category_id, age, scientific_name, description, care_instruction, is_featured, attributes,
    } = req.body;

    const thumbnail = req.files["thumbnail"] ? `/uploads/${req.files["thumbnail"][0].filename}` : null;
    const featuredVal = is_featured === "true" || is_featured === "1" ? 1 : 0;
    const priceVal = price ? parseInt(price) : 0; 

    const sqlPlant = `INSERT INTO plants (name, price, category_id, age, scientific_name, description, care_instruction, thumbnail, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sqlPlant, [
      name, priceVal, category_id, age, scientific_name, description, care_instruction, thumbnail, featuredVal,
    ]);
    const newPlantId = result.insertId;

    if (attributes) {
      const parsedAttrs = JSON.parse(attributes);
      if (Array.isArray(parsedAttrs) && parsedAttrs.length > 0) {
        const attrValues = parsedAttrs.map((item) => [newPlantId, item.key, item.value]);
        await db.query(`INSERT INTO plant_attributes (plant_id, attr_key, attr_value) VALUES ?`, [attrValues]);
      }
    }

    if (req.files["gallery"] && req.files["gallery"].length > 0) {
      const mediaValues = req.files["gallery"].map((file) => [newPlantId, `/uploads/${file.filename}`, 0]);
      await db.query(`INSERT INTO plant_images (plant_id, image_url, is_thumbnail) VALUES ?`, [mediaValues]);
    }

    res.status(201).json({ message: "Thêm cây thành công!", plantId: newPlantId });
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
      name, price, category_id, age, scientific_name, description, care_instruction, is_featured, attributes,
    } = req.body;

    const featuredVal = is_featured === "true" || is_featured === "1" ? 1 : 0;
    const priceVal = price ? parseInt(price) : 0;

    let sql = `UPDATE plants SET name=?, price=?, category_id=?, age=?, scientific_name=?, description=?, care_instruction=?, is_featured=?`;
    const params = [name, priceVal, category_id, age, scientific_name, description, care_instruction, featuredVal];

    if (req.files["thumbnail"]) {
      sql += `, thumbnail=?`;
      params.push(`/uploads/${req.files["thumbnail"][0].filename}`);
    }

    sql += ` WHERE id=?`;
    params.push(plantId);

    await db.query(sql, params);

    await db.query("DELETE FROM plant_attributes WHERE plant_id = ?", [plantId]);

    if (attributes) {
      const parsedAttrs = JSON.parse(attributes);
      if (Array.isArray(parsedAttrs) && parsedAttrs.length > 0) {
        const validAttrs = parsedAttrs.filter((item) => item.key && item.value);
        if (validAttrs.length > 0) {
          const attrValues = validAttrs.map((item) => [plantId, item.key, item.value]);
          await db.query(`INSERT INTO plant_attributes (plant_id, attr_key, attr_value) VALUES ?`, [attrValues]);
        }
      }
    }

    if (req.files["gallery"] && req.files["gallery"].length > 0) {
      const mediaValues = req.files["gallery"].map((file) => [plantId, `/uploads/${file.filename}`, 0]);
      await db.query(`INSERT INTO plant_images (plant_id, image_url, is_thumbnail) VALUES ?`, [mediaValues]);
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

// 7. EXPORT PLANTS TO EXCEL
exports.exportPlants = async (req, res) => {
  try {
    const sql = `
      SELECT p.id, p.name, p.price, c.name as category_name, p.scientific_name, p.age, 
             p.description, p.care_instruction, p.is_featured, p.view_count, p.created_at
      FROM plants p 
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `;
    const [rows] = await db.query(sql);

    const dataToExport = rows.map(item => ({
      "ID": item.id,
      "Tên Cây": item.name,
      "Giá": item.price,
      "Danh Mục": item.category_name || "Chưa phân loại",
      "Tên Khoa Học": item.scientific_name,
      "Tuổi": item.age,
      "Mô tả": item.description,
      "HD Chăm sóc": item.care_instruction,
      "Nổi bật (1=Có, 0=Không)": item.is_featured,
      "Lượt xem": item.view_count,
      "Ngày tạo": item.created_at
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(dataToExport);

    const wscols = [
      { wch: 5 }, { wch: 30 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 10 },
      { wch: 50 }, { wch: 50 }, { wch: 10 }, { wch: 10 }, { wch: 20 }
    ];
    ws['!cols'] = wscols;

    xlsx.utils.book_append_sheet(wb, ws, "DanhSachCay");
    const excelBuffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

    res.setHeader("Content-Disposition", "attachment; filename=plants_export.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    
    res.send(excelBuffer);

  } catch (error) {
    console.error("Lỗi Export:", error);
    res.status(500).json({ message: "Lỗi khi xuất file Excel" });
  }
};

// ... (Các đoạn code khác giữ nguyên)

// 8. IMPORT PLANTS FROM EXCEL
exports.importPlants = async (req, res) => {
  try {
    console.log("--- BẮT ĐẦU IMPORT ---");
    if (!req.file) {
      console.log("Lỗi: Không có file được gửi lên");
      return res.status(400).json({ message: "Vui lòng upload file Excel (.xlsx)" });
    }

    console.log("File path:", req.file.path); 

    // Đọc file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
    const sheet = workbook.Sheets[sheetName];
    
    // Convert sheet sang JSON
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log("Số lượng dòng tìm thấy:", data.length);

    let successCount = 0;
    let failCount = 0;

    for (const row of data) {
      try {
        // Log dòng đang đọc để debug
        // console.log("Đọc dòng:", row);

        const name = row["Tên Cây"] || row["name"];
        const price = row["Giá"] || row["price"] || 0;
        const description = row["Mô tả"] || row["description"] || "";
        // Lưu ý: Nếu user ko nhập ID danh mục, mặc định cho = 1 (hoặc null tùy logic của bạn)
        const category_id = row["CategoryID"] || row["category_id"] || 1; 
        const scientific_name = row["Tên Khoa Học"] || row["scientific_name"] || "";
        const age = row["Tuổi"] || row["age"] || "";
        const care_instruction = row["HD Chăm sóc"] || row["care_instruction"] || "";
        const is_featured = row["Nổi bật"] || row["is_featured"] || 0;

        if (!name) { 
           console.log("-> Bỏ qua vì thiếu tên");
           failCount++; 
           continue; 
        }

        const sql = `INSERT INTO plants (name, price, category_id, scientific_name, age, description, care_instruction, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        await db.query(sql, [
          name, 
          price, 
          category_id, 
          scientific_name, 
          age, 
          description, 
          care_instruction, 
          is_featured
        ]);
        
        successCount++;
      } catch (err) {
        console.error("-> Lỗi SQL tại dòng này:", err.message);
        failCount++;
      }
    }

    // Xóa file tạm
    if (req.file.path) fs.unlinkSync(req.file.path);

    console.log(`Kết quả: Thành công ${successCount}, Lỗi ${failCount}`);
    
    res.json({ 
      message: `Import hoàn tất! Thành công: ${successCount}, Lỗi: ${failCount}`,
      successCount,
      failCount
    });

  } catch (error) {
    console.error("Lỗi FATAL server:", error);
    res.status(500).json({ message: "Lỗi server khi xử lý file" });
  }
};
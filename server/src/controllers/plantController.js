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

// 8. IMPORT PLANTS FROM EXCEL (Phiên bản Fix Lỗi Thông Báo)
exports.importPlants = async (req, res) => {
  try {
    console.log("--- BẮT ĐẦU IMPORT ---");
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng upload file Excel (.xlsx)" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; 
    const sheet = workbook.Sheets[sheetName];
    // raw: false để thư viện tự parse định dạng số/ngày nếu có thể
    const data = xlsx.utils.sheet_to_json(sheet, { raw: false }); 
    
    console.log("Số dòng tìm thấy:", data.length);

    let successCount = 0;
    let failCount = 0;
    const errorDetails = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowIndex = i + 2; // +2 vì Excel có header

      // --- 1. CHUẨN HÓA DỮ LIỆU ---
      // Lấy giá trị, nếu undefined thì gán mặc định để tránh crash
      const name = (row["Tên Cây"] || row["name"] || "").toString().trim();
      let price = row["Giá"] || row["price"] || "0";
      const description = row["Mô tả"] || row["description"] || "";
      const category_id = row["CategoryID"] || row["category_id"] || 1; 
      const scientific_name = row["Tên Khoa Học"] || row["scientific_name"] || "";
      const age = row["Tuổi"] || row["age"] || "";
      const care_instruction = row["HD Chăm sóc"] || row["care_instruction"] || "";
      let is_featured = row["Nổi bật"] || row["is_featured"] || "0";

      // --- 2. VALIDATION CƠ BẢN (Check tay trước) ---
      
      // Lỗi 1: Tên trống
      if (!name) {
         errorDetails.push(`Dòng ${rowIndex}: Tên cây đang để trống.`);
         failCount++; continue;
      }

      // Lỗi 2: Giá không phải số
      // Xóa dấu phẩy, chấm trong chuỗi giá (VD: "100,000" -> "100000")
      price = price.toString().replace(/,/g, "").replace(/\./g, "");
      if (isNaN(price) || Number(price) < 0) {
         errorDetails.push(`Dòng ${rowIndex}: Cột 'Giá' chứa giá trị không hợp lệ ("${row["Giá"] || row["price"]}"). Phải là số dương.`);
         failCount++; continue;
      }

      // Lỗi 3: Category ID không phải số
      if (isNaN(category_id)) {
         errorDetails.push(`Dòng ${rowIndex}: 'CategoryID' phải là số ID (VD: 1, 2). Giá trị hiện tại: "${category_id}"`);
         failCount++; continue;
      }

      // Chuẩn hóa Nổi bật
      let featuredVal = 0;
      const featStr = is_featured.toString().toLowerCase();
      if (featStr === "1" || featStr === "true" || featStr === "có" || featStr === "yes") featuredVal = 1;

      try {
        // --- 3. THỰC THI SQL & BẮT LỖI CSDL ---
        const sql = `INSERT INTO plants (name, price, category_id, scientific_name, age, description, care_instruction, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        await db.query(sql, [
          name, Number(price), category_id, scientific_name, age, description, care_instruction, featuredVal
        ]);
        
        successCount++;

      } catch (err) {
        // --- 4. DỊCH LỖI SQL SANG TIẾNG VIỆT ---
        console.error(`[SQL Error Line ${rowIndex}]`, err.message); // Log cho Dev

        let friendlyMsg = `Dòng ${rowIndex}: Lỗi không xác định (${err.code || 'Unknown'}).`;

        if (err.code === 'ER_DUP_ENTRY') {
            // Lỗi trùng lặp (thường là trùng tên nếu cột name có unique, hoặc trùng ID)
            friendlyMsg = `Dòng ${rowIndex}: Cây tên "${name}" đã tồn tại trong hệ thống (Trùng tên).`;
        } 
        else if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
            // Lỗi khóa ngoại (Category ID không tồn tại trong bảng categories)
            friendlyMsg = `Dòng ${rowIndex}: Mã danh mục (CategoryID: ${category_id}) không tồn tại trong hệ thống.`;
        } 
        else if (err.code === 'ER_DATA_TOO_LONG') {
            // Dữ liệu quá dài so với giới hạn cột
            friendlyMsg = `Dòng ${rowIndex}: Dữ liệu quá dài (Có thể tên, mô tả hoặc hướng dẫn quá số ký tự cho phép).`;
        } 
        else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
            // Sai kiểu dữ liệu (VD: nhập chữ vào cột số mà thoát được check ở trên)
            friendlyMsg = `Dòng ${rowIndex}: Sai định dạng dữ liệu (Kiểm tra lại cột Giá hoặc Tuổi).`;
        }
        else if (err.code === 'ER_BAD_NULL_ERROR') {
             friendlyMsg = `Dòng ${rowIndex}: Thiếu thông tin bắt buộc (Database từ chối nhận giá trị trống).`;
        }
        else {
             // Nếu không thuộc các mã trên, in message gốc nhưng rút gọn
             friendlyMsg = `Dòng ${rowIndex}: Lỗi dữ liệu - ${err.sqlMessage || err.message}`;
        }

        errorDetails.push(friendlyMsg);
        failCount++;
      }
    }

    if (req.file.path) fs.unlinkSync(req.file.path);
    
    // Trả về kết quả
    res.json({ 
      message: `Xử lý xong.`,
      successCount,
      failCount,
      errorDetails 
    });

  } catch (error) {
    console.error("Lỗi FATAL server:", error);
    res.status(500).json({ message: "Lỗi hệ thống nghiêm trọng khi đọc file Excel. Vui lòng kiểm tra lại file." });
  }
};
const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");
const upload = require("../config/upload");
const authMiddleware = require("../middleware/authMiddleware");

// Public
router.get("/", plantController.getAllPlants);
router.get("/:id", plantController.getPlantById);

// Admin Only
// thumbnail: 1 file (Ảnh đại diện)
// gallery: 20 file (Album mô tả - Ảnh hoặc Video đều được)
const cpUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "gallery", maxCount: 20 },
]);

// --- ROUTES MỚI CHO IMPORT / EXPORT ---
// Đặt trước route /:id để tránh conflict params
router.get("/data/export", authMiddleware, plantController.exportPlants);
// Sử dụng upload.single('file') cho file excel
router.post("/data/import", authMiddleware, upload.single("file"), plantController.importPlants);
// --------------------------------------

router.post("/", authMiddleware, cpUpload, plantController.createPlant);
router.put("/:id", authMiddleware, cpUpload, plantController.updatePlant);
router.delete("/:id", authMiddleware, plantController.deletePlant);

// Route xóa 1 ảnh cụ thể trong album
router.delete("/images/:id", authMiddleware, plantController.deletePlantImage);

module.exports = router;
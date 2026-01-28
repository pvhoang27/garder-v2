const express = require("express");
const router = express.Router();
const popupController = require("../controllers/popupController");
const upload = require("../config/upload");
const authMiddleware = require("../middleware/authMiddleware");

// Public: Lấy danh sách các popup đang active
router.get("/", popupController.getPublicPopups);

// Admin: Lấy tất cả (để quản lý)
router.get("/all", authMiddleware, popupController.getAllPopups);

// Admin: Thêm mới - Cho phép upload tối đa 10 file (ảnh/video)
router.post(
  "/",
  authMiddleware,
  upload.array("media", 10),
  popupController.createPopup,
);

// Admin: Cập nhật theo ID
router.put(
  "/:id",
  authMiddleware,
  upload.array("media", 10),
  popupController.updatePopup,
);

// Admin: Xóa theo ID
router.delete("/:id", authMiddleware, popupController.deletePopup);

module.exports = router;

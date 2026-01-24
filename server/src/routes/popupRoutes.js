const express = require('express');
const router = express.Router();
const popupController = require('../controllers/popupController');
const upload = require('../config/upload'); // Dùng lại cấu hình upload có sẵn
const authMiddleware = require('../middleware/authMiddleware');

// Public: Lấy thông tin popup để hiển thị trang chủ
router.get('/', popupController.getPopup);

// Admin: Cập nhật cấu hình (Cần login + upload ảnh)
router.post('/', authMiddleware, upload.single('image'), popupController.updatePopup);
// router.delete('/images/:id', authMiddleware, popupController.deletePopupImage);
module.exports = router;
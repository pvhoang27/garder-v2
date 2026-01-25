const express = require('express');
const router = express.Router();
const popupController = require('../controllers/popupController');
const upload = require('../config/upload'); 
const authMiddleware = require('../middleware/authMiddleware');

// Public: Lấy danh sách các popup đang active
router.get('/', popupController.getPublicPopups);

// Admin: Lấy tất cả (để quản lý)
router.get('/all', authMiddleware, popupController.getAllPopups);

// Admin: Thêm mới
router.post('/', authMiddleware, upload.single('image'), popupController.createPopup);

// Admin: Cập nhật theo ID
router.put('/:id', authMiddleware, upload.single('image'), popupController.updatePopup);

// Admin: Xóa theo ID
router.delete('/:id', authMiddleware, popupController.deletePopup);

module.exports = router;
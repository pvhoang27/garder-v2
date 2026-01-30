const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/upload'); // <--- Import cấu hình upload

// Public: Lấy danh sách
router.get('/', categoryController.getAllCategories);

// Private (Admin): Thêm, Sửa, Xóa
// Thêm middleware upload.single('image') vào route POST và PUT
router.post('/', authMiddleware, upload.single('image'), categoryController.createCategory);
router.put('/:id', authMiddleware, upload.single('image'), categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;
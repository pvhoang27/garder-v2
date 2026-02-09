const express = require('express');
const router = express.Router();
const layoutController = require('../controllers/layoutController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

// [QUAN TRỌNG] Cấu hình Multer lưu vào Memory (RAM) để lấy Buffer lưu vào DB
// Thay vì lưu vào đĩa cứng như trước
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB để tránh quá tải DB
});

// Route lấy cấu hình hiệu ứng (Public)
router.get('/effect', layoutController.getGlobalEffect);
// Route cập nhật hiệu ứng (Admin only)
router.post('/effect', authMiddleware, layoutController.updateGlobalEffect);

// Route cấu hình Hero Section (Banner đầu trang)
router.get('/hero', layoutController.getHeroConfig);

// Sử dụng biến 'upload' đã cấu hình memoryStorage ở trên
router.post('/hero', authMiddleware, upload.single('image'), layoutController.updateHeroConfig);

router.get('/', layoutController.getLayouts);
router.get('/:id/plants', layoutController.getLayoutPlants); 

router.post('/', authMiddleware, layoutController.createSection);
router.put('/:id', authMiddleware, layoutController.updateSection);
router.delete('/:id', authMiddleware, layoutController.deleteSection);

module.exports = router;
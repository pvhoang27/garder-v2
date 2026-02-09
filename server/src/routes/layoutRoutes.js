const express = require('express');
const router = express.Router();
const layoutController = require('../controllers/layoutController');
const authMiddleware = require('../middleware/authMiddleware');

// Route lấy cấu hình hiệu ứng (Public)
router.get('/effect', layoutController.getGlobalEffect);
// Route cập nhật hiệu ứng (Admin only)
router.post('/effect', authMiddleware, layoutController.updateGlobalEffect);

// Route cấu hình Hero Section (Banner đầu trang)
router.get('/hero', layoutController.getHeroConfig);
router.post('/hero', authMiddleware, layoutController.updateHeroConfig);

router.get('/', layoutController.getLayouts);
router.get('/:id/plants', layoutController.getLayoutPlants); 

router.post('/', authMiddleware, layoutController.createSection);
router.put('/:id', authMiddleware, layoutController.updateSection);
router.delete('/:id', authMiddleware, layoutController.deleteSection);

module.exports = router;
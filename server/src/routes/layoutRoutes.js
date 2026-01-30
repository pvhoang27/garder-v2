const express = require('express');
const router = express.Router();
const layoutController = require('../controllers/layoutController');
const authMiddleware = require('../middleware/authMiddleware');

// Route lấy cấu hình hiệu ứng (Public)
router.get('/effect', layoutController.getGlobalEffect);
// Route cập nhật hiệu ứng (Admin only)
router.post('/effect', authMiddleware, layoutController.updateGlobalEffect);

router.get('/', layoutController.getLayouts);
router.get('/:id/plants', layoutController.getLayoutPlants); 

router.post('/', authMiddleware, layoutController.createSection);
router.put('/:id', authMiddleware, layoutController.updateSection);
router.delete('/:id', authMiddleware, layoutController.deleteSection);

module.exports = router;
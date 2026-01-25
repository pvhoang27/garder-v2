const express = require('express');
const router = express.Router();
const layoutController = require('../controllers/layoutController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', layoutController.getLayouts);

// Route mới để lấy danh sách cây của layout (Public để trang chủ gọi)
router.get('/:id/plants', layoutController.getLayoutPlants); 

router.post('/', authMiddleware, layoutController.createSection);
router.put('/:id', authMiddleware, layoutController.updateSection);
router.delete('/:id', authMiddleware, layoutController.deleteSection);

module.exports = router;
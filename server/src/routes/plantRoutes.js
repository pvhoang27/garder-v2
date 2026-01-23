const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');
const upload = require('../config/upload');
const authMiddleware = require('../middleware/authMiddleware');

// Public
router.get('/', plantController.getAllPlants);
router.get('/:id', plantController.getPlantById);

// Admin Only
// Lưu ý: Đổi tên field từ 'image' thành 'images' và dùng upload.array
router.post('/', authMiddleware, upload.array('images', 10), plantController.createPlant);
router.put('/:id', authMiddleware, upload.array('images', 10), plantController.updatePlant);
router.delete('/:id', authMiddleware, plantController.deletePlant);

module.exports = router;
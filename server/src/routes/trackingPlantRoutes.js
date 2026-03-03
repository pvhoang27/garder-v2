const express = require('express');
const router = express.Router();
const trackingPlantController = require('../controllers/trackingPlantController');

// Ghi nhận thời gian xem cây (Client gọi)
router.post('/log', trackingPlantController.logPlantView);

// Lấy thống kê cho Admin
router.get('/stats', trackingPlantController.getPlantViewStats);

module.exports = router;
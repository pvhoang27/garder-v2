const express = require('express');
const router = express.Router();
const trackingHomepageController = require('../controllers/trackingHomepageController');
const authMiddleware = require('../middleware/authMiddleware');

// Route public để ghi log truy cập trang chủ
router.post('/log', trackingHomepageController.logHomepageVisit);

// Route lấy thống kê (Chỉ cần truyền authMiddleware vì file của bạn export trực tiếp 1 function)
router.get('/stats', authMiddleware, trackingHomepageController.getTrackingHomepageStats);

module.exports = router;
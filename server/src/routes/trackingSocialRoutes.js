const express = require('express');
const router = express.Router();
const trackingSocialController = require('../controllers/trackingSocialController');

// Import middleware cũ của bạn đúng chuẩn
const authMiddleware = require('../middleware/authMiddleware');

// Viết thêm một middleware nhỏ để check quyền Admin dựa trên req.user đã được authMiddleware giải mã
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Không có quyền truy cập. Yêu cầu quyền Admin.' });
    }
};

// Route public để ghi nhận click
router.post('/click', trackingSocialController.logClick);

// Route admin để lấy thống kê (dùng authMiddleware trước, sau đó đến isAdmin)
router.get('/stats', authMiddleware, isAdmin, trackingSocialController.getStats);

module.exports = router;
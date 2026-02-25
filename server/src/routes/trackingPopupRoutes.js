const express = require('express');
const router = express.Router();
const trackingPopupController = require('../controllers/trackingPopupController');
const authMiddleware = require('../middleware/authMiddleware');

const protect = authMiddleware;
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Không có quyền truy cập (Admin only)' });
    }
};

// Public route: Ghi nhận view/click
router.post('/log', trackingPopupController.logInteraction);

// Admin route: Xem thống kê
router.get('/stats', protect, admin, trackingPopupController.getStats);

module.exports = router;
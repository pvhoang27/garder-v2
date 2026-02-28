const express = require('express');
const router = express.Router();
const trackingLocationController = require('../controllers/trackingLocationController');
const authMiddleware = require('../middleware/authMiddleware');

const protect = authMiddleware;
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Không có quyền truy cập (Admin only)' });
    }
};

// Route cho Client
router.post('/visit', trackingLocationController.logLocation);
// Route cho Admin
router.get('/stats', protect, admin, trackingLocationController.getLocationStats);

module.exports = router;
const express = require('express');
const router = express.Router();
const trackingSearchController = require('../controllers/trackingSearchController');
const authMiddleware = require('../middleware/authMiddleware');

const protect = authMiddleware;
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Không có quyền truy cập (Admin only)' });
    }
};

router.post('/log', trackingSearchController.logSearch);
router.get('/stats', protect, admin, trackingSearchController.getTrackingSearchStats);

module.exports = router;
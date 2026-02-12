const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

// [SỬA LỖI] Import authMiddleware đúng cách (vì file cũ export default function)
const authMiddleware = require('../middleware/authMiddleware');

// Middleware: Đổi tên biến để dễ dùng (authMiddleware chính là hàm verify token)
const protect = authMiddleware;

// Middleware: Tự định nghĩa hàm check Admin tại đây để tránh lỗi thiếu file
const admin = (req, res, next) => {
    // Kiểm tra xem user có tồn tại và có role là admin không
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Không có quyền truy cập (Admin only)' });
    }
};

// Route công khai để Frontend gọi mỗi khi có người vào web
router.post('/visit', trackingController.logVisit);

// Route Admin để xem thống kê (bảo vệ bằng token và quyền admin)
router.get('/stats', protect, admin, trackingController.getTrackingStats);

module.exports = router;
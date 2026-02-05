const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token;

    // 1. Ưu tiên lấy token từ Cookie (HttpOnly)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } 
    // 2. Dự phòng: Lấy từ Header (nếu cần test bằng Postman hoặc mobile app)
    else if (req.header('Authorization')) {
        const authHeader = req.header('Authorization');
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Không có quyền truy cập (Thiếu Token)' });
    }

    try {
        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin user vào req để dùng sau này
        next(); // Cho phép đi tiếp
    } catch (error) {
        res.status(401).json({ message: 'Token hết hạn hoặc không đúng' });
    }
};
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Lấy token từ header (Authorization: Bearer <token>)
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Không có quyền truy cập (Thiếu Token)' });
    }

    // Tách chữ "Bearer" ra để lấy token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ' });
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
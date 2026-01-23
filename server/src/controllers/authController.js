const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Đăng ký tài khoản Admin (Dùng để tạo nick lần đầu)
exports.register = async (req, res) => {
    try {
        const { username, password, full_name } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Thiếu username hoặc password' });
        }

        // Kiểm tra user tồn tại chưa
        const [existing] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Username đã tồn tại' });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Lưu vào DB
        await db.query('INSERT INTO users (username, password, full_name) VALUES (?, ?, ?)', 
            [username, hashedPassword, full_name]);

        res.status(201).json({ message: 'Tạo tài khoản Admin thành công!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 2. Đăng nhập (Login)
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Tìm user trong DB
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Sai tài khoản hoặc mật khẩu' });
        }

        const user = users[0];

        // So sánh mật khẩu nhập vào với mật khẩu mã hóa trong DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Sai tài khoản hoặc mật khẩu' });
        }

        // Tạo Token (Vé thông hành)
        const token = jwt.sign(
            { id: user.id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // Token hết hạn sau 1 ngày
        );

        res.json({ 
            message: 'Đăng nhập thành công', 
            token: token,
            user: { id: user.id, full_name: user.full_name }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
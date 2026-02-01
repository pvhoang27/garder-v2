const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Đăng ký tài khoản Admin (Dùng để tạo nick quản trị)
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

        // Lưu vào DB - Mặc định là admin
        await db.query('INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)', 
            [username, hashedPassword, full_name, 'admin']);

        res.status(201).json({ message: 'Tạo tài khoản Admin thành công!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 2. Đăng ký tài khoản Khách hàng (Customer) - FIX LỖI DATABASE
exports.registerCustomer = async (req, res) => {
    try {
        const { username, password, full_name } = req.body;

        // Validation: Kiểm tra đầu vào
        if (!username || !password || !full_name) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ: Tài khoản, Mật khẩu và Họ tên' });
        }

        // Kiểm tra user tồn tại chưa
        const [existing] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Lưu vào DB - role là 'customer'
        // LƯU Ý: Nếu database cột 'role' quá ngắn (ví dụ varchar(5)) thì sẽ bị lỗi 'Data truncated'
        // Hãy chạy SQL: ALTER TABLE users MODIFY COLUMN role VARCHAR(50) DEFAULT 'customer';
        await db.query('INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)', 
            [username, hashedPassword, full_name, 'customer']);

        res.status(201).json({ message: 'Đăng ký thành công! Vui lòng đăng nhập.' });

    } catch (error) {
        console.error("Lỗi đăng ký:", error); // Log lỗi chi tiết ra terminal để debug
        res.status(500).json({ message: 'Lỗi server khi đăng ký (Xem terminal để biết chi tiết)' });
    }
};

// 3. Đăng nhập (Login)
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Tìm user trong DB
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Sai tài khoản hoặc mật khẩu' });
        }

        const user = users[0];

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Sai tài khoản hoặc mật khẩu' });
        }

        // Tạo Token (Vé thông hành) chứa cả role
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role || 'customer' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // Token hết hạn sau 1 ngày
        );

        res.json({ 
            message: 'Đăng nhập thành công', 
            token: token,
            user: { 
                id: user.id, 
                full_name: user.full_name,
                role: user.role || 'customer' 
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
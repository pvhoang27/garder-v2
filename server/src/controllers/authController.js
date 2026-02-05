const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Cấu hình gửi mail (Lấy từ .env)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
    }
});

// 1. Đăng ký Admin
exports.register = async (req, res) => {
    try {
        const { username, password, full_name } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Thiếu username hoặc password' });

        const [existing] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existing.length > 0) return res.status(400).json({ message: 'Username đã tồn tại' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query('INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)', 
            [username, hashedPassword, full_name, 'admin']);

        res.status(201).json({ message: 'Tạo tài khoản Admin thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 2. Đăng ký Khách hàng
exports.registerCustomer = async (req, res) => {
    try {
        const { username, password, full_name, email, phone } = req.body;

        if (!username || !password || !full_name || !email || !phone) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
        }

        const [existing] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            if (existing[0].username === username) return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
            if (existing[0].email === email) return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        await db.query(
            'INSERT INTO users (username, password, full_name, email, phone, role, is_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [username, hashedPassword, full_name, email, phone, 'customer', 0, verificationToken]
        );

        // --- Tự động lấy Port Server đang chạy ---
        // process.env.PORT nếu có, nếu không thì mặc định 3000
        const port = process.env.PORT || 3000; 
        const verifyUrl = `http://localhost:${port}/api/auth/verify-email?token=${verificationToken}`;

        const mailOptions = {
            from: '"Garder Shop" <no-reply@garder.com>',
            to: email,
            subject: 'Xác thực tài khoản Garder',
            html: `
                <h3>Xin chào ${full_name},</h3>
                <p>Cảm ơn bạn đã đăng ký. Vui lòng click vào link dưới để kích hoạt tài khoản:</p>
                <a href="${verifyUrl}" style="background: #2e7d32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">XÁC THỰC NGAY</a>
                <p>Link này có hiệu lực 24h.</p>
            `
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) console.error("Lỗi gửi mail:", err);
            else console.log("Email sent: " + info.response);
        });

        res.status(201).json({ message: 'Đăng ký thành công! Kiểm tra Email để kích hoạt.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 3. Xử lý xác thực
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).send("Token không hợp lệ");

        const [users] = await db.query('SELECT * FROM users WHERE verification_token = ?', [token]);
        if (users.length === 0) return res.status(400).send("<h1>Link không hợp lệ hoặc đã hết hạn</h1>");

        const user = users[0];
        await db.query('UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?', [user.id]);

        // Redirect về Client (Giữ nguyên nếu Frontend chạy port 5173)
        res.redirect('http://localhost:5173/login?verified=true'); 

    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi xác thực");
    }
};

// 4. Đăng nhập
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(400).json({ message: 'Sai tài khoản hoặc mật khẩu' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Sai tài khoản hoặc mật khẩu' });

        if (user.role === 'customer' && user.is_verified === 0) {
            return res.status(403).json({ message: 'Tài khoản chưa kích hoạt. Vui lòng kiểm tra email!' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role || 'customer' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({ 
            message: 'Đăng nhập thành công', 
            token, 
            user: { id: user.id, full_name: user.full_name, role: user.role || 'customer' } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 5. Quên mật khẩu - Gửi OTP
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Vui lòng nhập email' });

        // Kiểm tra email có tồn tại không
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            // Bảo mật: Không báo lỗi chi tiết "Email không tồn tại" để tránh dò user
            // Nhưng với project học tập/nhỏ có thể báo rõ.
            return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
        }

        // Tạo OTP ngẫu nhiên 6 số
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Thời gian hết hạn: hiện tại + 15 phút (tính bằng ms)
        const expires = Date.now() + 15 * 60 * 1000; 

        // Lưu OTP vào DB
        await db.query('UPDATE users SET reset_otp = ?, reset_otp_expires = ? WHERE email = ?', [otp, expires, email]);

        // Gửi email
        const mailOptions = {
            from: '"Garder Shop" <no-reply@garder.com>',
            to: email,
            subject: 'Mã OTP đặt lại mật khẩu',
            html: `
                <h3>Yêu cầu đặt lại mật khẩu</h3>
                <p>Mã xác thực (OTP) của bạn là: <b style="font-size: 24px; color: #d32f2f;">${otp}</b></p>
                <p>Mã này sẽ hết hạn sau 15 phút.</p>
                <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
            `
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Lỗi gửi mail:", err);
                return res.status(500).json({ message: 'Không thể gửi email. Thử lại sau.' });
            }
            console.log("OTP Email sent: " + info.response);
            res.json({ message: 'Mã OTP đã được gửi đến email của bạn.' });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 6. Đặt lại mật khẩu (Verify OTP + New Pass)
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
        }

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ message: 'Người dùng không tồn tại' });

        const user = users[0];

        // Kiểm tra OTP
        if (user.reset_otp !== otp) {
            return res.status(400).json({ message: 'Mã OTP không chính xác' });
        }

        // Kiểm tra thời gian hết hạn
        if (Date.now() > user.reset_otp_expires) {
            return res.status(400).json({ message: 'Mã OTP đã hết hạn. Vui lòng lấy mã mới.' });
        }

        // Hash mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu và xóa OTP
        await db.query(
            'UPDATE users SET password = ?, reset_otp = NULL, reset_otp_expires = NULL WHERE email = ?', 
            [hashedPassword, email]
        );

        res.json({ message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
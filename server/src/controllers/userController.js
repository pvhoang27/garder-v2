const db = require('../config/db');

// 1. Lấy danh sách tất cả User (Trừ mật khẩu)
exports.getAllUsers = async (req, res) => {
    try {
        // Chỉ Admin mới được xem
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }

        // [CẬP NHẬT] Thêm trường last_login vào câu lệnh SELECT
        const [users] = await db.query('SELECT id, username, full_name, role, created_at, last_login FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 2. Xóa User
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Chỉ Admin mới được xóa
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa' });
        }

        // Không cho phép tự xóa chính mình
        if (req.user.id == id) {
            return res.status(400).json({ message: 'Bạn không thể tự xóa tài khoản của mình' });
        }

        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'Xóa người dùng thành công' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 3. Cập nhật quyền (Role)
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body; // 'admin' hoặc 'customer'

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền' });
        }

        if (req.user.id == id) {
             return res.status(400).json({ message: 'Bạn không thể tự đổi quyền của mình' });
        }

        await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        res.json({ message: `Đã cập nhật quyền thành ${role}` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
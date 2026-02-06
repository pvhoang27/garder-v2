const db = require('../config/db');

// 1. Lấy danh sách tất cả User (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }
        const [users] = await db.query('SELECT id, username, full_name, role, created_at, last_login FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 2. Xóa User (Admin)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa' });
        }
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

// 3. Cập nhật quyền (Admin)
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
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

// [MỚI] 4. Lấy thông tin cá nhân (Profile)
exports.getProfile = async (req, res) => {
    try {
        // req.user.id có được từ authMiddleware
        const userId = req.user.id;
        
        // Lấy thông tin chi tiết (trừ password)
        const [users] = await db.query(
            'SELECT id, username, full_name, email, phone, role, created_at, last_login FROM users WHERE id = ?', 
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: 'Lỗi server khi lấy thông tin cá nhân' });
    }
};

// [MỚI] 5. Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { full_name, phone } = req.body;

        if (!full_name || !phone) {
            return res.status(400).json({ message: 'Họ tên và số điện thoại không được để trống' });
        }

        await db.query(
            'UPDATE users SET full_name = ?, phone = ? WHERE id = ?',
            [full_name, phone, userId]
        );

        res.json({ message: 'Cập nhật thông tin thành công', user: { full_name, phone } });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin' });
    }
};
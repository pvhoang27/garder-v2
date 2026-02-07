const db = require('../config/db');
const bcrypt = require('bcryptjs');

// 1. Lấy danh sách tất cả User (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }
        // [UPDATE] Lấy thêm trường is_verified để admin biết
        const [users] = await db.query('SELECT id, username, full_name, role, created_at, last_login, email, phone, is_verified FROM users ORDER BY created_at DESC');
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

// 4. Lấy thông tin cá nhân (Profile)
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const [users] = await db.query(
            'SELECT id, username, full_name, email, phone, role, created_at, last_login, is_verified FROM users WHERE id = ?', 
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

// 5. Cập nhật thông tin cá nhân
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

// 6. Lấy chi tiết user theo ID (Admin)
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }

        const [users] = await db.query(
            'SELECT id, username, full_name, email, phone, role, created_at, last_login, is_verified FROM users WHERE id = ?', 
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error("Get User Detail Error:", error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// [MỚI] 7. Import Users từ Excel
exports.importUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền' });
        }

        const usersData = req.body; 
        if (!Array.isArray(usersData) || usersData.length === 0) {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
        }

        const defaultPassword = '123456';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        
        let successCount = 0;
        let skipCount = 0;

        for (const user of usersData) {
            if (!user.username || !user.full_name) {
                skipCount++;
                continue;
            }

            const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [user.username]);
            if (existing.length > 0) {
                skipCount++;
                continue;
            }

            // [QUAN TRỌNG] Thêm is_verified = 1 vào câu lệnh INSERT
            // Giả sử bảng users có cột 'is_verified'. Nếu không có, hãy xóa nó đi.
            await db.query(
                'INSERT INTO users (username, password, full_name, email, phone, role, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    user.username, 
                    hashedPassword, 
                    user.full_name, 
                    user.email || null, 
                    user.phone || null, 
                    user.role === 'admin' ? 'admin' : 'customer',
                    1 // Mặc định verified = 1 (True)
                ]
            );
            successCount++;
        }

        res.json({ 
            message: `Import hoàn tất! Thêm mới: ${successCount}, Bỏ qua (trùng/lỗi): ${skipCount}`,
            successCount,
            skipCount
        });

    } catch (error) {
        console.error("Import Error:", error);
        res.status(500).json({ message: 'Lỗi server khi import dữ liệu' });
    }
};
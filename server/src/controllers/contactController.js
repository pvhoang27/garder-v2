const db = require('../config/db');

exports.submitContact = async (req, res) => {
    try {
        const { full_name, email, message } = req.body;
        if (!message) return res.status(400).json({ message: 'Nội dung tin nhắn là bắt buộc' });

        await db.query('INSERT INTO contacts (full_name, email, message) VALUES (?, ?, ?)', [full_name, email, message]);
        
        res.status(201).json({ message: 'Gửi tin nhắn thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
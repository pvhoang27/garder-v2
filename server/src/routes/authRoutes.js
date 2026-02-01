const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);           // Tạo admin (Giữ nguyên)
router.post('/register-customer', authController.registerCustomer); // Đăng ký khách hàng (Mới)
router.post('/login', authController.login);                 // Đăng nhập

module.exports = router;
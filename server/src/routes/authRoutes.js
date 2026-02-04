const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);            // Đăng ký Admin
router.post('/register-customer', authController.registerCustomer); // Đăng ký Khách (Mới)
router.post('/login', authController.login);                  // Đăng nhập
router.get('/verify-email', authController.verifyEmail);      // Link xác thực từ email

module.exports = router;
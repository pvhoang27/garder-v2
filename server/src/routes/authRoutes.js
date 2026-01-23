const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); // Tạo admin
router.post('/login', authController.login);       // Đăng nhập

module.exports = router;
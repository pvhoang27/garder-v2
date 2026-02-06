const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// [MỚI] Các route cho trang cá nhân (Profile) - Đặt TRƯỚC các route có tham số :id
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

// Các route quản lý User (Admin)
router.get('/', authMiddleware, userController.getAllUsers);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.put('/:id/role', authMiddleware, userController.updateUserRole);

module.exports = router;
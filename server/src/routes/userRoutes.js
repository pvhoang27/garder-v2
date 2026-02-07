const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Các route cho trang cá nhân (Profile)
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

// Các route quản lý User (Admin)
router.get('/', authMiddleware, userController.getAllUsers);

// [MỚI] Route Import Users (Đặt trước /:id để tránh conflict)
router.post('/import', authMiddleware, userController.importUsers);

router.get('/:id', authMiddleware, userController.getUserById);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.put('/:id/role', authMiddleware, userController.updateUserRole);

module.exports = router;
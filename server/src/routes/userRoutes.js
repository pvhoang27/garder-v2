const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Tất cả các route này đều cần đăng nhập (authMiddleware)
router.get('/', authMiddleware, userController.getAllUsers);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.put('/:id/role', authMiddleware, userController.updateUserRole);

module.exports = router;
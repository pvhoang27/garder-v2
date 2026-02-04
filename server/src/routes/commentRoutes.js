const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Lấy danh sách bình luận (Public)
router.get('/', commentController.getComments);

// Thêm bình luận (Cần đăng nhập - controller đã check)
router.post('/', commentController.addComment);

// --- THÊM DÒNG NÀY: Route cho Admin lấy tất cả bình luận ---
router.get('/admin-all', commentController.getAllCommentsForAdmin);

// Xóa bình luận
router.delete('/:id', commentController.deleteComment);

module.exports = router;
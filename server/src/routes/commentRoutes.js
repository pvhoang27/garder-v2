const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Route public
router.get('/', commentController.getComments);      // ?entity_type=...&entity_id=...
router.post('/', commentController.addComment);

// Route Admin
router.get('/admin/all', commentController.getAllCommentsForAdmin); // Lấy tất cả
router.delete('/:id', commentController.deleteComment);             // Xóa theo ID

module.exports = router;
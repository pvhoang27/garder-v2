const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const upload = require('../config/upload'); // Sử dụng lại config upload có sẵn
const authMiddleware = require('../middleware/authMiddleware'); // Bảo vệ route admin

router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.post('/', authMiddleware, upload.single('image'), newsController.createNews);
router.put('/:id', authMiddleware, upload.single('image'), newsController.updateNews);
router.delete('/:id', authMiddleware, newsController.deleteNews);

module.exports = router;
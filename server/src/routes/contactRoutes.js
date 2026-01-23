const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST /api/contacts -> Khách gửi tin nhắn
router.post('/', contactController.submitContact);

module.exports = router;
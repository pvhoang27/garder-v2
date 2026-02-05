const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// API: /api/dashboard/stats
router.get('/stats', authMiddleware, dashboardController.getDashboardStats);

module.exports = router;
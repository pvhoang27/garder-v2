const express = require('express');
const router = express.Router();
const layoutController = require('../controllers/layoutController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

// Cấu hình Multer Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// --- GLOBAL EFFECT ---
router.get('/effect', layoutController.getGlobalEffect);
router.post('/effect', authMiddleware, layoutController.updateGlobalEffect);

// --- HERO CONFIG ---
router.get('/hero', layoutController.getHeroConfig);
router.post('/hero', authMiddleware, upload.single('image'), layoutController.updateHeroConfig);

// --- ABOUT CONFIG (MỚI) ---
router.get('/about', layoutController.getAboutConfig);
// Dùng upload.fields để nhận 3 ảnh
router.post('/about', authMiddleware, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
]), layoutController.updateAboutConfig);


// --- GENERAL LAYOUTS ---
router.get('/', layoutController.getLayouts);
router.get('/:id/plants', layoutController.getLayoutPlants); 

router.post('/', authMiddleware, layoutController.createSection);
router.put('/:id', authMiddleware, layoutController.updateSection);
router.delete('/:id', authMiddleware, layoutController.deleteSection);

module.exports = router;
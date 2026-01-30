const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // <--- Bắt buộc có dòng này
const db = require('./src/config/db');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const plantRoutes = require('./src/routes/plantRoutes'); // Giữ nguyên các route khác của bạn
const layoutRoutes = require('./src/routes/layoutRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const newsRoutes = require('./src/routes/newsRoutes');
const popupRoutes = require('./src/routes/popupRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- QUAN TRỌNG: CẤU HÌNH ĐỂ HIỂN THỊ ẢNH ---
// Dòng này cho phép truy cập link http://localhost:3000/uploads/ten-anh.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/layout', layoutRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/popups', popupRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
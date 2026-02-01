const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cấu hình phục vụ file tĩnh (ảnh upload)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect DB
const db = require('./src/config/db');

// --- ROUTES ---
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
app.use('/api/plants', require('./src/routes/plantRoutes'));
app.use('/api/news', require('./src/routes/newsRoutes'));
app.use('/api/contact', require('./src/routes/contactRoutes'));

// --- SỬA DÒNG NÀY ---
// Đổi từ 'popup' thành 'popups' để khớp với Frontend
app.use('/api/popups', require('./src/routes/popupRoutes')); 
app.use('/api/layout', require('./src/routes/layoutRoutes'));

// Route quản lý User
app.use('/api/users', require('./src/routes/userRoutes')); 

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
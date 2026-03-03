require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://localhost:5173', 
        'http://caycanhxuanthuc.com', 
        'https://caycanhxuanthuc.com'
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

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
app.use('/api/popups', require('./src/routes/popupRoutes')); 
app.use('/api/layout', require('./src/routes/layoutRoutes'));
app.use('/api/users', require('./src/routes/userRoutes')); 
app.use('/api/comments', require('./src/routes/commentRoutes'));
app.use('/api/notifications', require('./src/routes/notificationRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes')); 

// Các Route Tracking
app.use('/api/tracking', require('./src/routes/trackingRoutes'));
app.use('/api/tracking-social', require('./src/routes/trackingSocialRoutes'));
app.use('/api/tracking-popup', require('./src/routes/trackingPopupRoutes'));
app.use('/api/tracking-location', require('./src/routes/trackingLocationRoutes')); 
app.use('/api/tracking-search', require('./src/routes/trackingSearchRoutes'));
app.use('/api/tracking-plant', require('./src/routes/trackingPlantRoutes')); // <--- [MỚI] THÊM ROUTE NÀY

// Port: Ưu tiên lấy từ .env, nếu không có thì mặc định là 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const plantRoutes = require('./src/routes/plantRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const authRoutes = require('./src/routes/authRoutes'); // <--- Thêm dòng này

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes); // <--- Kích hoạt route auth
app.use('/api/plants', plantRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
    res.send('Green Garden API is Ready!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
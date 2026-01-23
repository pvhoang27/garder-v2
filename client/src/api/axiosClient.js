// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Link Backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

// Cấu hình Interceptor: Tự động gắn Token vào mỗi request (nếu có đăng nhập)
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Lấy token từ bộ nhớ trình duyệt
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosClient;
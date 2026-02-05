// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Link Backend của bạn
    withCredentials: true, // [QUAN TRỌNG] Cho phép gửi cookie kèm request
    headers: {
        'Content-Type': 'application/json',
    },
});

// [ĐÃ XÓA] Interceptor gắn token từ localStorage (vì giờ token nằm trong cookie rồi)

export default axiosClient;
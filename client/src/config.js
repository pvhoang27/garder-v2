// Tự động nhận diện hostname để cấu hình API chính xác
const currentHostname = window.location.hostname;
let defaultApiUrl = 'http://localhost:3000';

if (currentHostname === '103.237.86.60') {
    // Nếu truy cập qua IP VPS, API gọi đến port 3000 của VPS
    defaultApiUrl = 'http://103.237.86.60:3000';
} else if (currentHostname.includes('caycanhxuanthuc.com')) {
    // Dự phòng sẵn cho lúc domain hoạt động trở lại
    defaultApiUrl = `http://${currentHostname}:3000`; 
}

// Trả lại 'http://localhost:3000' cho môi trường local hoặc lấy từ file .env nếu có
export const API_URL = import.meta.env.VITE_API_URL || defaultApiUrl;
export const API_BASE_URL = `${API_URL}/api`;
export const UPLOADS_URL = `${API_URL}/uploads/`;
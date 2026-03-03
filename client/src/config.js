// Tự động nhận diện hostname để cấu hình API chính xác
const currentHostname = window.location.hostname;
const isLocal =
  currentHostname === "localhost" || currentHostname === "127.0.0.1";

let defaultApiUrl;
if (isLocal) {
  // Local dev: gọi thẳng đến backend port 3000
  defaultApiUrl = "http://localhost:3000";
} else {
  // Production (VPS IP hoặc domain): dùng cùng origin
  // Nginx sẽ proxy /api và /uploads về http://localhost:3000
  // Tự động hoạt động với cả https://103.237.86.60 và https://caycanhxuanthuc.com
  defaultApiUrl = window.location.origin;
}

// Ưu tiên VITE_API_URL từ .env nếu có (override thủ công)
export const API_URL = import.meta.env.VITE_API_URL || defaultApiUrl;
export const API_BASE_URL = `${API_URL}/api`;
export const UPLOADS_URL = `${API_URL}/uploads/`;

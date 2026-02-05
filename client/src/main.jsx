import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n'; 

// Đã bỏ <StrictMode> để tránh việc useEffect chạy 2 lần (gây lỗi x2 view)
createRoot(document.getElementById('root')).render(
    <App />
)
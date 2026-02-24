CREATE TABLE IF NOT EXISTS tracking_social_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(50) NOT NULL, -- Ví dụ: 'facebook', 'tiktok'
    location VARCHAR(50) NOT NULL, -- Ví dụ: 'about', 'footer'
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
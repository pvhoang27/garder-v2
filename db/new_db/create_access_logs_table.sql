-- Tạo bảng access_logs nếu chưa có
CREATE TABLE IF NOT EXISTS access_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(45),
  user_agent TEXT,
  visit_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_visit_time (visit_time)
);

-- Kiểm tra xem bảng đã có dữ liệu chưa
SELECT COUNT(*) as total_records FROM access_logs;

-- Xem 5 bản ghi mới nhất
SELECT * FROM access_logs ORDER BY visit_time DESC LIMIT 5;

CREATE TABLE `tracking_homepage` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `device_type` ENUM('Desktop', 'Mobile', 'Unknown') DEFAULT 'Unknown',
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `visited_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



ALTER TABLE tracking_homepage ADD COLUMN duration INT DEFAULT 0;
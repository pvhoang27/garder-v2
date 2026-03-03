CREATE TABLE IF NOT EXISTS tracking_plant_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plant_id INT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    device_info VARCHAR(255),
    duration_seconds INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);
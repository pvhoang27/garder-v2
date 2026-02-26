CREATE TABLE IF NOT EXISTS popup_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    popup_id INT,
    action VARCHAR(50) DEFAULT 'view', -- 'view' (xem) hoặc 'click' (nhấn)
    ip_address VARCHAR(45),
    interaction_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (popup_id) REFERENCES popup_config(id) ON DELETE CASCADE
);


ALTER TABLE popup_interactions 
ADD COLUMN device_type VARCHAR(50) DEFAULT 'desktop' AFTER action;
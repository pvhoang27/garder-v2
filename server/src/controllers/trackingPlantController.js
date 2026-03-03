const db = require('../config/db');

const trackingPlantController = {
  // Ghi nhận thời gian xem chi tiết cây
  logPlantView: async (req, res) => {
    try {
      const { plant_id, duration_seconds } = req.body;
      const ip_address = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown IP';
      const device_info = req.headers['user-agent'] || 'Unknown Device';

      if (!plant_id || duration_seconds === undefined) {
        return res.status(400).json({ message: 'Thiếu thông tin plant_id hoặc duration_seconds' });
      }

      const query = `
        INSERT INTO tracking_plant_views (plant_id, ip_address, device_info, duration_seconds)
        VALUES (?, ?, ?, ?)
      `;
      await db.query(query, [plant_id, ip_address, device_info, duration_seconds]);

      res.status(200).json({ message: 'Ghi nhận tracking thời gian xem cây thành công' });
    } catch (error) {
      console.error('Lỗi logPlantView:', error);
      res.status(500).json({ message: 'Lỗi server khi tracking xem cây' });
    }
  },

  // Lấy thống kê cho admin
  getPlantViewStats: async (req, res) => {
    try {
      // 1. Tổng hợp theo từng cây (Bỏ đếm lượt xem, thêm Tổng thời gian)
      const summaryQuery = `
        SELECT 
            p.id as plant_id,
            p.name as plant_name,
            SUM(t.duration_seconds) as total_duration_seconds,
            AVG(t.duration_seconds) as avg_duration_seconds,
            MAX(t.duration_seconds) as max_duration_seconds
        FROM tracking_plant_views t
        JOIN plants p ON t.plant_id = p.id
        GROUP BY p.id, p.name
        ORDER BY total_duration_seconds DESC
      `;
      const [summaryStats] = await db.query(summaryQuery);

      // 2. Chi tiết log gần đây nhất (100 dòng)
      const recentQuery = `
        SELECT 
            t.id,
            p.name as plant_name,
            t.ip_address,
            t.device_info,
            t.duration_seconds,
            t.created_at
        FROM tracking_plant_views t
        JOIN plants p ON t.plant_id = p.id
        ORDER BY t.created_at DESC
        LIMIT 100
      `;
      const [recentLogs] = await db.query(recentQuery);

      res.status(200).json({
        summary: summaryStats,
        recentLogs: recentLogs
      });
    } catch (error) {
      console.error('Lỗi getPlantViewStats:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy thống kê xem cây' });
    }
  }
};

module.exports = trackingPlantController;
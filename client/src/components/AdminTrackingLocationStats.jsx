import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

// Component con để tự động dịch Tọa độ -> Địa chỉ chi tiết
const AddressCell = ({ latitude, longitude }) => {
  const [address, setAddress] = useState("Đang tải...");

  useEffect(() => {
    let isMounted = true;
    
    const fetchAddress = async () => {
      try {
        // Gọi API OpenStreetMap lấy dữ liệu dạng tiếng Việt
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=vi`);
        const data = await res.json();
        
        if (isMounted) {
          if (data && data.display_name) {
            // Lấy chuỗi địa chỉ đầy đủ (bao gồm tên địa danh, số nhà, đường, phường, quận, tỉnh)
            let detailedAddress = data.display_name;
            
            // Cắt bỏ chữ ", Việt Nam" hoặc ", Vietnam" ở cuối cùng cho bảng hiển thị gọn hơn
            detailedAddress = detailedAddress.replace(/,\s*Việt Nam$/i, '').replace(/,\s*Vietnam$/i, '');
            
            setAddress(detailedAddress);
          } else {
            setAddress("Không tìm thấy địa chỉ");
          }
        }
      } catch (error) {
        if (isMounted) setAddress("Lỗi kết nối API");
      }
    };

    // Tạo độ trễ ngẫu nhiên (0 - 2s) để tránh bị chặn IP do gọi API quá nhiều cùng lúc
    const timeoutId = setTimeout(() => {
      fetchAddress();
    }, Math.random() * 2000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [latitude, longitude]);

  return <span style={{ fontSize: "13px", color: "#333", fontWeight: "500", lineHeight: "1.5", display: "block" }}>{address}</span>;
};


const AdminTrackingLocationStats = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data } = await axiosClient.get("/tracking-location/stats");
      setLocations(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu vị trí:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm phân tích User Agent thành thông tin thiết bị, OS và trình duyệt
  const getDeviceInfo = (ua) => {
    if (!ua) return "Không xác định";
    
    let device = "Desktop";
    if (/mobile/i.test(ua)) device = "Mobile";
    if (/tablet|ipad/i.test(ua)) device = "Tablet";

    let os = "Khác";
    if (/windows/i.test(ua)) os = "Windows";
    else if (/mac/i.test(ua)) os = "MacOS";
    else if (/linux/i.test(ua)) os = "Linux";
    else if (/android/i.test(ua)) os = "Android";
    else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";

    let browser = "Khác";
    if (/edg/i.test(ua)) browser = "Edge";
    else if (/chrome|crios/i.test(ua)) browser = "Chrome";
    else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua)) browser = "Safari";
    else if (/opera|opr/i.test(ua)) browser = "Opera";

    return `${device} - ${os} (${browser})`;
  };

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Danh sách Vị trí Khách hàng</h2>
      
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
            <thead>
              <tr style={{ background: "#4caf50", color: "#fff", textAlign: "left" }}>
                <th style={{ padding: "12px", border: "1px solid #ddd", width: "5%" }}>ID</th>
                <th style={{ padding: "12px", border: "1px solid #ddd", width: "30%" }}>Địa chỉ chi tiết</th>
                <th style={{ padding: "12px", border: "1px solid #ddd", width: "15%" }}>Tọa độ (Lat, Lng)</th>
                <th style={{ padding: "12px", border: "1px solid #ddd", width: "15%" }}>Thời gian</th>
                <th style={{ padding: "12px", border: "1px solid #ddd", width: "25%" }}>Thiết bị</th>
                <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center", width: "10%" }}>Bản đồ</th>
              </tr>
            </thead>
            <tbody>
              {locations.length > 0 ? (
                locations.map((loc) => (
                  <tr key={loc.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{loc.id}</td>
                    
                    {/* Cột hiển thị Địa Chỉ Chi Tiết */}
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      <AddressCell latitude={loc.latitude} longitude={loc.longitude} />
                    </td>

                    <td style={{ padding: "12px", border: "1px solid #ddd", fontSize: "13px", color: "#666" }}>
                      {loc.latitude}, <br/> {loc.longitude}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {new Date(loc.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      <div style={{ fontWeight: "bold", color: "#333", fontSize: "14px" }}>
                        {getDeviceInfo(loc.user_agent)}
                      </div>
                      <div style={{ fontSize: "11px", color: "#888", marginTop: "4px", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={loc.user_agent}>
                        {loc.user_agent}
                      </div>
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                      <a 
                        href={`https://www.google.com/maps?q=$${loc.latitude},${loc.longitude}`}
                        target="_blank" 
                        rel="noreferrer"
                        style={{ color: "#2196f3", textDecoration: "none", fontWeight: "bold" }}
                      >
                        Map
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                    Chưa có dữ liệu vị trí nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTrackingLocationStats;
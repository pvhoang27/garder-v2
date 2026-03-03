import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const useTracking = () => {
  const location = useLocation();

  // Effect để tracking lượt truy cập
  useEffect(() => {
    const trackVisit = async () => {
      if (!location.pathname.startsWith("/admin")) {
        try {
          await axiosClient.post("/tracking/visit");
          console.log("Visit logged");
        } catch (error) {
          console.warn("Tracking skipped:", error.message);
        }
      }
    };
    trackVisit();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect yêu cầu chia sẻ vị trí mỗi 6 tháng (Gọi thẳng Native Popup của trình duyệt)
  useEffect(() => {
    if (!location.pathname.startsWith("/admin")) {
      const requestLocation = () => {
        const lastPrompt = localStorage.getItem("lastLocationPrompt");
        const now = Date.now();
        const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;

        // Nếu chưa từng hỏi HOẶC đã trôi qua hơn 6 tháng
        if (!lastPrompt || now - parseInt(lastPrompt, 10) > SIX_MONTHS_MS) {
          if ("geolocation" in navigator) {
            // Yêu cầu trình duyệt cấp quyền vị trí thực sự (sẽ hiện popup mặc định ở góc trái Chrome)
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;
                // Gọi API để gửi data xuống DB
                try {
                  await axiosClient.post("/tracking-location/visit", {
                    latitude,
                    longitude,
                  });
                } catch (error) {
                  console.error("Lỗi khi gửi vị trí:", error);
                }
                // Lưu mốc thời gian đã xử lý
                localStorage.setItem(
                  "lastLocationPrompt",
                  Date.now().toString(),
                );
              },
              (error) => {
                console.warn(
                  "Khách hàng từ chối trên trình duyệt hoặc lỗi:",
                  error.message,
                );
                // Dù từ chối cũng lưu lại để 6 tháng sau mới làm phiền lại
                localStorage.setItem(
                  "lastLocationPrompt",
                  Date.now().toString(),
                );
              },
            );
          } else {
            console.warn("Trình duyệt không hỗ trợ Geolocation.");
          }
        }
      };

      // Đợi trang load xong khoảng 1.5s thì mới gọi để tránh giật lag lúc mới vào trang
      setTimeout(requestLocation, 1500);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useTracking;

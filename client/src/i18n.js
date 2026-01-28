import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Từ điển dịch
const resources = {
  en: {
    translation: {
      nav: {
        brand: "Green Garden",
        home: "Home",
        categories: "Categories",
        news: "News",
        contact: "Contact",
        admin: "Admin",
        logout: "Logout",
        login: "Login",
      },
      home: {
        banner_title: "Bring nature into your home",
        banner_subtitle: "Discover our fresh green plant collection",
        search_placeholder: "Search plants or news...",
        all_categories: "All categories",
        search_results: "Search Results",
        products: "Products",
        news_related: "Related News",
        no_plants: "No matching plants found.",
        no_news: "No matching news found.",
        footer_address: "Address: Family Garden",
        footer_phone: "Phone: 0988.888.888",
        updating: "Homepage is updating...",
      },
      common: {
        success_logout: "Logged out successfully!",
      },
    },
  },
  vi: {
    translation: {
      nav: {
        brand: "Green Garden",
        home: "Trang Chủ",
        categories: "Danh Mục",
        news: "Tin Tức",
        contact: "Liên Hệ",
        admin: "Quản Trị",
        logout: "Thoát",
        login: "Đăng Nhập",
      },
      home: {
        banner_title: "Mang thiên nhiên vào nhà bạn",
        banner_subtitle: "Khám phá bộ sưu tập cây xanh tươi mát",
        search_placeholder: "Tìm cây hoặc tin tức...",
        all_categories: "Tất cả danh mục cây",
        search_results: "Kết quả tìm kiếm",
        products: "Sản phẩm",
        news_related: "Tin tức liên quan",
        no_plants: "Không tìm thấy cây nào phù hợp.",
        no_news: "Không tìm thấy tin tức nào phù hợp.",
        footer_address: "Địa chỉ: Vườn cây gia đình",
        footer_phone: "Điện thoại: 0988.888.888",
        updating: "Trang chủ đang được cập nhật",
      },
      common: {
        success_logout: "Đã đăng xuất thành công!",
      },
    },
  },
};

i18n
  .use(LanguageDetector) // Tự động phát hiện ngôn ngữ trình duyệt
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi", // Ngôn ngữ mặc định nếu không phát hiện được
    interpolation: {
      escapeValue: false, // React đã an toàn XSS nên không cần escape
    },
  });

export default i18n;
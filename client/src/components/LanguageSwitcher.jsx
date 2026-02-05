import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaCheck } from "react-icons/fa"; // Đã bỏ FaGlobe

// Định nghĩa danh sách ngôn ngữ và cờ
const LANGUAGES = [
  {
    code: "vi",
    label: "Tiếng Việt",
    flag: "https://flagcdn.com/w40/vn.png", // Link ảnh cờ VN
  },
  {
    code: "en",
    label: "English",
    flag: "https://flagcdn.com/w40/gb.png", // Link ảnh cờ Anh
  },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Lấy ngôn ngữ hiện tại
  const currentLang =
    LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false); // Đóng menu sau khi chọn
  };

  // Xử lý sự kiện click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="lang-switcher" ref={dropdownRef}>
      {/* CSS Styles nội bộ cho gọn */}
      <style>{`
        .lang-switcher {
          position: relative;
          display: inline-block;
          margin-left: 15px;
          z-index: 1000; /* Đảm bảo nổi lên trên */
        }

        .lang-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8f9fa;
          border: 1px solid #ddd;
          padding: 8px 12px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #333;
          transition: all 0.2s;
        }

        .lang-btn:hover {
          background: #e9ecef;
          border-color: #bbb;
        }

        .lang-dropdown {
          position: absolute;
          top: 120%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          width: 180px;
          overflow: hidden;
          border: 1px solid #eee;
          animation: fadeIn 0.2s ease-in-out;
        }

        .lang-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          cursor: pointer;
          transition: background 0.2s;
          color: #333;
          font-size: 0.95rem;
        }

        .lang-item:hover {
          background: #f1f3f5;
        }

        .lang-item.active {
          background: #e8f5e9; /* Màu xanh nhạt */
          color: #2e7d32;
          font-weight: 500;
        }

        /* Class chung cho cờ trong dropdown */
        .flag-icon {
          width: 20px;
          height: 15px;
          object-fit: cover;
          border-radius: 2px;
          box-shadow: 0 0 2px rgba(0,0,0,0.2);
        }

        /* Class riêng cho cờ ở nút chính (có thể chỉnh to hơn xíu nếu muốn) */
        .flag-main {
          width: 24px;
          height: 16px;
          object-fit: cover;
          border-radius: 2px;
          box-shadow: 0 0 2px rgba(0,0,0,0.2);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Nút bấm chính - Đã thay FaGlobe bằng img cờ */}
      <div
        className="lang-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Đổi ngôn ngữ / Change Language"
      >
        <img 
          src={currentLang.flag} 
          alt={currentLang.label} 
          className="flag-main" 
        />
        <span style={{ fontWeight: 500 }}>
          {currentLang.code.toUpperCase()}
        </span>
        <FaChevronDown style={{ fontSize: "0.8rem", color: "#666" }} />
      </div>

      {/* Menu thả xuống */}
      {isOpen && (
        <div className="lang-dropdown">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              className={`lang-item ${currentLang.code === lang.code ? "active" : ""}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <img src={lang.flag} alt={lang.label} className="flag-icon" />
              <span style={{ flex: 1 }}>{lang.label}</span>
              {currentLang.code === lang.code && <FaCheck size={12} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
import React, { useState } from "react";
import { FaPhoneAlt, FaTimes } from "react-icons/fa";
import { SiZalo } from "react-icons/si"; // Nếu không có icon Zalo trong thư viện hiện tại thì dùng tạm icon comment
import { FaCommentDots } from "react-icons/fa"; // Dùng icon này thay Zalo nếu chưa cài react-icons/si

const FloatingContact = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Thay số điện thoại của bạn vào đây
  const phoneNumber = "0987654321"; 
  const zaloLink = "https://zalo.me/0987654321"; 

  if (!isVisible) return null;

  return (
    <div className="floating-contact-wrapper">
      <button 
        className="close-contact-btn" 
        onClick={() => setIsVisible(false)}
        title="Tắt liên hệ"
      >
        <FaTimes />
      </button>

      {/* Nút Zalo */}
      <a 
        href={zaloLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="contact-btn zalo-btn"
      >
        <span className="contact-icon">
            {/* Dùng FaCommentDots tượng trưng cho Zalo nếu chưa cài icon set khác */}
            <FaCommentDots size={24} /> 
            {/* Hoặc dùng chữ Zalo nếu thích */}
            {/* <span style={{fontWeight: 'bold'}}>Zalo</span> */}
        </span>
        <span className="contact-tooltip">Chat Zalo</span>
      </a>

      {/* Nút Gọi điện */}
      <a 
        href={`tel:${phoneNumber}`} 
        className="contact-btn phone-btn"
      >
        <span className="contact-icon">
          <FaPhoneAlt size={20} />
        </span>
        <span className="contact-tooltip">Gọi ngay</span>
      </a>
    </div>
  );
};

export default FloatingContact;
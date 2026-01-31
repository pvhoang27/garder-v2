import React, { useState } from "react";
import { FaPhoneAlt, FaTimes } from "react-icons/fa";
import { SiZalo } from "react-icons/si"; 
import { FaCommentDots } from "react-icons/fa"; 

const FloatingContact = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Cập nhật số điện thoại chính mới (0913...)
  const phoneNumber = "0913561755"; 
  const zaloLink = "https://zalo.me/0913561755"; 

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
            <FaCommentDots size={24} /> 
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
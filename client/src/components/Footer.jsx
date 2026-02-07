import React from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTiktok,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Cột 1: Brand (Về chúng tôi) */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand-link">
              <FaLeaf className="footer-icon" size={24} />
              <span className="footer-brand-name">Green Garden</span>
            </Link>
            <p className="footer-desc">
              Bảo tàng số trưng bày bộ sưu tập cây cảnh nghệ thuật. Nơi lưu giữ
              vẻ đẹp thiên nhiên qua từng tác phẩm.
            </p>

            {/* Social Media Buttons */}
            <div className="footer-socials">
              <a
                href="https://fb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="TikTok"
              >
                <FaTiktok size={24} />
              </a>
            </div>
          </div>

          {/* Cột 2: Khám phá */}
          <div>
            <h3 className="footer-heading">Khám phá</h3>
            <ul className="footer-links-list">
              <li>
                <Link to="/categories" className="footer-link">
                  Danh mục cây
                </Link>
              </li>
              <li>
                <Link to="/news" className="footer-link">
                  Tin tức & Bài viết
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div>
            <h3 className="footer-heading">Liên hệ</h3>
            <ul className="footer-links-list">
              <li className="footer-contact-item">
                <FaPhoneAlt className="footer-icon" />
                <span>0912 947 777</span>
              </li>
              <li className="footer-contact-item">
                <FaEnvelope className="footer-icon" />
                <span>vuxuanthang2908@gmail.com</span>
              </li>
              <li className="footer-contact-item">
                <FaMapMarkerAlt className="footer-icon" />
                <span>
                  Hoa lan cây cảnh Nam Định - Km 5.5 Quốc Lộ 38 B, Đại Đề, Đại
                  An, Vụ Bản, Nam Định
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

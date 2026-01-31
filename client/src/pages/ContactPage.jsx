import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaDirections } from "react-icons/fa";
import "./ContactPage.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosClient.post("/contacts", formData);
      alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
      setFormData({ full_name: "", email: "", message: "" }); // Reset form
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Địa chỉ chính xác
  const address = "Km 5.5 Quốc Lộ 38 B, Đại Đề, Đại An, Vụ Bản, Nam Định, Việt Nam";
  
  // Tạo link embed chuẩn từ địa chỉ (fix lỗi không hiện map)
  const mapEmbedUrl = `https://www.google.com/maps4{encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  
  // Link mở tab mới
  const mapDirectLink = `https://maps.google.com/maps?q=20.3789,106.1289&...{encodeURIComponent(address)}`;

  const contactInfo = [
    {
      icon: <FaPhoneAlt size={20} />,
      label: "Điện thoại",
      value: "0913.561.755 - 0912.947.777",
      href: "tel:0913561755", 
    },
    {
      icon: <FaEnvelope size={20} />,
      label: "Email",
      value: "vuoncaycuabo@gmail.com",
      href: "mailto:vuoncaycuabo@gmail.com",
    },
    {
      icon: <FaMapMarkerAlt size={20} />,
      label: "Địa chỉ",
      value: address,
      href: mapDirectLink,
      isLink: true,
      hasDirectionBtn: true 
    },
  ];

  return (
    <div className="contact-page-container">
      {/* Header Section */}
      <section className="contact-header-section">
        <div className="container">
          <h1 className="contact-title">Liên hệ với chủ vườn</h1>
          <p className="contact-subtitle">
            Bạn có câu hỏi về cây cảnh? Muốn tham quan vườn cây vào cuối tuần? 
            Hãy liên hệ với chúng tôi, chúng tôi luôn sẵn lòng hỗ trợ.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-content-section">
        <div className="contact-grid">
          
          {/* Cột Trái: Thông tin liên hệ */}
          <div className="info-column">
            <h2>Thông tin liên hệ</h2>
            <p className="info-desc">
              Liên hệ trực tiếp với chúng tôi qua các kênh bên dưới hoặc ghé thăm vườn vào các ngày cuối tuần.
            </p>

            <div className="info-list">
              {contactInfo.map((item, index) => (
                <div key={index} className="info-card">
                  <div className="icon-wrapper">
                    {item.icon}
                  </div>
                  <div className="info-details">
                    <label>{item.label}</label>
                    {item.href ? (
                      <a 
                        href={item.href}
                        className="info-value"
                        target={item.isLink ? "_blank" : undefined}
                        rel={item.isLink ? "noopener noreferrer" : undefined}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p>{item.value}</p>
                    )}

                    {/* Nút chỉ đường */}
                    {item.hasDirectionBtn && (
                      <a 
                        href={item.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="direction-btn"
                      >
                        <FaDirections /> 
                        Chỉ đường đến đây
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bản đồ */}
            <div className="map-container">
              <iframe
                title="Google Map"
                src={mapEmbedUrl}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, width: "100%", height: "100%" }}
              ></iframe>
            </div>
          </div>

          {/* Cột Phải: Form gửi tin nhắn */}
          <div className="form-column">
            <div className="form-card">
              <h2>Gửi tin nhắn</h2>
              <p className="form-desc">
                Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong thời gian sớm nhất.
              </p>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="full_name">Họ và tên *</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    className="form-input"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Nội dung tin nhắn *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    className="form-textarea"
                    placeholder="Bạn muốn hỏi về cây gì..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  <FaPaperPlane />
                  {isSubmitting ? "Đang gửi..." : "Gửi Tin Nhắn"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactPage;
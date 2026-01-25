import { useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/contacts", formData);
      alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
      setFormData({ full_name: "", email: "", message: "" }); // Reset form
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
      console.error(error);
    }
  };

  return (
    <div className="container" style={{ marginTop: "30px" }}>
      <h1
        style={{ textAlign: "center", color: "#2e7d32", marginBottom: "30px" }}
      >
        Liên Hệ Với Chủ Vườn
      </h1>

      <div className="detail-container" style={{ alignItems: "flex-start" }}>
        {/* Cột Trái: Thông tin */}
        <div
          className="detail-left"
          style={{
            background: "#e8f5e9",
            padding: "30px",
            borderRadius: "10px",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>Thông Tin Liên Lạc</h3>

          {/* Phần Địa Chỉ & Link chỉ đường */}
          <div style={{ marginBottom: "20px" }}>
            <p
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaMapMarkerAlt color="#2e7d32" size={20} />
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#2e7d32",
                  textDecoration: "underline",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                title="Bấm để mở bản đồ lớn"
              >
                Số 1, Đường Cây Cảnh, Khu Vườn Xanh
                <span
                  style={{
                    fontSize: "0.85em",
                    color: "#d32f2f",
                    fontWeight: "normal",
                  }}
                >
                  (Xem chỉ đường <FaExternalLinkAlt size={12} />)
                </span>
              </a>
            </p>

            {/* --- BẢN ĐỒ NHỎ (IFRAME) --- */}
            <div
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                border: "2px solid #fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <iframe
                title="Small Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.292513285882!2d105.78792341540212!3d20.983916994784964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accdd8a1ad71%3A0xa2f9b16036648187!2zSOG7YyB2aeG7h2uCBDDtG5nIG5naOG7hyBCxrB1IGNow61uaCBWaeG7hW4gdGjDtG5n!5e0!3m2!1svi!2s!4v1689651234567!5m2!1svi!2s"
                width="100%"
                height="200" // Chiều cao nhỏ vừa phải
                style={{ border: 0, display: "block" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            {/* --------------------------- */}
          </div>

          <p
            style={{
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FaPhone color="#2e7d32" />
            <span>0988.888.888 (Chú Bảy)</span>
          </p>
          <p
            style={{
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FaEnvelope color="#2e7d32" />
            <span>vuoncaycuabo@gmail.com</span>
          </p>
          <hr
            style={{
              margin: "20px 0",
              border: "none",
              borderTop: "1px solid #ccc",
            }}
          />
          <p>
            Chào mừng các bạn đến tham quan vườn cây vào các ngày cuối tuần!
          </p>
        </div>

        {/* Cột Phải: Form Gửi Tin Nhắn */}
        <div className="detail-right">
          <h3>Gửi Tin Nhắn Cho Chủ Vườn</h3>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            <input
              type="text"
              name="full_name"
              placeholder="Họ và tên của bạn"
              value={formData.full_name}
              onChange={handleChange}
              required
              style={{
                padding: "12px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email để liên lạc lại"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                padding: "12px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <textarea
              name="message"
              rows="5"
              placeholder="Nội dung tin nhắn..."
              value={formData.message}
              onChange={handleChange}
              required
              style={{
                padding: "12px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontFamily: "inherit",
              }}
            ></textarea>

            <button
              type="submit"
              style={{
                padding: "12px",
                background: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Gửi Tin Nhắn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

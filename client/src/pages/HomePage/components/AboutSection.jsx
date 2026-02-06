import React from "react";
import { FaHeart, FaFacebook, FaTiktok } from "react-icons/fa";

const AboutSection = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="about-grid">
          <div className="about-images">
            <div className="about-img-1">
              <img
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80"
                alt="Garden 1"
              />
            </div>
            <div className="about-img-2">
              <img
                src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=80"
                alt="Garden 2"
              />
            </div>
            <div className="about-img-3">
              <img
                src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80"
                alt="Garden 3"
              />
            </div>
          </div>

          <div className="about-content">
            <div className="badge">
              <FaHeart /> Về chúng tôi
            </div>
            <h2 className="section-title">
              Đam mê tạo nên những tác phẩm sống động
            </h2>
            <p
              className="text-gray"
              style={{ lineHeight: 1.8, marginBottom: "20px" }}
            >
              Cây cảnh Xuân Thục được thành lập với niềm đam mê cây cảnh từ
              nhiều thế hệ trong gia đình. Mỗi cây trong bộ sưu tập đều được
              chăm sóc tỉ mỉ, từ việc lựa chọn giống, uốn nắn dáng thế đến chăm
              bón hàng ngày.
            </p>
            <p
              className="text-gray"
              style={{ lineHeight: 1.8, marginBottom: "30px" }}
            >
              Chúng tôi tin rằng cây cảnh không chỉ là vật trang trí mà còn là
              người bạn đồng hành, mang lại sự bình yên và năng lượng tích cực
              cho không gian sống.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div
                style={{
                  background: "#f7fee7",
                  padding: "20px",
                  borderRadius: "12px",
                }}
              >
                <h4
                  style={{ fontSize: "1.5rem", margin: 0, color: "#3f6212" }}
                >
                  15+
                </h4>
                <span style={{ fontSize: "0.9rem", color: "#5c6c49" }}>
                  Năm kinh nghiệm
                </span>
              </div>
              <div
                style={{
                  background: "#f7fee7",
                  padding: "20px",
                  borderRadius: "12px",
                }}
              >
                <h4
                  style={{ fontSize: "1.5rem", margin: 0, color: "#3f6212" }}
                >
                  100%
                </h4>
                <span style={{ fontSize: "0.9rem", color: "#5c6c49" }}>
                  Tâm huyết
                </span>
              </div>
            </div>

            {/* Social Media Buttons */}
            <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
              <a
                href="https://fb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  textDecoration: "none",
                }}
              >
                <FaFacebook size={20} color="#1877F2" /> Facebook
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  textDecoration: "none",
                }}
              >
                <FaTiktok size={20} color="#000000" /> TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
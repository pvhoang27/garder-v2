import React, { useState, useEffect } from "react";
import { FaHeart, FaFacebook, FaTiktok } from "react-icons/fa";
import axiosClient from "../../../api/axiosClient";

const AboutSection = () => {
  const [data, setData] = useState({
    title: "Đam mê tạo nên những tác phẩm sống động",
    description1: "Cây cảnh Xuân Thục được thành lập với niềm đam mê cây cảnh từ nhiều thế hệ trong gia đình...",
    description2: "Chúng tôi tin rằng cây cảnh không chỉ là vật trang trí...",
    stat1Number: "15+",
    stat1Text: "Năm kinh nghiệm",
    stat2Number: "100%",
    stat2Text: "Tâm huyết",
    image1: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
    image2: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=80",
    image3: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80"
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axiosClient.get('/layout/about');
        if (res.data) {
          setData(prev => ({ ...prev, ...res.data }));
        }
      } catch (error) {
        console.error("Lỗi tải About config:", error);
      }
    };
    fetchConfig();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="about-grid">
          <div className="about-images">
            <div className="about-img-1">
              <img
                src={data.image1}
                alt="Garden 1"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="about-img-2">
              <img
                src={data.image2}
                alt="Garden 2"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="about-img-3">
              <img
                src={data.image3}
                alt="Garden 3"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="about-content">
            <div className="badge">
              <FaHeart /> Về chúng tôi
            </div>
            <h2 className="section-title">
              {data.title}
            </h2>
            <p
              className="text-gray"
              style={{ lineHeight: 1.8, marginBottom: "20px" }}
            >
              {data.description1}
            </p>
            <p
              className="text-gray"
              style={{ lineHeight: 1.8, marginBottom: "30px" }}
            >
              {data.description2}
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
                  {data.stat1Number}
                </h4>
                <span style={{ fontSize: "0.9rem", color: "#5c6c49" }}>
                  {data.stat1Text}
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
                  {data.stat2Number}
                </h4>
                <span style={{ fontSize: "0.9rem", color: "#5c6c49" }}>
                  {data.stat2Text}
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
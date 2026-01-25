import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";

// Component hiển thị từng section
const DynamicSection = ({ id, title, type, paramValue }) => {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    // 1. Nếu là Manual (Thủ công) -> Gọi API lấy cây cụ thể của Layout
    if (type === "manual") {
      axiosClient
        .get(`/layout/${id}/plants`)
        .then((res) => setPlants(res.data))
        .catch((err) => console.error(err));
      return;
    }

    // 2. Nếu là Category -> Lấy tất cả rồi lọc
    if (type === "category") {
      axiosClient.get("/plants").then((res) => {
        let data = res.data;
        if (paramValue) {
          data = data.filter((p) => p.category_id == paramValue);
        }
        // Giới hạn hiển thị 8 cây cho đẹp
        setPlants(data.slice(0, 8));
      });
    }
  }, [id, type, paramValue]);

  if (plants.length === 0) return null;

  return (
    <div className="container" style={{ marginTop: "40px" }}>
      <h2
        style={{
          color: "#2e7d32",
          borderBottom: "2px solid #2e7d32",
          paddingBottom: "10px",
          display: "inline-block",
          marginBottom: "20px",
        }}
      >
        {title}
      </h2>
      <div
        className="plant-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {plants.map((plant) => (
          <div
            key={plant.id}
            className="plant-card"
            style={{
              background: "white",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "0.3s",
            }}
          >
            <Link
              to={`/plant/${plant.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={{ height: "200px", overflow: "hidden" }}>
                <img
                  src={`http://localhost:3000${plant.thumbnail}`}
                  alt={plant.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "0.3s",
                  }}
                  onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                  onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "15px" }}>
                <h4
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "1.1rem",
                    color: "#333",
                  }}
                >
                  {plant.name}
                </h4>
                <p style={{ margin: 0, color: "#d32f2f", fontWeight: "bold" }}>
                  {Number(plant.price).toLocaleString()} đ
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [layoutConfig, setLayoutConfig] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/layout")
      .then((res) => {
        const activeLayouts = res.data.filter((l) => l.is_active);
        setLayoutConfig(activeLayouts);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div
        className="banner"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Mang thiên nhiên vào nhà bạn
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            marginTop: "10px",
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          Khám phá bộ sưu tập cây xanh tươi mát
        </p>
        <Link
          to="/categories"
          style={{
            marginTop: "20px",
            background: "#4caf50",
            color: "white",
            padding: "10px 25px",
            borderRadius: "30px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Xem Ngay
        </Link>
      </div>

      <div style={{ paddingBottom: "50px" }}>
        {layoutConfig.map((section) => (
          <DynamicSection
            key={section.id}
            id={section.id}
            title={section.title}
            type={section.type}
            paramValue={section.param_value}
          />
        ))}

        {!loading && layoutConfig.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 50, color: "#888" }}>
            <h3>Trang chủ đang được cập nhật</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

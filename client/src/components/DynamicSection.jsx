import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import { FaArrowRight, FaSpa } from "react-icons/fa";

const DynamicSection = ({ id, title, type, paramValue, categories, index }) => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        if (type === "manual") {
          // [FIX] Gọi đúng API lấy cây thuộc layout này (Backend đã có getLayoutPlants)
          const res = await axiosClient.get(`/layout/${id}/plants`);
          setPlants(res.data);
        } else if (type === "category" && paramValue) {
          // Lấy cây theo danh mục
          const res = await axiosClient.get(`/plants?category_id=${paramValue}`);
          setPlants(res.data);
        } else {
           // Mặc định (fallback)
           const res = await axiosClient.get("/plants");
           setPlants(res.data);
        }
      } catch (error) {
        console.error("Error fetching dynamic section plants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [type, paramValue, id]);

  // [LEADER REQUIREMENT] Chỉ lấy tối đa 4 cây hiển thị ở trang chủ
  const displayPlants = plants.slice(0, 4);

  // Helper xử lý ảnh
  const getImageUrl = (path) => {
    if (!path)
      return "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    if (path.startsWith("http")) return path;
    return `http://localhost:3000${path}`;
  };

  // Tính màu nền xen kẽ
  // index chẵn (0, 2...) -> false (Nền trắng) -> Card màu xanh (#f7fee7)
  // index lẻ (1, 3...) -> true (Nền xanh) -> Card màu trắng (#ffffff)
  const isGrayBg = index % 2 !== 0; 

  if (displayPlants.length === 0) return null;

  // Xác định link "Xem tất cả" dựa trên loại section
  let viewAllLink = "/?show_all=true";
  if (type === 'category' && paramValue) {
      viewAllLink = `/?category_id=${paramValue}`;
  } else if (type === 'manual') {
      // [FIX] Truyền layout_id về trang chủ để lọc đúng bộ sưu tập
      viewAllLink = `/?layout_id=${id}`; 
  }

  return (
    <section className={`section ${isGrayBg ? "bg-secondary" : ""}`}>
      <div className="container">
        {/* Header */}
        <div className="section-header flex-between">
            <div>
                <div className="badge" style={{ marginBottom: "10px", background: isGrayBg ? "white" : "#ecfccb" }}>
                    <FaSpa /> Bộ sưu tập
                </div>
                <h2 className="section-title">{title}</h2>
            </div>
        </div>

        {/* Grid Plants */}
        <div className="plant-grid">
          {displayPlants.map((plant) => {
             const catName = categories.find((c) => c.id === plant.category_id)?.name || "Bonsai";
             return (
                <Link
                  key={plant.id}
                  to={`/plant/${plant.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div 
                    className="plant-item-card" 
                    // LOGIC ZIGZAG: Nền Section Xanh -> Card Trắng | Nền Section Trắng -> Card Xanh
                    style={{ background: isGrayBg ? "#ffffff" : "#f7fee7" }} 
                  >
                    <div className="plant-img-wrapper">
                      <img
                        src={getImageUrl(plant.thumbnail)}
                        alt={plant.name}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                    </div>
                    <div className="plant-content">
                      <span className="plant-category">{catName}</span>
                      <h4 className="plant-title">{plant.name}</h4>
                      <div className="plant-price">
                        {Number(plant.price).toLocaleString()} ₫
                      </div>
                    </div>
                  </div>
                </Link>
             );
          })}
        </div>

        {/* Nút Xem tất cả */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link 
                to={viewAllLink}
                className={`btn ${isGrayBg ? "btn-outline" : "btn-outline"}`}
                style={{ background: isGrayBg ? "white" : "transparent" }}
            >
                Xem tất cả <FaArrowRight />
            </Link>
        </div>

      </div>
    </section>
  );
};

export default DynamicSection;
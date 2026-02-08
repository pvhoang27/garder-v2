import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import { FaArrowRight, FaSpa } from "react-icons/fa";
// Import component PlantCard (đã chứa logic fix tên dài + tooltip + xử lý ảnh)
import PlantCard from "../pages/HomePage/components/PlantCard";

const DynamicSection = ({ id, title, type, paramValue, categories, index }) => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- GIỮ NGUYÊN LOGIC FETCH DATA ---
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        if (type === "manual") {
          const res = await axiosClient.get(`/layout/${id}/plants`);
          setPlants(res.data);
        } else if (type === "category" && paramValue) {
          const res = await axiosClient.get(`/plants?category_id=${paramValue}`);
          setPlants(res.data);
        } else {
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

  // --- GIỮ NGUYÊN LOGIC LIMIT 4 CÂY ---
  const displayPlants = plants.slice(0, 4);

  // --- GIỮ NGUYÊN LOGIC MÀU NỀN ZIGZAG ---
  // index chẵn -> Card xanh
  // index lẻ -> Card trắng
  const isGrayBg = index % 2 !== 0; 

  if (displayPlants.length === 0) return null;

  // --- GIỮ NGUYÊN LOGIC LINK VIEW ALL ---
  let viewAllLink = "/?show_all=true";
  if (type === 'category' && paramValue) {
      viewAllLink = `/?category_id=${paramValue}`;
  } else if (type === 'manual') {
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
             return (
               // --- THAY THẾ ĐOẠN HTML CŨ BẰNG COMPONENT PLANTCARD ---
               // Logic hiển thị ảnh, tên cây, giá tiền nằm hết trong PlantCard
               // Logic tooltip và cắt chữ tên dài cũng nằm trong PlantCard
               <PlantCard 
                  key={plant.id}
                  plant={plant}
                  categories={categories}
                  // Truyền style vào để giữ logic màu nền zigzag của bạn
                  cardStyle={{ background: isGrayBg ? "#ffffff" : "#f7fee7" }}
               />
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
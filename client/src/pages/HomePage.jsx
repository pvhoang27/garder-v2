import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const HomePage = () => {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchParams] = useSearchParams();
  const urlCategoryId = searchParams.get("category_id");

  const [keyword, setKeyword] = useState("");
  const [selectedCat, setSelectedCat] = useState("");

  useEffect(() => {
    fetchCategories();
    if (urlCategoryId) {
      setSelectedCat(urlCategoryId);
      fetchPlants("", urlCategoryId);
    } else {
      setSelectedCat("");
      fetchPlants();
    }
  }, [urlCategoryId]);

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPlants = async (searchKey = "", catId = "") => {
    try {
      const res = await axiosClient.get("/plants", {
        params: {
          keyword: searchKey || keyword,
          category_id: catId || selectedCat,
        },
      });
      setPlants(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPlants();
  };

  return (
    <div>
      {/* CSS nội bộ để xử lý Responsive cho thanh tìm kiếm */}
      <style>{`
                .hero-section {
                    background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80");
                    height: 450px;
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    text-align: center;
                    padding: 20px;
                }
                
                /* Mặc định giao diện PC */
                .search-form {
                    background: white;
                    padding: 8px;
                    border-radius: 50px;
                    display: flex;
                    width: 100%;
                    max-width: 700px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                    align-items: center;
                    transition: all 0.3s ease;
                }
                .search-input {
                    flex: 1;
                    border: none;
                    padding: 10px 20px;
                    outline: none;
                    font-size: 1rem;
                    background: transparent;
                }
                .search-select {
                    border: none;
                    border-left: 1px solid #eee;
                    padding: 0 15px;
                    outline: none;
                    color: #555;
                    cursor: pointer;
                    background: transparent;
                    height: 40px;
                    max-width: 150px;
                }
                .search-btn {
                    background: #2e7d32;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 1rem;
                    transition: 0.3s;
                    white-space: nowrap;
                }
                .search-btn:hover {
                    background: #1b5e20;
                }

                /* Responsive Mobile: Chuyển sang dạng dọc */
                @media (max-width: 768px) {
                    .hero-section {
                        height: auto;
                        min-height: 400px;
                    }
                    .search-form {
                        flex-direction: column; /* Xếp dọc */
                        border-radius: 15px;
                        padding: 20px;
                        gap: 15px;
                        background: rgba(255, 255, 255, 0.95);
                    }
                    .search-input {
                        width: 100%;
                        border-bottom: 1px solid #eee;
                        text-align: center;
                        padding: 10px;
                    }
                    .search-select {
                        width: 100%;
                        max-width: none;
                        border-left: none;
                        border-bottom: 1px solid #eee;
                        text-align: center;
                        padding: 10px;
                        height: auto;
                    }
                    .search-btn {
                        width: 100%;
                        border-radius: 10px;
                        padding: 12px;
                    }
                }
            `}</style>

      {/* 1. HERO BANNER */}
      <div className="hero-section">
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "15px",
            textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          Green Garden Showcase
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            maxWidth: "700px",
            marginBottom: "30px",
          }}
        >
          Không gian xanh lưu giữ vẻ đẹp thiên nhiên. Nơi chia sẻ niềm đam mê
          cây cảnh của gia đình.
        </p>

        {/* THANH TÌM KIẾM ĐÃ SỬA */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Bạn muốn tìm cây gì?..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="search-select"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button type="submit" className="search-btn">
            Tìm Kiếm
          </button>
        </form>
      </div>

      {/* 2. DANH SÁCH CÂY */}
      <div
        className="container"
        style={{ marginTop: "50px", marginBottom: "50px" }}
      >
        <h2
          style={{
            borderLeft: "6px solid #2e7d32",
            paddingLeft: "15px",
            marginBottom: "30px",
            color: "#2c3e50",
            fontSize: "1.8rem",
          }}
        >
          {urlCategoryId
            ? "Kết quả lọc theo danh mục"
            : keyword
              ? `Kết quả tìm kiếm: "${keyword}"`
              : "Cây Mới Nhất Trong Vườn"}
        </h2>

        {plants.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#777" }}>
            <h3>Không tìm thấy cây nào phù hợp 🍃</h3>
            <p>Thử tìm từ khóa khác hoặc chọn danh mục khác xem sao.</p>
            <button
              onClick={() => {
                setKeyword("");
                setSelectedCat("");
                window.location.href = "/";
              }}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                cursor: "pointer",
                background: "#eee",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Xem tất cả cây
            </button>
          </div>
        ) : (
          <div className="plant-list">
            {plants.map((plant) => (
              <div key={plant.id} className="plant-card">
                <div
                  style={{
                    position: "relative",
                    height: "250px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={
                      plant.thumbnail
                        ? `http://localhost:3000${plant.thumbnail}`
                        : "https://via.placeholder.com/300x250?text=No+Image"
                    }
                    alt={plant.name}
                    className="plant-image"
                    loading="lazy"
                  />
                  {plant.is_featured === 1 && (
                    <span
                      style={{
                        position: "absolute",
                        top: 15,
                        right: 15,
                        background: "#e74c3c",
                        color: "white",
                        padding: "5px 12px",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                      }}
                    >
                      Nổi bật
                    </span>
                  )}
                </div>
                <div className="plant-info">
                  <span className="plant-category">
                    {plant.category_name || "Chưa phân loại"}
                  </span>
                  <h3 className="plant-name" title={plant.name}>
                    {plant.name}
                  </h3>
                  <div
                    className="plant-desc"
                    dangerouslySetInnerHTML={{ __html: plant.description }}
                  ></div>

                  <Link to={`/plant/${plant.id}`} className="btn-detail">
                    Xem Chi Tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

// --- CSS STYLE NỘI BỘ CHO SEARCH BAR RESPONSIVE ---
// Bạn có thể đưa phần này vào file .css riêng nếu muốn gọn code hơn
const searchStyles = `
  .search-container {
    margin-top: 30px;
    background: white;
    padding: 10px;
    border-radius: 50px;
    display: flex;
    gap: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    width: 90%;
    max-width: 700px;
    align-items: center;
    flex-wrap: nowrap; /* Mặc định trên PC là 1 dòng */
  }

  .search-input {
    border: none;
    outline: none;
    padding: 10px 20px;
    border-radius: 30px;
    font-size: 1rem;
    flex: 1; /* Tự động chiếm khoảng trống còn lại */
    min-width: 150px;
  }

  .search-select {
    border: none;
    outline: none;
    padding: 10px;
    font-size: 1rem;
    border-left: 1px solid #ddd;
    cursor: pointer;
    color: #333;
    background: transparent;
    max-width: 200px;
  }

  .search-btn {
    background: #2e7d32;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0; /* Không cho nút bị co lại */
  }

  /* --- MOBILE RESPONSIVE --- */
  @media (max-width: 768px) {
    .search-container {
      flex-direction: column; /* Chuyển thành cột dọc */
      border-radius: 20px;    /* Bo góc ít hơn cho dạng khối */
      padding: 20px;
    }
    
    .search-input {
      width: 100%;
      border-bottom: 1px solid #eee;
      border-radius: 0;
      padding: 10px 0;
      text-align: center;
    }

    .search-select {
      width: 100%;
      border-left: none;
      border-bottom: 1px solid #eee;
      text-align: center;
      max-width: none;
      margin-bottom: 10px;
    }

    .search-btn {
      width: 100%; /* Nút bấm to full chiều ngang cho dễ bấm */
      border-radius: 10px;
    }
  }
`;

// Component hiển thị từng section (Giữ nguyên)
const DynamicSection = ({ id, title, type, paramValue }) => {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    if (type === "manual") {
      axiosClient
        .get(`/layout/${id}/plants`)
        .then((res) => setPlants(res.data))
        .catch((err) => console.error(err));
      return;
    }

    if (type === "category") {
      axiosClient.get("/plants").then((res) => {
        let data = res.data;
        if (paramValue) {
          data = data.filter((p) => p.category_id == paramValue);
        }
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

  // --- STATE CHO TÌM KIẾM VÀ LỌC ---
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [allPlants, setAllPlants] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category_id") || "",
  );

  useEffect(() => {
    // 1. Lấy Layout
    axiosClient
      .get("/layout")
      .then((res) => {
        const activeLayouts = res.data.filter((l) => l.is_active);
        setLayoutConfig(activeLayouts);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // 2. Lấy Danh mục
    axiosClient.get("/categories").then((res) => setCategories(res.data));

    // 3. Lấy tất cả cây để phục vụ tìm kiếm
    axiosClient.get("/plants").then((res) => setAllPlants(res.data));
  }, []);

  useEffect(() => {
    const catId = searchParams.get("category_id");
    if (catId) {
      setSelectedCategory(catId);
    }
  }, [searchParams]);

  const filteredPlants = allPlants.filter((plant) => {
    const matchesKeyword = plant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? plant.category_id == selectedCategory
      : true;
    return matchesKeyword && matchesCategory;
  });

  const isFiltering = searchTerm !== "" || selectedCategory !== "";

  return (
    <div>
      {/* Inject Style */}
      <style>{searchStyles}</style>

      <div
        className="banner"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight:
            "400px" /* minHeight để không bị cắt khi nội dung dài ra trên mobile */,
          padding: "20px",
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
            fontSize: "calc(2rem + 1vw)" /* Font size linh hoạt */,
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            margin: "0 10px",
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

        {/* --- SECTION TÌM KIẾM ĐÃ ĐƯỢC RESPONSIVE --- */}
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Tìm tên cây..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="search-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              if (e.target.value)
                setSearchParams({ category_id: e.target.value });
              else setSearchParams({});
            }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button className="search-btn">
            <FaSearch />
          </button>
        </div>
      </div>

      <div style={{ paddingBottom: "50px" }}>
        {isFiltering ? (
          <div className="container" style={{ marginTop: "40px" }}>
            <h2
              style={{
                color: "#2e7d32",
                borderBottom: "2px solid #2e7d32",
                display: "inline-block",
                marginBottom: "20px",
              }}
            >
              Kết quả tìm kiếm ({filteredPlants.length})
            </h2>
            {filteredPlants.length === 0 ? (
              <p>Không tìm thấy cây nào phù hợp.</p>
            ) : (
              <div
                className="plant-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "20px",
                }}
              >
                {filteredPlants.map((plant) => (
                  <div
                    key={plant.id}
                    className="plant-card"
                    style={{
                      background: "white",
                      borderRadius: "10px",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                          }}
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
                        <p
                          style={{
                            margin: 0,
                            color: "#d32f2f",
                            fontWeight: "bold",
                          }}
                        >
                          {Number(plant.price).toLocaleString()} đ
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
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
              <div
                style={{ textAlign: "center", marginTop: 50, color: "#888" }}
              >
                <h3>Trang chủ đang được cập nhật</h3>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;

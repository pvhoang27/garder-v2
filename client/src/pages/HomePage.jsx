import { useState, useEffect, useRef } from "react";
import axiosClient from "../api/axiosClient";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch, FaNewspaper, FaLeaf } from "react-icons/fa";
// --- 1. Import component Fireworks ---
import { Fireworks } from "@fireworks-js/react";

// --- DỮ LIỆU TIN TỨC GIẢ LẬP ---
const FAKE_NEWS_DATA = [
  {
    id: 1,
    title: "Cách chăm sóc cây kim tiền luôn xanh tốt",
    summary:
      "Cây kim tiền là loài cây mang lại tài lộc, nhưng chăm sóc sao cho lá luôn xanh mướt thì không phải ai cũng biết.",
    image:
      "https://images.unsplash.com/photo-1612361664177-3363351d3846?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    date: "28/01/2026",
  },
  {
    id: 2,
    title: "Top 5 loại cây lọc không khí tốt nhất cho phòng ngủ",
    summary:
      "Giấc ngủ ngon hơn với không khí trong lành nhờ 5 loại cây 'nhỏ nhưng có võ' này.",
    image:
      "https://images.unsplash.com/photo-1598516091417-6499806c9a75?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    date: "25/01/2026",
  },
  {
    id: 3,
    title: "Xu hướng trồng cây ban công năm 2026",
    summary:
      "Năm 2026 đánh dấu sự lên ngôi của các dòng cây nhiệt đới và phong cách khu vườn mini (Jungle).",
    image:
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    date: "20/01/2026",
  },
  {
    id: 4,
    title: "Lợi ích bất ngờ của việc tưới cây buổi sáng",
    summary:
      "Tại sao các chuyên gia khuyên bạn nên tưới cây vào sáng sớm thay vì buổi tối?",
    image:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    date: "18/01/2026",
  },
];

// --- CSS STYLE NỘI BỘ CHO SEARCH BAR RESPONSIVE ---
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
    flex-wrap: nowrap;
    position: relative; /* Đảm bảo thanh tìm kiếm nổi lên trên pháo hoa */
    z-index: 10;
  }

  .search-input {
    border: none;
    outline: none;
    padding: 10px 20px;
    border-radius: 30px;
    font-size: 1rem;
    flex: 1;
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
    flex-shrink: 0;
  }

  /* --- MOBILE RESPONSIVE --- */
  @media (max-width: 768px) {
    .search-container {
      flex-direction: column;
      border-radius: 20px;
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
      width: 100%;
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

  // Ref cho fireworks
  const ref = useRef(null);

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

  // --- LOGIC TÌM KIẾM CÂY ---
  const filteredPlants = allPlants.filter((plant) => {
    const matchesKeyword = plant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? plant.category_id == selectedCategory
      : true;
    return matchesKeyword && matchesCategory;
  });

  // --- LOGIC TÌM KIẾM TIN TỨC ---
  const filteredNews = searchTerm
    ? FAKE_NEWS_DATA.filter((news) => {
        const keyword = searchTerm.toLowerCase();
        return (
          news.title.toLowerCase().includes(keyword) ||
          news.summary.toLowerCase().includes(keyword)
        );
      })
    : [];

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
          minHeight: "400px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          position: "relative" /* Quan trọng để chứa pháo hoa absolute */,
          overflow: "hidden",
        }}
      >
        {/* --- 2. Component Fireworks đặt ở đây --- */}
        <Fireworks
          ref={ref}
          options={{
            opacity: 0.7,
            particles: 50, // Số lượng hạt vừa phải
            explosion: 5,
            intensity: 10, // Bắn nhẹ nhàng
            traceLength: 2,
            brightness: {
              min: 50,
              max: 80,
            },
            hue: {
              min: 0,
              max: 360,
            },
            delay: {
              // Bắn chậm rãi
              min: 30,
              max: 60,
            },
            rocketsPoint: {
              // Bắn từ giữa dưới lên
              min: 50,
              max: 50,
            },
          }}
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: 1 /* Nằm trên ảnh nền, nhưng dưới chữ */,
            pointerEvents: "none" /* Để không chặn click vào thanh tìm kiếm */,
          }}
        />

        <h1
          style={{
            fontSize: "calc(2rem + 1vw)",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            margin: "0 10px",
            position: "relative",
            zIndex: 10 /* Nổi lên trên pháo hoa */,
          }}
        >
          Mang thiên nhiên vào nhà bạn
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            marginTop: "10px",
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            position: "relative",
            zIndex: 10 /* Nổi lên trên pháo hoa */,
          }}
        >
          Khám phá bộ sưu tập cây xanh tươi mát
        </p>

        {/* Section tìm kiếm (đã có z-index 10 trong style CSS nội bộ ở trên) */}
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Tìm cây hoặc tin tức..."
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
            <option value="">Tất cả danh mục cây</option>
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
            {/* ... (Phần hiển thị kết quả tìm kiếm giữ nguyên như cũ) ... */}
            <h2
              style={{
                color: "#2e7d32",
                borderBottom: "2px solid #2e7d32",
                display: "inline-block",
                marginBottom: "20px",
              }}
            >
              Kết quả tìm kiếm
            </h2>

            {/* --- KẾT QUẢ TÌM KIẾM: CÂY CẢNH --- */}
            <h3
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#333",
              }}
            >
              <FaLeaf color="#2e7d32" /> Sản phẩm ({filteredPlants.length})
            </h3>

            {filteredPlants.length === 0 ? (
              <p
                style={{
                  fontStyle: "italic",
                  color: "#666",
                  margin: "10px 0 30px 0",
                }}
              >
                Không tìm thấy cây nào phù hợp.
              </p>
            ) : (
              <div
                className="plant-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "20px",
                  marginTop: "15px",
                  marginBottom: "40px",
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

            {/* --- KẾT QUẢ TÌM KIẾM: TIN TỨC --- */}
            {searchTerm && (
              <>
                <h3
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#333",
                    borderTop: "1px solid #eee",
                    paddingTop: "20px",
                  }}
                >
                  <FaNewspaper color="#2e7d32" /> Tin tức liên quan (
                  {filteredNews.length})
                </h3>
                {filteredNews.length === 0 ? (
                  <p
                    style={{
                      fontStyle: "italic",
                      color: "#666",
                      margin: "10px 0",
                    }}
                  >
                    Không tìm thấy tin tức nào phù hợp.
                  </p>
                ) : (
                  <div
                    className="news-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                      gap: "20px",
                      marginTop: "15px",
                    }}
                  >
                    {filteredNews.map((news) => (
                      <Link
                        to="/news"
                        key={news.id}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div
                          className="news-card"
                          style={{
                            background: "white",
                            borderRadius: "10px",
                            overflow: "hidden",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                            padding: "10px",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={news.image}
                            alt={news.title}
                            style={{
                              width: "80px",
                              height: "80px",
                              borderRadius: "5px",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <h4
                              style={{ margin: "0 0 5px 0", color: "#2e7d32" }}
                            >
                              {news.title}
                            </h4>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "0.9rem",
                                color: "#666",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {news.summary}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
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

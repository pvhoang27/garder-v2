import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch, FaLeaf, FaArrowRight, FaHeart, FaSpa } from "react-icons/fa";
import { useTranslation } from "react-i18next";

// Components chức năng (Logic Admin)
import BackgroundEffect from "../components/BackgroundEffect";
import FloatingContact from "../components/FloatingContact";
import PopupBanner from "../components/PopupBanner";
import DynamicSection from "../components/DynamicSection"; // [NEW] Import DynamicSection

// Styles
import "./HomePage.css";

const HomePage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  // --- STATE DỮ LIỆU ---
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [allPlants, setAllPlants] = useState([]);
  
  // [NEW] State lưu danh sách bố cục từ Admin
  const [layouts, setLayouts] = useState([]);

  // State Admin Control
  const [globalEffect, setGlobalEffect] = useState("none");

  // State tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category_id") || "",
  );

  useEffect(() => {
    // 1. Lấy Hiệu ứng (Admin Control)
    axiosClient.get("/layout/effect").then((res) => {
      if (res.data.effect) setGlobalEffect(res.data.effect);
    });

    // 2. Lấy Danh mục
    axiosClient.get("/categories").then((res) => setCategories(res.data));

    // 3. Lấy tất cả cây
    axiosClient.get("/plants").then((res) => {
      setAllPlants(res.data);
      setLoading(false);
    });

    // 4. [NEW] Lấy danh sách bố cục Dynamic Sections
    axiosClient.get("/layout").then((res) => {
      // Sắp xếp theo sort_order trước khi lưu
      const sortedLayouts = (res.data || []).sort((a, b) => a.sort_order - b.sort_order);
      setLayouts(sortedLayouts);
    });
  }, []);

  useEffect(() => {
    const catId = searchParams.get("category_id");
    if (catId) {
      setSelectedCategory(catId);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (selectedCategory) {
      setSearchParams({ category_id: selectedCategory, q: searchTerm });
    } else if (searchTerm) {
      setSearchParams({ q: searchTerm });
    } else {
      setSearchParams({});
    }
  };

  // --- HELPER XỬ LÝ ẢNH ---
  const getImageUrl = (path) => {
    if (!path)
      return "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    if (path.startsWith("http")) return path;
    return `http://localhost:3000${path}`;
  };

  // --- LOGIC LỌC ---
  const isSearching = searchTerm !== "" || selectedCategory !== "";

  const filteredPlants = allPlants.filter((plant) => {
    const matchesKeyword = plant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? plant.category_id == selectedCategory
      : true;
    return matchesKeyword && matchesCategory;
  });

  // Lấy danh sách cây nổi bật (8 cây mới nhất)
  const featuredPlants = allPlants.slice(0, 8);

  // --- COMPONENT CARD (Dùng chung) ---
  const PlantCard = ({ plant }) => {
    const catName =
      categories.find((c) => c.id === plant.category_id)?.name || "Indoor";

    return (
      <Link
        to={`/plant/${plant.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="plant-item-card">
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
  };

  return (
    <div className="home-page-container">
      {/* 1. CÁC TÍNH NĂNG NỔI (ADMIN CONTROL) */}
      <BackgroundEffect effectType={globalEffect} />
      <PopupBanner />
      <FloatingContact />

      {/* 2. HERO SECTION (BANNER) */}
      <section className="hero-section">
        {/* Background Blobs */}
        <div className="hero-blob blob-1"></div>
        <div className="hero-blob blob-2"></div>

        <div className="container hero-grid">
          <div className="hero-content">
            <div className="badge">
              <FaLeaf /> Bảo tàng số cây cảnh
            </div>

            <h1>
              Khám phá vẻ đẹp <span className="text-primary">thiên nhiên</span>{" "}
              qua từng tác phẩm
            </h1>

            <p>
              Chào mừng đến với Green Garden - nơi lưu giữ và trưng bày bộ sưu
              tập cây cảnh nghệ thuật độc đáo. Mỗi cây là một câu chuyện, một
              tác phẩm được chăm sóc với tình yêu và sự tận tâm.
            </p>

            {/* Search Box */}
            <div className="hero-search-box">
              <input
                type="text"
                className="hero-search-input"
                placeholder={t("home.search_placeholder") || "Tìm kiếm cây..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="hero-search-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button className="hero-search-btn" onClick={handleSearch}>
                <FaSearch />
              </button>
            </div>

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <Link to="/gallery" className="btn btn-primary">
                Khám phá ngay <FaArrowRight />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Liên hệ
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <h3>50+</h3>
                <p>Cây cảnh</p>
              </div>
              <div className="stat-item">
                <h3>{categories.length}</h3>
                <p>Danh mục</p>
              </div>
              <div className="stat-item">
                <h3>10+</h3>
                <p>Năm kinh nghiệm</p>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div className="hero-image-backdrop"></div>
            <div className="hero-image-card">
              <img src="/hero-bonsai.jpg" alt="Hero Bonsai" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. NỘI DUNG CHÍNH */}
      {isSearching ? (
        /* --- GIAO DIỆN KẾT QUẢ TÌM KIẾM --- */
        <div className="container section">
          <div className="section-header">
            <h2 className="section-title">{t("home.search_results")}</h2>
            <p className="section-desc">
              Tìm thấy {filteredPlants.length} kết quả phù hợp
            </p>
          </div>

          {filteredPlants.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "50px", color: "#666" }}
            >
              <p>{t("home.no_plants")}</p>
            </div>
          ) : (
            <div className="plant-grid">
              {filteredPlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* --- GIAO DIỆN LANDING PAGE (ĐẸP) --- */
        <>
          {/* CATEGORIES SECTION */}
          <section className="section">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">Danh mục cây cảnh</h2>
                <p className="section-desc">
                  Khám phá các bộ sưu tập được phân loại theo đặc tính và ý
                  nghĩa của từng loại cây
                </p>
              </div>

              <div className="category-grid">
                {categories.map((cat, index) => (
                  <div
                    key={cat.id}
                    className="category-card"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <div className="category-overlay">
                      <h3 className="category-name">{cat.name}</h3>
                    </div>
                    {/* Placeholder ảnh cho danh mục */}
                    <img
                      src={
                        [
                          "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
                          "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&w=600&q=80",
                          "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=600&q=80",
                          "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80",
                        ][index % 4]
                      }
                      alt={cat.name}
                      className="category-img"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FEATURED PLANTS SECTION (Cây nổi bật - HARDCODED) */}
          <section className="section bg-secondary">
            <div className="container">
              <div className="section-header flex-between">
                <div>
                  <div
                    className="badge"
                    style={{ marginBottom: "10px", background: "white" }}
                  >
                    <FaSpa /> Nổi bật
                  </div>
                  <h2 className="section-title">Cây cảnh tiêu biểu</h2>
                </div>
                <Link
                  to="/gallery"
                  className="btn btn-outline"
                  style={{ background: "white" }}
                >
                  Xem tất cả <FaArrowRight />
                </Link>
              </div>

              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="plant-grid">
                  {featuredPlants.map((plant) => (
                    <PlantCard key={plant.id} plant={plant} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* [NEW] DYNAMIC SECTIONS (CÁC BỐ CỤC TỪ ADMIN) */}
          {/* Render các section được cấu hình trong admin, nằm giữa Featured và About */}
          {layouts.map((layout) => (
            layout.is_active && (
              <DynamicSection 
                key={layout.id} 
                {...layout} 
                paramValue={layout.value || layout.param_value} // Pass giá trị tham số cho DynamicSection
              />
            )
          ))}

          {/* ABOUT SECTION */}
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
                    Green Garden được thành lập với niềm đam mê cây cảnh từ
                    nhiều thế hệ trong gia đình. Mỗi cây trong bộ sưu tập đều
                    được chăm sóc tỉ mỉ, từ việc lựa chọn giống, uốn nắn dáng
                    thế đến chăm bón hàng ngày.
                  </p>
                  <p
                    className="text-gray"
                    style={{ lineHeight: 1.8, marginBottom: "30px" }}
                  >
                    Chúng tôi tin rằng cây cảnh không chỉ là vật trang trí mà
                    còn là người bạn đồng hành, mang lại sự bình yên và năng
                    lượng tích cực cho không gian sống.
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
                        style={{
                          fontSize: "1.5rem",
                          margin: 0,
                          color: "#3f6212",
                        }}
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
                        style={{
                          fontSize: "1.5rem",
                          margin: 0,
                          color: "#3f6212",
                        }}
                      >
                        100%
                      </h4>
                      <span style={{ fontSize: "0.9rem", color: "#5c6c49" }}>
                        Tâm huyết
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA SECTION */}
          <section className="cta-section">
            <div className="container">
              <h2 className="cta-title">Bạn muốn tìm hiểu thêm?</h2>
              <p className="cta-desc">
                Liên hệ với chúng tôi để được tư vấn về cây cảnh, cách chăm sóc
                hoặc đặt lịch tham quan vườn cây.
              </p>
              <Link to="/contact" className="btn btn-white">
                Liên hệ ngay <FaArrowRight />
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
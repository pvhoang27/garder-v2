import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch, FaNewspaper, FaLeaf } from "react-icons/fa";
import { useTranslation } from "react-i18next";

// Components
import BackgroundEffect from "../components/BackgroundEffect";
import DynamicSection from "../components/DynamicSection";

// Styles
import "./HomePage.css";

// --- DỮ LIỆU TIN TỨC GIẢ LẬP (Có thể tách ra file constants sau) ---
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

const HomePage = () => {
  const [layoutConfig, setLayoutConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  // --- STATE CHO TÌM KIẾM VÀ LỌC ---
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [allPlants, setAllPlants] = useState([]);
  const [globalEffect, setGlobalEffect] = useState("none");

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

    // 4. Lấy hiệu ứng nền
    axiosClient.get("/layout/effect").then((res) => {
      if (res.data.effect) setGlobalEffect(res.data.effect);
    });
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
      {/* RENDER HIỆU ỨNG GLOBAL */}
      <BackgroundEffect effectType={globalEffect} />

      <div className="home-banner">
        <h1 className="banner-title">{t("home.banner_title")}</h1>
        <p className="banner-subtitle">{t("home.banner_subtitle")}</p>

        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder={t("home.search_placeholder")}
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
            <option value="">{t("home.all_categories")}</option>
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
            <h2 className="section-heading">{t("home.search_results")}</h2>

            <h3 className="sub-heading">
              <FaLeaf color="#2e7d32" /> {t("home.products")} (
              {filteredPlants.length})
            </h3>

            {filteredPlants.length === 0 ? (
              <p
                style={{
                  fontStyle: "italic",
                  color: "#666",
                  margin: "10px 0 30px 0",
                }}
              >
                {t("home.no_plants")}
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

            {searchTerm && (
              <>
                <h3
                  className="sub-heading"
                  style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}
                >
                  <FaNewspaper color="#2e7d32" /> {t("home.news_related")} (
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
                    {t("home.no_news")}
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
                <h3>{t("home.updating")}</h3>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;

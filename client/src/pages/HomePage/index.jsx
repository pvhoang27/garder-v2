import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowRight } from "react-icons/fa";
import { UPLOADS_URL } from "../../config";

// Components chức năng chung
import BackgroundEffect from "../../components/BackgroundEffect";
import DynamicSection from "../../components/DynamicSection";

// Sub-components mới tách
import HeroSection from "./components/HeroSection";
import SearchResults from "./components/SearchResults";
import TrendingSection from "./components/TrendingSection";
import FeaturedSection from "./components/FeaturedSection";
import RecentlyViewedSection from "./components/RecentlyViewedSection";
import AboutSection from "./components/AboutSection";
import CtaSection from "./components/CtaSection";

// Styles
import "./HomePage.css";
import "./CategorySection.css";
import "./HomePage.responsive.css";

const HomePage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  // --- STATE DỮ LIỆU ---
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [allPlants, setAllPlants] = useState([]);
  const [allNews, setAllNews] = useState([]); // State mới cho tin tức

  // --- STATE CHO SECTION TRENDING (XU HƯỚNG) ---
  const [trendingPlants, setTrendingPlants] = useState([]);
  const [trendingFilter, setTrendingFilter] = useState("views"); // 'views' | 'comments'
  const [loadingTrending, setLoadingTrending] = useState(false);

  // State lưu danh sách bố cục từ Admin
  const [layouts, setLayouts] = useState([]);

  // State Admin Control
  const [globalEffect, setGlobalEffect] = useState("none");

  // --- STATE MỚI ĐỂ CHECK ZIGZAG (RECENTLY VIEWED) ---
  const [recentPlants, setRecentPlants] = useState([]);

  // State tìm kiếm & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category_id") || "",
  );

  const isShowAll = searchParams.get("show_all") === "true";
  const isFeatured = searchParams.get("is_featured") === "true";
  const layoutIdParam = searchParams.get("layout_id");

  // [MỚI] Tracking truy cập trang chủ & Thời gian ở lại
  useEffect(() => {
    let logId = null;
    const startTime = Date.now();

    axiosClient.post("/tracking-homepage/log")
      .then(res => {
        if (res.data && res.data.logId) {
          logId = res.data.logId;
        }
      })
      .catch(err => console.warn("Lỗi tracking trang chủ:", err));

    // Dùng cho việc đóng Tab / Load lại trang
    const handleBeforeUnload = () => {
      if (logId) {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const data = JSON.stringify({ logId, duration });
        const blob = new Blob([data], { type: "application/json" });
        // Lấy baseURL hiện tại
        const baseUrl = axiosClient.defaults.baseURL || "http://localhost:5000/api";
        navigator.sendBeacon(`${baseUrl}/tracking-homepage/duration`, blob);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Dùng cho việc chuyển hướng Route trong React (Navigating away)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (logId) {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        axiosClient.post("/tracking-homepage/duration", { logId, duration }).catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    // 1. Lấy Hiệu ứng
    axiosClient.get("/layout/effect").then((res) => {
      if (res.data.effect) setGlobalEffect(res.data.effect);
    });

    // 2. Lấy Danh mục
    axiosClient.get("/categories").then((res) => setCategories(res.data));

    // 3. Lấy danh sách cây (Xử lý logic bộ sưu tập)
    const fetchPlants = async () => {
      setLoading(true);
      try {
        if (layoutIdParam) {
          const res = await axiosClient.get(`/layout/${layoutIdParam}/plants`);
          setAllPlants(res.data);
        } else {
          const res = await axiosClient.get("/plants");
          setAllPlants(res.data);
        }
      } catch (error) {
        console.error("Error fetching plants", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();

    // 4. Lấy bố cục Dynamic Sections
    axiosClient.get("/layout").then((res) => {
      const sortedLayouts = (res.data || []).sort(
        (a, b) => a.sort_order - b.sort_order,
      );
      setLayouts(sortedLayouts);
    });

    // 5. [FIX ZIGZAG] Check localStorage ngay khi vào trang chủ
    const storedRecent = localStorage.getItem("recently_viewed");
    if (storedRecent) {
      setRecentPlants(JSON.parse(storedRecent));
    }

    // 7. Lấy danh sách tin tức để phục vụ tìm kiếm
    axiosClient.get("/news").then((res) => setAllNews(res.data)).catch(err => console.error("Lỗi lấy tin tức", err));
  }, [layoutIdParam]);

  // 6. Effect riêng cho phần Trending
  useEffect(() => {
    const fetchTrending = async () => {
      setLoadingTrending(true);
      try {
        const res = await axiosClient.get(
          `/plants?sort_by=${trendingFilter}&limit=4`,
        );
        setTrendingPlants(res.data);
      } catch (error) {
        console.error("Error fetching trending plants", error);
      } finally {
        setLoadingTrending(false);
      }
    };
    fetchTrending();
  }, [trendingFilter]);

  useEffect(() => {
    const catId = searchParams.get("category_id");
    if (catId) {
      setSelectedCategory(catId);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      axiosClient.post("/tracking-search/log", { keyword: searchTerm }).catch(err => console.warn("Lỗi tracking tìm kiếm:", err));
    }

    if (selectedCategory) {
      setSearchParams({ category_id: selectedCategory, q: searchTerm });
    } else if (searchTerm) {
      setSearchParams({ q: searchTerm });
    } else {
      setSearchParams({});
    }
  };

  // --- HÀM HELPER LẤY ẢNH DANH MỤC ---
  const getCategoryImageUrl = (imageName) => {
    if (!imageName) {
      return "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80";
    }
    if (imageName.startsWith("http")) return imageName;
    return `${UPLOADS_URL}${imageName}`;
  };

  const isSearching =
    searchTerm !== "" ||
    selectedCategory !== "" ||
    isShowAll ||
    !!layoutIdParam ||
    isFeatured;

  const filteredPlants = allPlants.filter((plant) => {
    const matchesKeyword = plant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory
      ? plant.category_id == selectedCategory
      : true;

    const matchesFeatured = isFeatured
      ? plant.is_featured == 1 || plant.is_featured === true
      : true;

    return matchesKeyword && matchesCategory && matchesFeatured;
  });

  const filteredNews = allNews.filter((news) => {
    if (!searchTerm) return false; 
    if (selectedCategory) return false; 

    return (
      news.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const featuredPlants = allPlants
    .filter((p) => p.is_featured == 1 || p.is_featured === true)
    .slice(0, 4);

  const getResultTitle = () => {
    if (isShowAll) return "Tất cả cây cảnh";
    if (isFeatured) return "Cây cảnh nổi bật";
    if (layoutIdParam) {
      const currentLayout = layouts.find((l) => l.id == layoutIdParam);
      return currentLayout
        ? `Bộ sưu tập: ${currentLayout.title}`
        : "Bộ sưu tập";
    }
    return t("home.search_results");
  };

  const hasRecent = recentPlants.length > 0;
  const startDynamicIndex = hasRecent ? 1 : 0;

  return (
    <div className="home-page-container">
      <BackgroundEffect effectType={globalEffect} />

      <HeroSection
        t={t}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        handleSearch={handleSearch}
      />

      {isSearching ? (
        <SearchResults
          filteredPlants={filteredPlants}
          filteredNews={filteredNews}
          loading={loading}
          t={t}
          getResultTitle={getResultTitle}
          categories={categories}
          isShowAll={isShowAll}
          layoutIdParam={layoutIdParam}
          isFeatured={isFeatured}
        />
      ) : (
        <>
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
                {categories.slice(0, 4).map((cat) => (
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
                    <img
                      src={getCategoryImageUrl(cat.image)}
                      alt={cat.name}
                      className="category-img"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                  </div>
                ))}
              </div>

              {categories.length > 4 && (
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                  <Link to="/categories" className="btn btn-outline">
                    Xem tất cả danh mục <FaArrowRight />
                  </Link>
                </div>
              )}
            </div>
          </section>

          <TrendingSection
            trendingPlants={trendingPlants}
            loadingTrending={loadingTrending}
            trendingFilter={trendingFilter}
            setTrendingFilter={setTrendingFilter}
            categories={categories}
          />

          <FeaturedSection
            loading={loading}
            featuredPlants={featuredPlants}
            categories={categories}
          />

          <RecentlyViewedSection categories={categories} data={recentPlants} />

          {layouts.map(
            (layout, index) =>
              layout.is_active && (
                <DynamicSection
                  key={layout.id}
                  {...layout}
                  paramValue={layout.value || layout.param_value}
                  categories={categories}
                  index={index + startDynamicIndex}
                />
              ),
          )}

          <AboutSection />
          <CtaSection />
        </>
      )}
    </div>
  );
};

export default HomePage;
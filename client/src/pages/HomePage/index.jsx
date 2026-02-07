import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowRight } from "react-icons/fa";

// Components chức năng chung
import BackgroundEffect from "../../components/BackgroundEffect";
import FloatingContact from "../../components/FloatingContact";
import PopupBanner from "../../components/PopupBanner";
import DynamicSection from "../../components/DynamicSection";

// Sub-components mới tách
import HeroSection from "./components/HeroSection";
import SearchResults from "./components/SearchResults";
import TrendingSection from "./components/TrendingSection";
import FeaturedSection from "./components/FeaturedSection";
import RecentlyViewedSection from "./components/RecentlyViewedSection"; // <--- IMPORT MỚI
import AboutSection from "./components/AboutSection";
import CtaSection from "./components/CtaSection";

// Styles
import "./HomePage.css";

const HomePage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  // --- STATE DỮ LIỆU ---
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [allPlants, setAllPlants] = useState([]);

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
    searchParams.get("category_id") || ""
  );

  const isShowAll = searchParams.get("show_all") === "true";
  const isFeatured = searchParams.get("is_featured") === "true";
  const layoutIdParam = searchParams.get("layout_id");

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
        (a, b) => a.sort_order - b.sort_order
      );
      setLayouts(sortedLayouts);
    });

    // 5. [FIX ZIGZAG] Check localStorage ngay khi vào trang chủ
    const storedRecent = localStorage.getItem("recently_viewed");
    if (storedRecent) {
      setRecentPlants(JSON.parse(storedRecent));
    }
  }, [layoutIdParam]);

  // 6. Effect riêng cho phần Trending
  useEffect(() => {
    const fetchTrending = async () => {
      setLoadingTrending(true);
      try {
        const res = await axiosClient.get(
          `/plants?sort_by=${trendingFilter}&limit=4`
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
      // Ảnh mặc định nếu không có ảnh
      return "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80";
    }
    if (imageName.startsWith("http")) return imageName;
    // Đường dẫn ảnh từ server (tương tự như AdminCategoryManager)
    return `http://localhost:3000/uploads/${imageName}`;
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

  // [LOGIC ZIGZAG QUAN TRỌNG]
  // Featured (luôn là Nền Xanh)
  // Nếu có Recent (Recent là Nền Trắng) -> Dynamic kế tiếp phải là Nền Xanh (Index Lẻ: 1, 3...)
  // Nếu KHÔNG có Recent -> Featured (Xanh) -> Dynamic kế tiếp phải là Nền Trắng (Index Chẵn: 0, 2...)
  const hasRecent = recentPlants.length > 0;
  const startDynamicIndex = hasRecent ? 1 : 0;

  return (
    <div className="home-page-container">
      {/* CÁC TÍNH NĂNG NỔI */}
      <BackgroundEffect effectType={globalEffect} />
      <PopupBanner />
      <FloatingContact />

      {/* HERO SECTION */}
      <HeroSection
        t={t}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        handleSearch={handleSearch}
      />

      {/* NỘI DUNG CHÍNH (ĐIỀU KIỆN RENDER) */}
      {isSearching ? (
        <SearchResults
          filteredPlants={filteredPlants}
          loading={loading}
          t={t}
          getResultTitle={getResultTitle}
          categories={categories}
          isShowAll={isShowAll}
          layoutIdParam={layoutIdParam}
          isFeatured={isFeatured}
        />
      ) : (
        /* --- GIAO DIỆN LANDING PAGE (TRANG CHỦ MẶC ĐỊNH) --- */
        <>
          {/* CATEGORIES SECTION (Trắng) */}
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
                    {/* Đã sửa lại phần src để lấy ảnh thật */}
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

          {/* TRENDING PLANTS (Trắng) */}
          <TrendingSection
            trendingPlants={trendingPlants}
            loadingTrending={loadingTrending}
            trendingFilter={trendingFilter}
            setTrendingFilter={setTrendingFilter}
            categories={categories}
          />

          {/* FEATURED PLANTS (Background XANH - Card TRẮNG) */}
          <FeaturedSection
            loading={loading}
            featuredPlants={featuredPlants}
            categories={categories}
          />

          {/* --- SECTION ĐÃ XEM GẦN ĐÂY (Background TRẮNG - Card XANH) --- */}
          {/* Truyền data vào để component hiển thị, không cần load lại từ localStorage */}
          <RecentlyViewedSection
            categories={categories}
            data={recentPlants}
          />

          {/* DYNAMIC SECTIONS */}
          {layouts.map(
            (layout, index) =>
              layout.is_active && (
                <DynamicSection
                  key={layout.id}
                  {...layout}
                  paramValue={layout.value || layout.param_value}
                  categories={categories}
                  // Điều chỉnh index bắt đầu dựa trên việc có Section Recent hay không
                  index={index + startDynamicIndex}
                />
              )
          )}

          {/* ABOUT SECTION */}
          <AboutSection />

          {/* CTA SECTION */}
          <CtaSection />
        </>
      )}
    </div>
  );
};

export default HomePage;
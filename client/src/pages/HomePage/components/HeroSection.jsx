import React from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaSearch, FaArrowRight } from "react-icons/fa";

const HeroSection = ({
  t,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  handleSearch,
}) => {
  return (
    <section className="hero-section">
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
            Chào mừng đến với Cây cảnh Xuân Thục - nơi lưu giữ và trưng bày bộ
            sưu tập cây cảnh nghệ thuật độc đáo. Mỗi cây là một câu chuyện, một
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
            <Link to="/?show_all=true" className="btn btn-primary">
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
  );
};

export default HeroSection;
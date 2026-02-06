import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const CtaSection = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <h2 className="cta-title">Bạn muốn tìm hiểu thêm?</h2>
        <p className="cta-desc">
          Liên hệ với chúng tôi để được tư vấn về cây cảnh, cách chăm sóc hoặc
          đặt lịch tham quan vườn cây.
        </p>
        <Link to="/contact" className="btn btn-white">
          Liên hệ ngay <FaArrowRight />
        </Link>
      </div>
    </section>
  );
};

export default CtaSection;
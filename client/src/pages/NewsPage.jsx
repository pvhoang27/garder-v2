import { useState } from "react";
// import { Link } from "react-router-dom"; // Dùng nếu muốn link sang trang chi tiết

const NewsPage = () => {
  // Dữ liệu giả lập (Hardcode)
  const [newsList] = useState([
    {
      id: 1,
      title: "Cách chăm sóc cây kim tiền luôn xanh tốt",
      summary: "Cây kim tiền là loài cây mang lại tài lộc, nhưng chăm sóc sao cho lá luôn xanh mướt thì không phải ai cũng biết. Cùng tìm hiểu bí quyết nhé!",
      image: "https://images.unsplash.com/photo-1612361664177-3363351d3846?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      date: "28/01/2026"
    },
    {
      id: 2,
      title: "Top 5 loại cây lọc không khí tốt nhất cho phòng ngủ",
      summary: "Giấc ngủ ngon hơn với không khí trong lành nhờ 5 loại cây 'nhỏ nhưng có võ' này. Lưỡi hổ, nha đam hay lan ý đều là lựa chọn tuyệt vời.",
      image: "https://images.unsplash.com/photo-1598516091417-6499806c9a75?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      date: "25/01/2026"
    },
    {
      id: 3,
      title: "Xu hướng trồng cây ban công năm 2026",
      summary: "Năm 2026 đánh dấu sự lên ngôi của các dòng cây nhiệt đới và phong cách khu vườn mini (Jungle) ngay tại ban công chung cư.",
      image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      date: "20/01/2026"
    },
    {
      id: 4,
      title: "Lợi ích bất ngờ của việc tưới cây buổi sáng",
      summary: "Tại sao các chuyên gia khuyên bạn nên tưới cây vào sáng sớm thay vì buổi tối? Câu trả lời nằm ở cơ chế hấp thụ nước của rễ.",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      date: "18/01/2026"
    }
  ]);

  return (
    <div className="container" style={{ marginTop: "30px" }}>
      <h1 style={{ textAlign: "center", color: "#2e7d32", marginBottom: "10px" }}>
        Tin Tức & Kiến Thức Cây Cảnh
      </h1>
      <p style={{ textAlign: "center", marginBottom: "40px", color: "#666" }}>
        Chia sẻ kinh nghiệm chăm sóc và xu hướng mới nhất từ Green Garden
      </p>

      <div className="news-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "30px"
      }}>
        {newsList.map((news) => (
          <div key={news.id} className="news-card" style={{
            background: "white",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s"
          }}>
            <div style={{ height: "200px", overflow: "hidden" }}>
              <img 
                src={news.image} 
                alt={news.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "0.3s" }}
                onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.target.style.transform = "scale(1)"}
              />
            </div>
            <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.85rem", color: "#999", marginBottom: "5px" }}>{news.date}</span>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem", color: "#333" }}>{news.title}</h3>
              <p style={{ color: "#555", fontSize: "0.95rem", lineHeight: "1.5", flex: 1 }}>
                {news.summary}
              </p>
              <button style={{
                marginTop: "15px",
                background: "transparent",
                border: "1px solid #2e7d32",
                color: "#2e7d32",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                alignSelf: "flex-start"
              }}
              onClick={() => alert("Chức năng đọc chi tiết đang được phát triển!")}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
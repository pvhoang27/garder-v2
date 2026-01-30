import { FaSearch, FaSortAmountDown, FaCalendarAlt } from "react-icons/fa";

const PlantToolbar = ({ 
  searchTerm, setSearchTerm, 
  filterCategory, setFilterCategory, 
  sortBy, setSortBy, 
  startDate, setStartDate, // <--- Props mới
  endDate, setEndDate,     // <--- Props mới
  categories 
}) => {
  const styles = {
    toolbar: { 
        display: "flex", 
        gap: "10px", 
        marginBottom: "20px", 
        background: "white", 
        padding: "15px", 
        borderRadius: "8px", 
        flexWrap: "wrap", 
        alignItems: "center" 
    },
    inputWrapper: { flex: "2 1 200px", position: "relative" },
    input: { width: "100%", padding: "10px 10px 10px 35px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px" },
    select: { flex: "1 1 150px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", cursor: "pointer", fontSize: "14px" },
    dateWrapper: { display: "flex", gap: "5px", alignItems: "center", flex: "1 1 250px" },
    dateInput: { padding: "10px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px", flex: 1 }
  };

  return (
    <div style={styles.toolbar}>
      {/* 1. Tìm kiếm tên */}
      <div style={styles.inputWrapper}>
        <FaSearch style={{ position: "absolute", left: "10px", top: "12px", color: "#888" }} />
        <input 
          type="text" 
          placeholder="Tìm tên cây..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={styles.input} 
        />
      </div>
      
      {/* 2. Lọc danh mục */}
      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={styles.select}>
        <option value="all">-- Tất cả Danh mục --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}> {cat.name} </option>
        ))}
      </select>

      {/* 3. Lọc theo ngày (MỚI) */}
      <div style={styles.dateWrapper}>
        <div style={{position: 'relative', flex: 1}}>
            <span style={{fontSize: '11px', color: '#666', position: 'absolute', top: '-8px', left: '5px', background: 'white', padding: '0 4px'}}>Từ ngày</span>
            <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                style={styles.dateInput}
                title="Từ ngày"
            />
        </div>
        <span style={{color: '#888'}}>-</span>
        <div style={{position: 'relative', flex: 1}}>
            <span style={{fontSize: '11px', color: '#666', position: 'absolute', top: '-8px', left: '5px', background: 'white', padding: '0 4px'}}>Đến ngày</span>
            <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                style={styles.dateInput} 
                title="Đến ngày"
            />
        </div>
      </div>

      {/* 4. Sắp xếp */}
      <div style={{ ...styles.inputWrapper, flex: "1 1 150px" }}>
        <FaSortAmountDown style={{ position: "absolute", left: "10px", top: "12px", color: "#888" }} />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.input}>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="price-asc">Giá tăng</option>
          <option value="price-desc">Giá giảm</option>
        </select>
      </div>
    </div>
  );
};

export default PlantToolbar;
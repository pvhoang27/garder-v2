import { FaSearch, FaSortAmountDown } from "react-icons/fa";

const PlantToolbar = ({ 
  searchTerm, setSearchTerm, 
  filterCategory, setFilterCategory, 
  sortBy, setSortBy, 
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
    select: { flex: "1 1 150px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", cursor: "pointer", fontSize: "14px" }
  };

  return (
    <div style={styles.toolbar}>
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
      
      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={styles.select}>
        <option value="all">-- Tất cả Danh mục --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}> {cat.name} </option>
        ))}
      </select>

      <div style={{ ...styles.inputWrapper, flex: "1 1 150px" }}>
        <FaSortAmountDown style={{ position: "absolute", left: "10px", top: "12px", color: "#888" }} />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.input}>
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá tăng</option>
          <option value="price-desc">Giá giảm</option>
        </select>
      </div>
    </div>
  );
};

export default PlantToolbar;
const PlantDetailModal = ({ plant, onClose, isMobile }) => {
  if (!plant) return null;

  const styles = {
    overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 1200, display: "flex", justifyContent: "center", alignItems: "center", padding: "15px" },
    content: { background: "white", width: "800px", maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" },
    header: { display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "20px" },
    closeBtn: { background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h3 style={{ color: "#2e7d32", margin: 0 }}>Chi Tiết: {plant.name}</h3>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: "20px" }}>
          <div>
            <img src={`http://localhost:3000${plant.thumbnail}`} alt={plant.name} style={{ width: "100%", borderRadius: "10px", objectFit: "cover" }} />
          </div>
          <div>
            <p><strong>Giá:</strong> {Number(plant.price).toLocaleString()} đ</p>
            <p><strong>Danh mục:</strong> {plant.category_name}</p>
            <p><strong>Mô tả:</strong> {plant.description}</p>
            <div style={{ marginTop: "15px" }}>
              <strong>Hướng dẫn chăm sóc:</strong>
              <p style={{ whiteSpace: "pre-line", fontSize: "0.9rem", background: "#f9f9f9", padding: "10px", borderRadius: "5px" }}>{plant.care_instruction}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailModal;
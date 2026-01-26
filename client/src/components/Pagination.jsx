const Pagination = ({ totalPages, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage }) => {
  if (totalPages <= 1 && itemsPerPage === 5) return null;

  const btnPageStyle = { padding: "5px 10px", background: "white", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" };

  return (
    <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ fontSize: "14px", color: "#555" }}>Hiện:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
          style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: "5px" }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          style={{ ...btnPageStyle, opacity: currentPage === 1 ? 0.5 : 1 }}
        >
          &lt;
        </button>
        <span style={{ padding: "5px 10px", fontWeight: "bold", fontSize: "0.9rem" }}>
          {currentPage}/{totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          style={{ ...btnPageStyle, opacity: currentPage === totalPages ? 0.5 : 1 }}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
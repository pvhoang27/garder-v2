import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { FaTrash, FaUserShield, FaUser } from "react-icons/fa";

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách user khi vào trang
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách user:", error);
      alert("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa user
  const handleDelete = async (id, username) => {
    if (window.confirm(`Bạn có chắc muốn xóa user "${username}" không?`)) {
      try {
        await axiosClient.delete(`/users/${id}`);
        alert("Xóa thành công!");
        fetchUsers(); // Load lại bảng
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi xóa!");
      }
    }
  };

  // Xử lý đổi quyền (Admin <-> Customer)
  const handleToggleRole = async (user) => {
    const newRole = user.role === "admin" ? "customer" : "admin";
    if (
      window.confirm(
        `Bạn muốn đổi quyền của "${user.username}" thành "${newRole}"?`
      )
    ) {
      try {
        await axiosClient.put(`/users/${user.id}/role`, { role: newRole });
        alert("Cập nhật quyền thành công!");
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi cập nhật!");
      }
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: "20px", background: "white", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#2e7d32", marginBottom: "20px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        Quản Lý Người Dùng
      </h2>
      
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>ID</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Họ tên</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Tài khoản</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Quyền hạn</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Ngày tạo</th>
              {/* [CẬP NHẬT] Thêm header cho Ngày truy cập cuối */}
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Truy cập cuối</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd", textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>#{user.id}</td>
                <td style={{ padding: "12px", fontWeight: "bold" }}>{user.full_name}</td>
                <td style={{ padding: "12px", color: "#555" }}>{user.username}</td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "15px",
                      background: user.role === "admin" ? "#e3f2fd" : "#fff3e0",
                      color: user.role === "admin" ? "#1976d2" : "#f57c00",
                      fontWeight: "bold",
                      fontSize: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    {user.role === "admin" ? <FaUserShield /> : <FaUser />}
                    {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                  </span>
                </td>
                <td style={{ padding: "12px", fontSize: "13px", color: "#666" }}>
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                </td>
                {/* [CẬP NHẬT] Hiển thị ngày truy cập cuối */}
                <td style={{ padding: "12px", fontSize: "13px", color: "#666" }}>
                    {user.last_login 
                      ? new Date(user.last_login).toLocaleString("vi-VN") 
                      : <span style={{ color: "#aaa", fontStyle: "italic" }}>Chưa đăng nhập</span>
                    }
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <button
                    onClick={() => handleToggleRole(user)}
                    title="Đổi quyền"
                    style={{
                      background: "transparent",
                      border: "1px solid #1976d2",
                      color: "#1976d2",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "8px",
                      fontSize: "13px"
                    }}
                  >
                    Đổi quyền
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, user.username)}
                    title="Xóa người dùng"
                    style={{
                      background: "#ef5350",
                      border: "none",
                      color: "white",
                      padding: "7px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px", color: "#777" }}>Chưa có người dùng nào.</p>
      )}
    </div>
  );
};

export default AdminUserManager;
import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get("/users");
      setUsers(res.data);
    } catch (error) { console.error(error); }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Xóa user này?")) {
      try {
        await axiosClient.delete(`/users/${id}`);
        fetchUsers();
      } catch { alert("Lỗi xóa user!"); }
    }
  };

  const tableContainerStyle = { background: "white", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", marginTop: "20px", overflowX: "auto" };
  const thStyle = { padding: "12px", textAlign: "left", fontSize: "14px", color: "#555", whiteSpace: "nowrap", background: "#eee" };
  const tdStyle = { padding: "12px", color: "#333", borderBottom: "1px solid #eee" };
  const btnDeleteStyle = { padding: "6px 10px", background: "#d32f2f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };

  return (
    <div>
      <h2>👥 Người Dùng</h2>
      <div style={tableContainerStyle}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Tên</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>#{user.id}</td>
                <td style={tdStyle}>{user.full_name}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.role}</td>
                <td style={tdStyle}>
                  {user.role !== "admin" && (
                    <button onClick={() => handleDeleteUser(user.id)} style={btnDeleteStyle}>
                      Xóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManager;
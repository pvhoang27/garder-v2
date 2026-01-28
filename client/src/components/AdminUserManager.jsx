import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AdminUserManager = ({ isMobile }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Xóa user này?")) {
      try {
        await axiosClient.delete(`/users/${id}`);
        fetchUsers();
      } catch {
        alert("Lỗi xóa user!");
      }
    }
  };

  const styles = {
    tableContainer: {
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      marginTop: "20px",
      overflowX: "auto",
    },
    th: {
      padding: "12px",
      textAlign: "left",
      fontSize: "14px",
      color: "#555",
      whiteSpace: "nowrap",
      background: "#eee",
    },
    td: {
      padding: "12px",
      color: "#333",
      borderBottom: "1px solid #eee",
      fontSize: "14px",
    },
    btnDelete: {
      padding: "6px 10px",
      background: "#d32f2f",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  return (
    <div>
      <h2 style={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }}>
        👥 Người Dùng
      </h2>
      <div style={styles.tableContainer}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "600px",
          }}
        >
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Tên</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={styles.td}>#{user.id}</td>
                <td style={styles.td}>{user.full_name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.role}</td>
                <td style={styles.td}>
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={styles.btnDelete}
                    >
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

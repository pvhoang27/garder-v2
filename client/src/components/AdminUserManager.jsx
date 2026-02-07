import { useState, useEffect, useRef } from "react";
import axiosClient from "../api/axiosClient";
import { FaTrash, FaUserShield, FaUser, FaEye, FaTimes, FaFileExport, FaFileImport } from "react-icons/fa";
import * as XLSX from "xlsx"; 

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const fileInputRef = useRef(null); 

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await axiosClient.get(`/users/${id}`);
      setSelectedUser(res.data);
    } catch (error) {
      alert("Không thể tải thông tin chi tiết.");
    }
  };

  const handleDelete = async (id, username) => {
    if (window.confirm(`Bạn có chắc muốn xóa user "${username}" không?`)) {
      try {
        await axiosClient.delete(`/users/${id}`);
        alert("Xóa thành công!");
        fetchUsers();
        if (selectedUser && selectedUser.id === id) setSelectedUser(null);
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi xóa!");
      }
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === "admin" ? "customer" : "admin";
    if (window.confirm(`Bạn muốn đổi quyền của "${user.username}" thành "${newRole}"?`)) {
      try {
        await axiosClient.put(`/users/${user.id}/role`, { role: newRole });
        alert("Cập nhật quyền thành công!");
        fetchUsers();
        if (selectedUser && selectedUser.id === user.id) {
            setSelectedUser({ ...selectedUser, role: newRole });
        }
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi cập nhật!");
      }
    }
  };

  // --- [EXPORT EXCEL] ---
  const handleExport = () => {
    const dataToExport = users.map(user => ({
        "ID": user.id,
        "Họ tên": user.full_name,
        "Tài khoản": user.username,
        "Email": user.email || "",
        "SĐT": user.phone || "",
        "Quyền": user.role,
        "Ngày tạo": new Date(user.created_at).toLocaleDateString("vi-VN"),
        "Truy cập cuối": user.last_login ? new Date(user.last_login).toLocaleString("vi-VN") : ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachUser");
    XLSX.writeFile(workbook, "Users_Data.xlsx");
  };

  // --- [IMPORT EXCEL - ĐÃ NÂNG CẤP] ---
  const handleImportClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset input để có thể chọn lại cùng 1 file nếu cần
    e.target.value = null;

    const reader = new FileReader();
    
    // Sử dụng ArrayBuffer an toàn hơn BinaryString
    reader.readAsArrayBuffer(file);
    
    reader.onload = async (evt) => {
        try {
            const buffer = evt.target.result;
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            
            // Lấy sheet đầu tiên
            const wsname = workbook.SheetNames[0];
            const ws = workbook.Sheets[wsname];
            
            // Chuyển thành JSON
            const data = XLSX.utils.sheet_to_json(ws);
            
            console.log("Dữ liệu đọc từ Excel:", data); // Debug xem có đọc được không

            if (data.length === 0) {
                alert("File Excel rỗng hoặc không đọc được dữ liệu!");
                return;
            }

            // Map dữ liệu (Hỗ trợ cả Tiếng Việt có dấu và không dấu/tiếng Anh)
            const formattedData = data.map(item => ({
                username: item['Tài khoản'] || item['username'] || item['Tai khoan'],
                full_name: item['Họ tên'] || item['full_name'] || item['Ho ten'],
                email: item['Email'] || item['email'],
                phone: item['SĐT'] || item['phone'] || item['SDT'],
                role: (item['Quyền'] || item['role'] || item['Quyen'] || 'customer').toLowerCase() === 'quản trị viên' ? 'admin' : (item['Quyền'] || item['role'] || 'customer').toLowerCase()
            }));

            // Lọc bỏ dòng không có username hoặc họ tên
            const validData = formattedData.filter(u => u.username && u.full_name);

            if (validData.length === 0) {
                alert("Không tìm thấy dữ liệu hợp lệ! Vui lòng kiểm tra tên cột trong file Excel (Cần có: Tài khoản, Họ tên).");
                return;
            }

            // Gửi lên Server
            const res = await axiosClient.post('/users/import', validData);
            alert(res.data.message);
            fetchUsers(); 

        } catch (error) {
            console.error("Lỗi import:", error);
            if (error.response) {
                alert(`Lỗi Server: ${error.response.data.message}`);
            } else {
                alert("Lỗi khi đọc file Excel! Hãy đảm bảo file không bị hỏng.");
            }
        }
    };
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: "20px", background: "white", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", position: "relative" }}>
      
      {/* Header + Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        <h2 style={{ color: "#2e7d32", margin: 0 }}>Quản Lý Người Dùng</h2>
        
        <div style={{ display: "flex", gap: "10px" }}>
            <button 
                onClick={handleExport}
                style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    background: "#1976d2", color: "white",
                    border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer"
                }}
            >
                <FaFileExport /> Xuất Excel
            </button>

            <button 
                onClick={handleImportClick}
                style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    background: "#2e7d32", color: "white",
                    border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer"
                }}
            >
                <FaFileImport /> Nhập Excel
            </button>
            {/* Input file ẩn */}
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: "none" }} 
                accept=".xlsx, .xls"
                onChange={handleFileChange}
            />
        </div>
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>ID</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Họ tên</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Tài khoản</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Quyền hạn</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Ngày tạo</th>
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
                <td style={{ padding: "12px", fontSize: "13px", color: "#666" }}>
                    {user.last_login 
                      ? new Date(user.last_login).toLocaleString("vi-VN") 
                      : <span style={{ color: "#aaa", fontStyle: "italic" }}>Chưa đăng nhập</span>
                    }
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                   <button
                    onClick={() => handleViewDetail(user.id)}
                    title="Xem chi tiết"
                    style={{
                      background: "#4caf50",
                      border: "none", color: "white",
                      padding: "7px 10px", borderRadius: "4px",
                      cursor: "pointer", marginRight: "8px",
                    }}
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleToggleRole(user)}
                    title="Đổi quyền"
                    style={{
                      background: "transparent",
                      border: "1px solid #1976d2", color: "#1976d2",
                      padding: "6px 10px", borderRadius: "4px",
                      cursor: "pointer", marginRight: "8px", fontSize: "13px"
                    }}
                  >
                    Đổi quyền
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, user.username)}
                    title="Xóa người dùng"
                    style={{
                      background: "#ef5350", border: "none", color: "white",
                      padding: "7px 10px", borderRadius: "4px", cursor: "pointer",
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

      {/* MODAL XEM CHI TIẾT */}
      {selectedUser && (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
            <div style={{
                background: "white", padding: "25px", borderRadius: "8px",
                width: "400px", maxWidth: "90%", position: "relative",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
            }}>
                <button 
                    onClick={() => setSelectedUser(null)}
                    style={{
                        position: "absolute", top: "10px", right: "10px",
                        background: "none", border: "none", fontSize: "18px",
                        cursor: "pointer", color: "#666"
                    }}
                >
                    <FaTimes />
                </button>
                <h3 style={{ color: "#2e7d32", borderBottom: "1px solid #eee", paddingBottom: "10px", marginTop: 0 }}>
                    Chi tiết người dùng
                </h3>
                <div style={{ marginTop: "15px", lineHeight: "1.6" }}>
                    <p><strong>ID:</strong> #{selectedUser.id}</p>
                    <p><strong>Tên tài khoản:</strong> {selectedUser.username}</p>
                    <p><strong>Họ và tên:</strong> {selectedUser.full_name}</p>
                    <p><strong>Email:</strong> {selectedUser.email || <span style={{color: "#999"}}>Chưa cập nhật</span>}</p>
                    <p><strong>Số điện thoại:</strong> {selectedUser.phone || <span style={{color: "#999"}}>Chưa cập nhật</span>}</p>
                    <p><strong>Vai trò:</strong> 
                        <span style={{ marginLeft: "5px", color: selectedUser.role === "admin" ? "#1976d2" : "#f57c00", fontWeight: "bold" }}>
                            {selectedUser.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                        </span>
                    </p>
                    <p><strong>Ngày tạo:</strong> {new Date(selectedUser.created_at).toLocaleString("vi-VN")}</p>
                    <p><strong>Đăng nhập lần cuối:</strong> {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleString("vi-VN") : "Chưa đăng nhập"}</p>
                </div>
                <div style={{ marginTop: "20px", textAlign: "right" }}>
                    <button 
                        onClick={() => setSelectedUser(null)}
                        style={{ padding: "8px 16px", background: "#666", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManager;
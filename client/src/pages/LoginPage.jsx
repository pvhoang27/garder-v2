import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "./LoginPage.css";

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook để lấy dữ liệu truyền từ trang khác

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Lấy tin nhắn thành công từ state (nếu có), ví dụ từ trang Register chuyển qua
  const [successMsg, setSuccessMsg] = useState(location.state?.message || "");

  // Nếu người dùng bắt đầu nhập liệu, ẩn thông báo thành công đi cho đỡ vướng
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg(""); // Reset thông báo thành công khi bấm đăng nhập

    try {
      const res = await axiosClient.post("/auth/login", { username, password });

      // [ĐÃ XÓA] localStorage.setItem('token', res.data.token); -> Token giờ nằm trong Cookie

      // Vẫn lưu thông tin user (tên, role) để hiển thị giao diện
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (onLoginSuccess) {
        onLoginSuccess(res.data.user);
      }

      const role = res.data.user.role;
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="login-page-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="login-title">Đăng Nhập</h2>

        {successMsg && (
          <div className="login-message success">{successMsg}</div>
        )}

        {error && <div className="login-message error">{error}</div>}

        <div className="login-form-group">
          <label className="login-form-label">Tài khoản:</label>
          <input
            type="text"
            value={username}
            onChange={handleInputChange(setUsername)}
            className="login-form-input"
            required
            placeholder="Nhập username..."
          />
        </div>

        <div className="login-form-group">
          <label className="login-form-label">Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={handleInputChange(setPassword)}
            className="login-form-input"
            required
            placeholder="Nhập password..."
          />
        </div>

        <div className="login-forgot-link">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </div>

        <button type="submit" className="login-submit-btn">
          ĐĂNG NHẬP
        </button>

        <div className="login-footer">
          <span>Chưa có tài khoản? </span>
          <Link to="/register">Đăng ký ngay</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

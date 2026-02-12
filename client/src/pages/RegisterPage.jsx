import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import logo from "../assets/logo.png";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp!");
    }

    // Validate Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return setError("Email không hợp lệ!");
    }

    // Validate SĐT
    if (!/^(0|\+84)\d{9,10}$/.test(formData.phone)) {
      return setError("Số điện thoại không hợp lệ!");
    }

    try {
      await axiosClient.post("/auth/register-customer", {
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
      });

      // THAY ĐỔI Ở ĐÂY: Không alert nữa, chuyển hướng kèm tin nhắn
      navigate("/login", {
        state: { message: "Đăng ký thành công! Vui lòng đăng nhập." },
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="register-page-container">
      <form onSubmit={handleRegister} className="register-form">
        <div className="register-logo-wrapper">
          <img src={logo} alt="Logo" className="register-logo" />
        </div>
        <h2 className="register-title">Đăng Ký</h2>

        {error && <div className="register-error">{error}</div>}

        {[
          "full_name",
          "email",
          "phone",
          "username",
          "password",
          "confirmPassword",
        ].map((field, index) => (
          <div key={index} className="register-form-group">
            <input
              type={
                field.toLowerCase().includes("password") ? "password" : "text"
              }
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={
                field === "confirmPassword"
                  ? "Nhập lại mật khẩu"
                  : field === "full_name"
                    ? "Họ tên"
                    : field === "username"
                      ? "Tài khoản"
                      : field === "email"
                        ? "Email"
                        : field === "phone"
                          ? "Số điện thoại"
                          : "Mật khẩu"
              }
              required
              className="register-form-input"
            />
          </div>
        ))}

        <button type="submit" className="register-submit-btn">
          ĐĂNG KÝ
        </button>
        <div className="register-footer">
          <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;

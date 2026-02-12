import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPasswordPage.css";
import { API_BASE_URL } from "../config";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // Step 1: Nhập Email, Step 2: Nhập OTP & Pass mới
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Bước 1: Gửi yêu cầu lấy OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      setMessage("Mã OTP đã được gửi đến email của bạn.");
      setStep(2); // Chuyển sang bước nhập OTP
    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác thực OTP và Đổi mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>{step === 1 ? "Quên Mật Khẩu" : "Đặt Lại Mật Khẩu"}</h2>

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        {step === 1 ? (
          // FORM BƯỚC 1: NHẬP EMAIL
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Nhập email của bạn:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi mã OTP"}
            </button>
          </form>
        ) : (
          // FORM BƯỚC 2: NHẬP OTP & PASS MỚI
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>Mã OTP (6 số):</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Nhập mã OTP từ email"
                required
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu mới:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                required
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đổi Mật Khẩu"}
            </button>
            <button
              type="button"
              className="btn-back"
              onClick={() => setStep(1)}
            >
              Quay lại nhập Email
            </button>
          </form>
        )}

        <div className="links">
          <Link to="/login">Quay lại Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

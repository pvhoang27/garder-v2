const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register); // Đăng ký Admin
router.post("/register-customer", authController.registerCustomer); // Đăng ký Khách (Mới)
router.post("/login", authController.login); // Đăng nhập
router.post("/logout", authController.logout); // [MỚI] Đăng xuất
router.get("/verify-email", authController.verifyEmail); // Link xác thực từ email
router.get("/verify", authController.verifyAuth); // [MỚI] Kiểm tra auth từ cookie

// Routes quên mật khẩu (OTP)
router.post("/forgot-password", authController.forgotPassword); // Gửi OTP
router.post("/reset-password", authController.resetPassword); // Check OTP và đổi pass

module.exports = router;

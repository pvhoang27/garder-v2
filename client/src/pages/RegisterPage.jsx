import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import logo from '../assets/logo.png'; // Đảm bảo đường dẫn logo đúng

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        full_name: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            await axiosClient.post('/auth/register-customer', {
                username: formData.username,
                password: formData.password,
                full_name: formData.full_name
            });
            
            alert('Đăng ký thành công! Hãy đăng nhập.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Đăng ký thất bại!');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f4f4f9', padding: '20px' }}>
            <form onSubmit={handleRegister} style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img src={logo} alt="Logo" style={{ height: '60px' }} />
                </div>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2e7d32' }}>Đăng Ký Thành Viên</h2>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Họ và tên:</label>
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} required placeholder="Nguyễn Văn A" />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tài khoản:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} required placeholder="Nhập username..." />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mật khẩu:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} required placeholder="Nhập password..." />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nhập lại mật khẩu:</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} required placeholder="Xác nhận password..." />
                </div>

                <button type="submit" style={{ width: '100%', padding: '12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>ĐĂNG KÝ</button>
                
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <span>Đã có tài khoản? </span>
                    <Link to="/login" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Đăng nhập ngay</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
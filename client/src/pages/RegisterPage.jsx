import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import logo from '../assets/logo.png'; 

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', confirmPassword: '', full_name: '', email: '', phone: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) return alert("Mật khẩu xác nhận không khớp!");
        
        // Validate Email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return alert("Email không hợp lệ!");
        
        // Validate SĐT
        if (!/^(0|\+84)\d{9,10}$/.test(formData.phone)) return alert("Số điện thoại không hợp lệ!");

        try {
            const res = await axiosClient.post('/auth/register-customer', {
                username: formData.username,
                password: formData.password,
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone
            });
            alert(res.data.message);
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Đăng ký thất bại!');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', background: '#f4f4f9', padding: '20px' }}>
            <form onSubmit={handleRegister} style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <img src={logo} alt="Logo" style={{ height: '50px' }} />
                </div>
                <h2 style={{ textAlign: 'center', color: '#2e7d32', marginBottom: '20px' }}>Đăng Ký</h2>
                
                {/* Các input form */}
                {['full_name', 'email', 'phone', 'username', 'password', 'confirmPassword'].map((field, index) => (
                    <div key={index} style={{ marginBottom: '12px' }}>
                        <input 
                            type={field.toLowerCase().includes('password') ? 'password' : 'text'}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            placeholder={field === 'confirmPassword' ? 'Nhập lại mật khẩu' : field === 'full_name' ? 'Họ tên' : field === 'username' ? 'Tài khoản' : field === 'email' ? 'Email' : field === 'phone' ? 'Số điện thoại' : 'Mật khẩu'}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
                        />
                    </div>
                ))}

                <button type="submit" style={{ width: '100%', padding: '12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>ĐĂNG KÝ</button>
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: '#2e7d32' }}>Đã có tài khoản? Đăng nhập</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
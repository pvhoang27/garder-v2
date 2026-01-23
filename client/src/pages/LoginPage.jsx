import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

// Nhận prop onLoginSuccess từ App.jsx truyền xuống
const LoginPage = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post('/auth/login', { username, password });
            
            // 1. Lưu token
            localStorage.setItem('token', res.data.token);
            
            // 2. Báo cho App biết đã login thành công -> Để Menu tự đổi nút
            if (onLoginSuccess) {
                onLoginSuccess();
            }
            
            alert(`Xin chào Admin: ${res.data.user.full_name || 'Admin'}!`);
            navigate('/admin'); 
        } catch (error) {
            console.error(error);
            alert('Sai tài khoản hoặc mật khẩu!');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f4f4f9' }}>
            <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2e7d32' }}>Đăng Nhập Quản Trị</h2>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tài khoản:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }} required placeholder="Nhập username..." />
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mật khẩu:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }} required placeholder="Nhập password..." />
                </div>

                <button type="submit" style={{ width: '100%', padding: '12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>ĐĂNG NHẬP</button>
            </form>
        </div>
    );
};

export default LoginPage;
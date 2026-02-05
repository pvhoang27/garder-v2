import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Thêm useLocation
import axiosClient from '../api/axiosClient';

const LoginPage = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Hook để lấy dữ liệu truyền từ trang khác

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Lấy tin nhắn thành công từ state (nếu có), ví dụ từ trang Register chuyển qua
    const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

    // Nếu người dùng bắt đầu nhập liệu, ẩn thông báo thành công đi cho đỡ vướng (tuỳ chọn)
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setError('');
        // setSuccessMsg(''); // Bỏ comment dòng này nếu muốn ẩn thông báo xanh khi user gõ phím
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg(''); // Reset thông báo thành công khi bấm đăng nhập

        try {
            const res = await axiosClient.post('/auth/login', { username, password });
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            if (onLoginSuccess) {
                onLoginSuccess(res.data.user);
            }
            
            const role = res.data.user.role;
            if (role === 'admin') {
                navigate('/admin'); 
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Sai tài khoản hoặc mật khẩu!');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f4f4f9' }}>
            <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2e7d32' }}>Đăng Nhập</h2>
                
                {/* Hiển thị thông báo thành công (Màu xanh) */}
                {successMsg && (
                    <div style={{ 
                        backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', 
                        borderRadius: '5px', marginBottom: '20px', textAlign: 'center',
                        fontSize: '14px', border: '1px solid #a5d6a7'
                    }}>
                        {successMsg}
                    </div>
                )}

                {/* Hiển thị lỗi (Màu đỏ) */}
                {error && (
                    <div style={{ 
                        backgroundColor: '#ffebee', color: '#c62828', padding: '10px', 
                        borderRadius: '5px', marginBottom: '20px', textAlign: 'center',
                        fontSize: '14px', border: '1px solid #ef9a9a'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tài khoản:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={handleInputChange(setUsername)}
                        style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }} 
                        required 
                        placeholder="Nhập username..." 
                    />
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mật khẩu:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={handleInputChange(setPassword)}
                        style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }} 
                        required 
                        placeholder="Nhập password..." 
                    />
                </div>

                <button type="submit" style={{ width: '100%', padding: '12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>ĐĂNG NHẬP</button>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <span>Chưa có tài khoản? </span>
                    <Link to="/register" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Đăng ký ngay</Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
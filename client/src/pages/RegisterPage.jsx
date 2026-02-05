import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import logo from '../assets/logo.png'; 

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', confirmPassword: '', full_name: '', email: '', phone: ''
    });
    const [error, setError] = useState(''); // State lưu lỗi
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Xóa lỗi khi người dùng bắt đầu nhập lại
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); // Reset lỗi trước khi submit

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
            const res = await axiosClient.post('/auth/register-customer', {
                username: formData.username,
                password: formData.password,
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone
            });
            // Với thành công, có thể dùng alert 1 lần hoặc dùng toast, 
            // nhưng ở đây ta alert nhẹ rồi chuyển trang, hoặc bỏ alert tuỳ ý bạn.
            // Để chắc chắn user biết đã đk thành công, ta vẫn giữ alert success hoặc chuyển luôn.
            alert(res.data.message); 
            navigate('/login');
        } catch (err) {
            console.error(err);
            // Hiển thị lỗi từ server trả về hoặc lỗi mặc định
            setError(err.response?.data?.message || 'Đăng ký thất bại!');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', background: '#f4f4f9', padding: '20px' }}>
            <form onSubmit={handleRegister} style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <img src={logo} alt="Logo" style={{ height: '50px' }} />
                </div>
                <h2 style={{ textAlign: 'center', color: '#2e7d32', marginBottom: '20px' }}>Đăng Ký</h2>
                
                {/* Khu vực hiển thị lỗi */}
                {error && (
                    <div style={{ 
                        backgroundColor: '#ffebee', 
                        color: '#c62828', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        marginBottom: '15px',
                        textAlign: 'center',
                        fontSize: '14px',
                        border: '1px solid #ef9a9a'
                    }}>
                        {error}
                    </div>
                )}

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
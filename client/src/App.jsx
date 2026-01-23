import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlantDetail from './pages/PlantDetail';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminPlantForm from './components/AdminPlantForm';
import ContactPage from './pages/ContactPage';
import CategoryPage from './pages/CategoryPage';
import { FaUserCircle, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa'; // Thêm icon cho đẹp

// Tạo một Component con cho Menu để dùng được useNavigate (vì useNavigate phải nằm trong BrowserRouter)
const Navigation = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        onLogout(); // Gọi hàm xóa token bên App
        navigate('/'); // Chuyển về trang chủ
        alert('Đã đăng xuất thành công!');
    };

    return (
        <nav style={{ background: '#2e7d32', padding: '15px 0', color: 'white', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
                {/* Logo */}
                <Link to="/" style={{ fontSize: '1.6rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    🌿 Green Garden
                </Link>

                {/* Menu Links */}
                <div style={{ display: 'flex', gap: '20px', fontSize: '1rem', alignItems: 'center' }}>
                    <Link to="/" className="nav-link">Trang Chủ</Link>
                    <Link to="/categories" className="nav-link">Danh Mục</Link>
                    <Link to="/contact" className="nav-link">Liên Hệ</Link>

                    {/* LOGIC ĐỔI NÚT ĐĂNG NHẬP / ĐĂNG XUẤT */}
                    {isLoggedIn ? (
                        <>
                            {/* Nếu ĐÃ đăng nhập -> Hiện nút Quản Trị & Đăng Xuất */}
                            <Link to="/admin" style={{ background: 'white', color: '#2e7d32', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                Quản Trị
                            </Link>
                            <button 
                                onClick={handleLogoutClick}
                                style={{ background: 'transparent', border: 'none', color: '#ffeba7', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                                <FaSignOutAlt /> Thoát
                            </button>
                        </>
                    ) : (
                        /* Nếu CHƯA đăng nhập -> Hiện nút Đăng Nhập */
                        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fff' }}>
                            <FaSignInAlt /> Đăng Nhập
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

function App() {
    // State kiểm tra trạng thái đăng nhập (Kiểm tra xem có token trong kho không)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Chạy 1 lần khi web tải để kiểm tra token cũ
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // Hàm Đăng nhập (Truyền xuống trang Login để gọi khi đăng nhập thành công)
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    // Hàm Đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('token'); // Xóa token
        setIsLoggedIn(false); // Cập nhật giao diện
    };

    return (
        <BrowserRouter>
            {/* Truyền trạng thái và hàm Đăng xuất vào Menu */}
            <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />

            <div style={{ minHeight: '80vh', paddingBottom: '50px' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/categories" element={<CategoryPage />} />
                    <Route path="/plant/:id" element={<PlantDetail />} />
                    <Route path="/contact" element={<ContactPage />} />
                    
                    {/* Truyền hàm handleLoginSuccess xuống trang Login */}
                    <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                    
                    {/* Bảo vệ route Admin (Nếu chưa login thì đá về Login) */}
                    <Route path="/admin" element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />} />
                    <Route path="/admin/add" element={isLoggedIn ? <AdminPlantForm /> : <Navigate to="/login" />} />
                    <Route path="/admin/edit/:id" element={isLoggedIn ? <AdminPlantForm /> : <Navigate to="/login" />} />
                </Routes>
            </div>

            <footer style={{ background: '#2c3e50', color: 'white', textAlign: 'center', padding: '30px', marginTop: 'auto' }}>
                <h3>Green Garden Showcase</h3>
                <p style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: '10px' }}>Địa chỉ: Vườn cây gia đình<br/>Điện thoại: 0988.888.888</p>
                <p style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.5 }}>© 2026 Developed by You</p>
            </footer>
        </BrowserRouter>
    );
}

export default App;
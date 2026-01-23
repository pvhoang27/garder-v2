import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom'; // Thêm useSearchParams
import axiosClient from '../api/axiosClient';

const HomePage = () => {
    const [plants, setPlants] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Hook để lấy tham số trên thanh địa chỉ (URL)
    const [searchParams] = useSearchParams();
    const urlCategoryId = searchParams.get('category_id'); // Lấy số ID từ ?category_id=...

    // State bộ lọc
    const [keyword, setKeyword] = useState('');
    const [selectedCat, setSelectedCat] = useState('');

    // Chạy mỗi khi vào trang hoặc khi cái ID trên URL thay đổi
    useEffect(() => {
        fetchCategories();
        
        // Nếu trên URL có ID (tức là bấm từ trang Danh mục sang)
        if (urlCategoryId) {
            setSelectedCat(urlCategoryId); // Điền ID vào ô chọn
            fetchPlants('', urlCategoryId); // Lọc ngay lập tức
        } else {
            // Nếu không có ID (vào trang chủ bình thường)
            setSelectedCat('');
            fetchPlants(); // Lấy tất cả
        }
    }, [urlCategoryId]); 

    const fetchCategories = async () => {
        try {
            const res = await axiosClient.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Hàm gọi API lấy cây (có hỗ trợ lọc)
    const fetchPlants = async (searchKey = '', catId = '') => {
        try {
            const res = await axiosClient.get('/plants', {
                params: {
                    keyword: searchKey || keyword,
                    category_id: catId || selectedCat
                }
            });
            setPlants(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPlants();
    };

    return (
        <div>
            {/* 1. HERO BANNER */}
            <div style={{ 
                background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
                height: '450px',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                padding: '20px'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '15px', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>Green Garden Showcase</h1>
                <p style={{ fontSize: '1.3rem', maxWidth: '700px', marginBottom: '30px' }}>
                    Không gian xanh lưu giữ vẻ đẹp thiên nhiên. Nơi chia sẻ niềm đam mê cây cảnh của gia đình.
                </p>
                
                {/* THANH TÌM KIẾM */}
                <form onSubmit={handleSearch} style={{ background: 'white', padding: '8px', borderRadius: '50px', display: 'flex', width: '100%', maxWidth: '600px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                    <input 
                        type="text" 
                        placeholder="Bạn muốn tìm cây gì?..." 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        style={{ flex: 1, border: 'none', padding: '10px 20px', outline: 'none', borderRadius: '50px', fontSize: '1rem' }}
                    />
                    <select 
                        value={selectedCat} 
                        onChange={(e) => setSelectedCat(e.target.value)}
                        style={{ border: 'none', borderLeft: '1px solid #eee', padding: '0 15px', outline: 'none', color: '#555', cursor: 'pointer', background: 'white' }}
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <button type="submit" style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: '0.3s' }}>
                        Tìm
                    </button>
                </form>
            </div>

            {/* 2. DANH SÁCH CÂY */}
            <div className="container" style={{ marginTop: '50px', marginBottom: '50px' }}>
                <h2 style={{ borderLeft: '6px solid #2e7d32', paddingLeft: '15px', marginBottom: '30px', color: '#2c3e50', fontSize: '1.8rem' }}>
                    {urlCategoryId 
                        ? 'Kết quả lọc theo danh mục' 
                        : (keyword ? `Kết quả tìm kiếm: "${keyword}"` : 'Cây Mới Nhất Trong Vườn')}
                </h2>

                {plants.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#777' }}>
                        <h3>Không tìm thấy cây nào phù hợp 🍃</h3>
                        <p>Thử tìm từ khóa khác hoặc chọn danh mục khác xem sao.</p>
                        <button onClick={() => { setKeyword(''); setSelectedCat(''); window.location.href='/'; }} style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}>Xem tất cả cây</button>
                    </div>
                ) : (
                    <div className="plant-list">
                        {plants.map((plant) => (
                            <div key={plant.id} className="plant-card">
                                <div style={{ position: 'relative', height: '250px', overflow: 'hidden' }}>
                                    <img 
                                        src={plant.thumbnail ? `http://localhost:3000${plant.thumbnail}` : 'https://via.placeholder.com/300x250?text=No+Image'} 
                                        alt={plant.name} 
                                        className="plant-image" 
                                        loading="lazy"
                                    />
                                    {plant.is_featured === 1 && (
                                        <span style={{ position: 'absolute', top: 15, right: 15, background: '#e74c3c', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                                            Nổi bật
                                        </span>
                                    )}
                                </div>
                                <div className="plant-info">
                                    <span className="plant-category">{plant.category_name || 'Chưa phân loại'}</span>
                                    <h3 className="plant-name" title={plant.name}>{plant.name}</h3>
                                    {/* Hiển thị đoạn ngắn mô tả (loại bỏ thẻ HTML) */}
                                    <div className="plant-desc" dangerouslySetInnerHTML={{ __html: plant.description }}></div>
                                    
                                    <Link to={`/plant/${plant.id}`} className="btn-detail">
                                        Xem Chi Tiết
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
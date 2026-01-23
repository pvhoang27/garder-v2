import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { FaLeaf } from 'react-icons/fa'; 

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Lấy danh sách danh mục từ API
        const fetchCats = async () => {
            try {
                const res = await axiosClient.get('/categories');
                setCategories(res.data);
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
            }
        };
        fetchCats();
    }, []);

    return (
        <div className="container" style={{ marginTop: '40px', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ color: '#2e7d32', marginBottom: '10px' }}>Khám Phá Danh Mục</h1>
                <p style={{ color: '#666' }}>Chọn một chủ đề để xem các loại cây phù hợp với không gian của bạn</p>
            </div>

            {categories.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Đang tải danh mục...</p>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '30px' 
                }}>
                    {categories.map(cat => (
                        <div key={cat.id} style={{ 
                            background: 'white', 
                            borderRadius: '15px', 
                            boxShadow: '0 10px 20px rgba(0,0,0,0.05)', 
                            padding: '30px',
                            textAlign: 'center',
                            transition: 'transform 0.3s ease',
                            borderTop: '5px solid #2e7d32',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ fontSize: '3rem', color: '#81c784', marginBottom: '15px' }}>
                                <FaLeaf />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#333' }}>{cat.name}</h2>
                            <p style={{ color: '#777', marginBottom: '25px', fontSize: '0.9rem', minHeight: '40px' }}>
                                {cat.description || 'Các loại cây tuyệt đẹp đang chờ bạn.'}
                            </p>
                            
                            {/* QUAN TRỌNG: Link này sẽ dẫn về trang chủ và kèm theo mã ID danh mục */}
                            <Link 
                                to={`/?category_id=${cat.id}`} 
                                style={{ 
                                    display: 'inline-block', 
                                    padding: '10px 30px', 
                                    background: '#2e7d32', 
                                    color: 'white', 
                                    borderRadius: '50px', 
                                    fontWeight: 'bold',
                                    boxShadow: '0 5px 15px rgba(46, 125, 50, 0.3)'
                                }}
                            >
                                Xem Ngay &rarr;
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
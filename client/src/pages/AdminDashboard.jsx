import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaBullhorn } from 'react-icons/fa'; // Import thêm icon FaBullhorn

const AdminDashboard = () => {
    const [plants, setPlants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
        fetchPlants();
    }, []);

    const fetchPlants = async () => {
        try {
            const res = await axiosClient.get('/plants');
            setPlants(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa cây này?')) {
            try {
                await axiosClient.delete(`/plants/${id}`);
                alert('Đã xóa!');
                fetchPlants();
            } catch (error) {
                alert('Lỗi xóa cây');
            }
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0', flexWrap: 'wrap', gap: '10px' }}>
                <h1>Quản Lý Vườn Cây</h1>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    {/* Nút Cấu hình Popup Mới */}
                    <Link to="/admin/popup" style={{ background: '#f39c12', color: 'white', padding: '10px 20px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
                        <FaBullhorn /> Cấu Hình Popup
                    </Link>

                    <Link to="/admin/add" style={{ background: '#2e7d32', color: 'white', padding: '10px 20px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
                        <FaPlus /> Thêm Cây Mới
                    </Link>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <thead>
                    <tr style={{ background: '#f1f1f1', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Hình ảnh</th>
                        <th style={{ padding: '12px' }}>Tên cây</th>
                        <th style={{ padding: '12px' }}>Danh mục</th>
                        <th style={{ padding: '12px' }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {plants.map(plant => (
                        <tr key={plant.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>
                                <img 
                                    src={plant.thumbnail ? `http://localhost:3000${plant.thumbnail}` : 'https://via.placeholder.com/50'} 
                                    alt="" 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                            </td>
                            <td style={{ padding: '10px' }}>
                                <b>{plant.name}</b>
                                {plant.is_featured === 1 && <span style={{ marginLeft: '5px', fontSize: '0.8rem', color: 'red' }}>★ Hot</span>}
                            </td>
                            <td style={{ padding: '10px' }}>{plant.category_name}</td>
                            <td style={{ padding: '10px' }}>
                                <Link to={`/admin/edit/${plant.id}`} style={{ marginRight: '10px', color: '#f39c12' }}><FaEdit size={18} /></Link>
                                <button onClick={() => handleDelete(plant.id)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer' }}><FaTrash size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
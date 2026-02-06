import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaSave, FaPen, FaIdCard } from "react-icons/fa";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        full_name: "",
        phone: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axiosClient.get('/users/profile');
            setUser(res.data);
            setFormData({
                full_name: res.data.full_name || "",
                phone: res.data.phone || ""
            });
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.put('/users/profile', formData);
            alert("Cập nhật thông tin thành công!");
            setIsEditing(false);
            fetchProfile(); // Refresh data
            
            // Cập nhật lại localStorage để Header hiển thị đúng tên mới ngay lập tức
            const currentUser = JSON.parse(localStorage.getItem('user')) || {};
            localStorage.setItem('user', JSON.stringify({ ...currentUser, full_name: formData.full_name }));
            
            // Dispatch event để Header tự update (nếu cần thiết, hoặc reload trang)
            window.dispatchEvent(new Event("storage"));
            
        } catch (error) {
            alert(error.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Đang tải...</div>;
    if (!user) return <div style={{textAlign: 'center', marginTop: '50px'}}>Không tìm thấy thông tin người dùng.</div>;

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                overflow: 'hidden'
            }}>
                {/* Header Cover */}
                <div style={{
                    background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                    height: '120px',
                    position: 'relative'
                }}></div>

                {/* Avatar & Basic Info */}
                <div style={{ padding: '0 30px 30px', marginTop: '-50px', position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '4px solid white',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}>
                            <FaUser size={40} color="#2e7d32" />
                        </div>
                        {/* Tên hiển thị to dưới avatar */}
                        <h2 style={{ margin: '10px 0 5px', color: '#333' }}>{user.full_name}</h2>
                        <span style={{ 
                            background: user.role === 'admin' ? '#d32f2f' : '#2e7d32', 
                            color: 'white', 
                            padding: '4px 12px', 
                            borderRadius: '20px', 
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            fontWeight: 'bold'
                        }}>
                            {user.role}
                        </span>
                    </div>

                    <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, color: '#2e7d32' }}>Thông tin cá nhân</h3>
                        {!isEditing && (
                            <button 
                                onClick={() => setIsEditing(true)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '8px 16px',
                                    background: '#f5f5f5', border: 'none', borderRadius: '6px',
                                    cursor: 'pointer', color: '#555', fontWeight: '500'
                                }}
                            >
                                <FaPen size={12} /> Chỉnh sửa
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            {/* CHỈ CHO PHÉP SỬA FULL NAME VÀ PHONE */}
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Họ và tên (Full Name)</label>
                                <input 
                                    type="text" 
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                    placeholder="Nhập họ và tên của bạn"
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Số điện thoại</label>
                                <input 
                                    type="text" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                            </div>
                            
                            {/* Username bị ẩn hoặc hiển thị dạng read-only nếu muốn, ở đây tôi ẩn đi để tập trung vào việc sửa */}
                            {/* <p style={{fontSize: '12px', color: '#888', fontStyle: 'italic'}}>* Tên đăng nhập và Email không thể thay đổi.</p> */}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button 
                                    type="submit"
                                    style={{
                                        padding: '10px 20px', background: '#2e7d32', color: 'white',
                                        border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                                    }}
                                >
                                    <FaSave style={{marginRight: '5px'}}/> Lưu thay đổi
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => { setIsEditing(false); setFormData({full_name: user.full_name, phone: user.phone}); }}
                                    style={{
                                        padding: '10px 20px', background: '#e0e0e0', color: '#333',
                                        border: 'none', borderRadius: '6px', cursor: 'pointer'
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    ) : (
                        // Grid hiển thị thông tin
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            {/* [MỚI] Thêm mục Họ và tên vào đây cho rõ ràng */}
                            <div style={infoItemStyle}>
                                <FaIdCard color="#888" size={20} />
                                <div>
                                    <small style={{display:'block', color:'#888', marginBottom:'2px'}}>Họ và tên</small>
                                    <strong style={{fontSize: '15px'}}>{user.full_name}</strong>
                                </div>
                            </div>

                            <div style={infoItemStyle}>
                                <FaUser color="#888" size={18} />
                                <div>
                                    <small style={{display:'block', color:'#888', marginBottom:'2px'}}>Tên đăng nhập</small>
                                    <strong style={{fontSize: '15px'}}>{user.username}</strong>
                                </div>
                            </div>

                            <div style={infoItemStyle}>
                                <FaEnvelope color="#888" size={18} />
                                <div>
                                    <small style={{display:'block', color:'#888', marginBottom:'2px'}}>Email</small>
                                    <strong style={{fontSize: '15px', wordBreak: 'break-all'}}>{user.email}</strong>
                                </div>
                            </div>

                            <div style={infoItemStyle}>
                                <FaPhone color="#888" size={18} />
                                <div>
                                    <small style={{display:'block', color:'#888', marginBottom:'2px'}}>Số điện thoại</small>
                                    <strong style={{fontSize: '15px'}}>{user.phone || "Chưa cập nhật"}</strong>
                                </div>
                            </div>

                            <div style={infoItemStyle}>
                                <FaCalendarAlt color="#888" size={18} />
                                <div>
                                    <small style={{display:'block', color:'#888', marginBottom:'2px'}}>Ngày tham gia</small>
                                    <strong style={{fontSize: '15px'}}>{new Date(user.created_at).toLocaleDateString('vi-VN')}</strong>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const infoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #eee',
    transition: 'transform 0.2s',
};

export default ProfilePage;
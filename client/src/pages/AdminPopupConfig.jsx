import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaSave, FaEye } from 'react-icons/fa';

const AdminPopupConfig = () => {
    const [config, setConfig] = useState({
        title: '',
        content: '',
        link_url: '',
        position: 'center',
        is_active: false,
        image_url: '' // Link ảnh cũ
    });
    const [file, setFile] = useState(null); // File ảnh mới
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        // Load cấu hình hiện tại
        axiosClient.get('/popup').then(res => {
            if (res.data) {
                setConfig({
                    ...res.data,
                    is_active: res.data.is_active === 1 // Convert number to boolean
                });
            }
        });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', config.title);
        formData.append('content', config.content);
        formData.append('link_url', config.link_url);
        formData.append('position', config.position);
        formData.append('is_active', config.is_active);
        formData.append('old_image_url', config.image_url); // Gửi link ảnh cũ để nếu ko up ảnh mới thì dùng lại
        
        if (file) {
            formData.append('image', file);
        }

        try {
            await axiosClient.post('/popup', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Đã lưu cấu hình Popup!');
        } catch (error) {
            console.error(error);
            alert('Lỗi khi lưu cấu hình');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '30px', paddingBottom: '50px' }}>
            <h2 style={{ color: '#2e7d32', textAlign: 'center', marginBottom: '30px' }}>⚙️ Cấu Hình Popup Quảng Cáo</h2>
            
            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                
                {/* Switch Bật/Tắt */}
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            name="is_active" 
                            checked={config.is_active} 
                            onChange={handleChange} 
                            style={{ transform: 'scale(1.5)', marginRight: '10px' }}
                        />
                        <span style={{ fontWeight: 'bold' }}>Kích hoạt Popup này</span>
                    </label>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Tiêu đề:</label>
                    <input type="text" name="title" value={config.title} onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px' }} placeholder="VD: Khuyến mãi mùa hè" />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Nội dung ngắn:</label>
                    <textarea name="content" value={config.content} onChange={handleChange} rows="3" style={{ width: '100%', padding: '10px', marginTop: '5px' }} placeholder="VD: Giảm giá 20% cho tất cả các loại cây..."></textarea>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Hình ảnh:</label>
                    <input type="file" onChange={handleFileChange} style={{ marginTop: '5px', display: 'block' }} />
                    
                    {/* Preview ảnh */}
                    <div style={{ marginTop: '10px', border: '1px dashed #ccc', padding: '10px', textAlign: 'center' }}>
                        {preview ? (
                            <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px' }} />
                        ) : config.image_url ? (
                            <img src={`http://localhost:3000${config.image_url}`} alt="Current" style={{ maxWidth: '100%', maxHeight: '150px' }} />
                        ) : (
                            <span style={{ color: '#999' }}>Chưa có ảnh</span>
                        )}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                    <div>
                        <label>Đường dẫn khi click (Link):</label>
                        <input type="text" name="link_url" value={config.link_url} onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px' }} placeholder="VD: /categories" />
                    </div>
                    <div>
                        <label>Vị trí hiển thị:</label>
                        <select name="position" value={config.position} onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
                            <option value="center">Giữa màn hình (Center)</option>
                            <option value="bottom-right">Góc phải dưới (Bottom Right)</option>
                            <option value="bottom-left">Góc trái dưới (Bottom Left)</option>
                        </select>
                    </div>
                </div>

                <button type="submit" style={{ width: '100%', background: '#2e7d32', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <FaSave /> Lưu Cấu Hình
                </button>

            </form>
        </div>
    );
};

export default AdminPopupConfig;
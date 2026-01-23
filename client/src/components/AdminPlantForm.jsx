import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS cho Editor
import axiosClient from '../api/axiosClient';
import { useNavigate, useParams } from 'react-router-dom';

const AdminPlantForm = () => {
    const { id } = useParams(); // Nếu có ID -> Đang sửa, Không có -> Đang thêm
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    // State lưu dữ liệu form
    const [formData, setFormData] = useState({
        name: '',
        scientific_name: '',
        age: '',
        category_id: '',
        description: '', // Cái này sẽ dùng Rich Text Editor
        care_instruction: '',
        video_url: '',
        is_featured: false
    });

    const [files, setFiles] = useState([]); // Lưu nhiều ảnh
    const [categories, setCategories] = useState([]);

    // Lấy danh sách danh mục để hiện vào ô chọn
    useEffect(() => {
        axiosClient.get('/categories').then(res => setCategories(res.data));
        
        // Nếu là chế độ Sửa, lấy thông tin cây cũ đập vào form
        if (isEdit) {
            axiosClient.get(`/plants/${id}`).then(res => {
                setFormData({
                    name: res.data.name,
                    scientific_name: res.data.scientific_name || '',
                    age: res.data.age || '',
                    category_id: res.data.category_id,
                    description: res.data.description || '',
                    care_instruction: res.data.care_instruction || '',
                    video_url: res.data.video_url || '',
                    is_featured: res.data.is_featured === 1
                });
            });
        }
    }, [id, isEdit]);

    // Xử lý thay đổi input thường
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Xử lý thay đổi Rich Text Editor (React-Quill trả về HTML string)
    const handleDescriptionChange = (value) => {
        setFormData(prev => ({ ...prev, description: value }));
    };

    // Xử lý chọn nhiều file
    const handleFileChange = (e) => {
        setFiles(e.target.files); // Lưu danh sách file user chọn
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        // Append dữ liệu text
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        // Append nhiều file ảnh
        for (let i = 0; i < files.length; i++) {
            data.append('images', files[i]);
        }

        try {
            if (isEdit) {
                await axiosClient.put(`/plants/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Cập nhật thành công!');
            } else {
                await axiosClient.post('/plants', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Thêm cây mới thành công!');
            }
            navigate('/admin'); // Quay về trang danh sách
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra!');
        }
    };

    return (
        <div className="container">
            <h2>{isEdit ? 'Chỉnh Sửa Cây' : 'Thêm Cây Mới'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', maxWidth: '800px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input type="text" name="name" placeholder="Tên cây (Thường gọi)" value={formData.name} onChange={handleChange} required style={{ padding: '10px' }} />
                    <input type="text" name="scientific_name" placeholder="Tên khoa học" value={formData.scientific_name} onChange={handleChange} style={{ padding: '10px' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <select name="category_id" value={formData.category_id} onChange={handleChange} required style={{ padding: '10px' }}>
                        <option value="">-- Chọn Danh Mục --</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <input type="text" name="age" placeholder="Tuổi đời (VD: 10 năm)" value={formData.age} onChange={handleChange} style={{ padding: '10px' }} />
                </div>

                {/* RICH TEXT EDITOR CHO MÔ TẢ */}
                <div>
                    <label>Mô tả chi tiết (Hỗ trợ định dạng):</label>
                    <ReactQuill 
                        theme="snow" 
                        value={formData.description} 
                        onChange={handleDescriptionChange} 
                        style={{ height: '200px', marginBottom: '50px' }} // margin bottom để tránh thanh toolbar che mất nút
                    />
                </div>

                <textarea name="care_instruction" placeholder="Cách chăm sóc (Ngắn gọn)" value={formData.care_instruction} onChange={handleChange} rows="4" style={{ padding: '10px' }}></textarea>

                <input type="text" name="video_url" placeholder="Link Video (YouTube)" value={formData.video_url} onChange={handleChange} style={{ padding: '10px' }} />

                {/* INPUT UPLOAD NHIỀU ẢNH */}
                <div>
                    <label>Hình ảnh (Chọn nhiều ảnh cùng lúc):</label>
                    <input type="file" multiple onChange={handleFileChange} accept="image/*" style={{ marginTop: '5px' }} />
                </div>

                <label>
                    <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} />
                    Đặt làm cây nổi bật (Featured)
                </label>

                <button type="submit" style={{ padding: '12px', background: '#2e7d32', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                    {isEdit ? 'Lưu Thay Đổi' : 'Thêm Cây'}
                </button>
            </form>
        </div>
    );
};

export default AdminPlantForm;
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Check extension file (đuôi file)
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Danh sách đuôi file cho phép: ảnh, video, excel
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.xlsx', '.xls'];

    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        // Cho phép MIME type của Excel (đôi khi check đuôi file an toàn hơn check mime với excel)
        if (
            file.mimetype.startsWith('image/') || 
            file.mimetype.startsWith('video/') ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
            file.mimetype === 'application/vnd.ms-excel'
        ) {
            cb(null, true);
        } else {
            cb(new Error('File không hỗ trợ! Chỉ nhận Ảnh, Video hoặc Excel.'), false);
        }
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } 
});

module.exports = upload;
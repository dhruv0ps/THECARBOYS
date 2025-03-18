const multer = require('multer');
const path = require('path');

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/files/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileUpload = multer({
    storage: fileStorage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // console.log(file.mimetype)
        const filetypes = /csv|xlsx|vnd.openxmlformats-officedocument.spreadsheetml.sheet/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Unsupported file type! Please upload a CSV or Excel file.'));
    }
});
module.exports = 

    fileUpload
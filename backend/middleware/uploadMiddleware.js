const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderName = file.fieldname;  // Use the field name as the folder name
        const uploadPath = `uploads/${folderName}`;
        
        // Create the directory if it doesn't exist
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath); // Save the file in the dynamic folder
    },
    filename: function (req, file, cb) {
        const fieldName = file.fieldname;
        const ext = path.extname(file.originalname); // Get the file extension
        const uniqueFileName = `${uuidv4()}_${Date.now().toString()}${ext}`; // Unique filename
        cb(null, uniqueFileName); // Save with the unique name
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB file size limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|pdf|mp4/;
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: Only images (jpeg, jpg, png) and PDF files are allowed.'));
    }
});

// Middleware for handling the specific fields
const uploadFields = upload.fields([
    { name: 'user_image', maxCount: 1 },
    { name: 'user_profile', maxCount: 1 },
    { name: 'mark_sheet_10', maxCount: 1 },
    { name: 'mark_sheet_12', maxCount: 1 },
    { name: 'aadhar_back_document', maxCount: 1 },
    { name: 'aadhar_front_document', maxCount: 1 },
    { name: 'other_document', maxCount: 10 }, // Adjust the number of files as needed
]);

const uploadMiddleware = (req, res, next) => {
    uploadFields(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ status: false, message: err.message });
        } else if (err) {
            return res.status(400).json({ status: false, message: err.message });
        }

        // Directly bind folder name and image name to req.body
        ['user_image', 'mark_sheet_10', 'mark_sheet_12', 'aadhar_front_document','aadhar_back_document', 'other_document','user_profile'].forEach(field => {
            if (req.files[field]) {
                const filePath = req.files[field][0].path; // Use 'path' for local storage
                const fileName = path.basename(filePath);
                req.body[field] = `${field}/${fileName}`;
            }
        });

        // Collect 'other' field files if available
        if (req.files['other_document']) {
            req.body['other_document'] = req.files['other_document'].map(file => {
                const filePath = file.path;
                return `other_document/${path.basename(filePath)}`;
            });
        }
        next();
    });
};

module.exports = uploadMiddleware;

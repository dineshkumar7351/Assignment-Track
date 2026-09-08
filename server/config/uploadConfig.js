const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

// Ensure local uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
  },
});

// Allowed file extensions and MIME types: PDF, DOCX, PPTX, TXT
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.pptx', '.txt', '.doc', '.ppt'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'text/plain',
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (ALLOWED_EXTENSIONS.includes(ext) || ALLOWED_MIME_TYPES.includes(mime)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type "${ext}". Supported formats are PDF, DOCX, PPTX, and TXT.`
      ),
      false
    );
  }
};

// 10MB file size limit
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

/**
 * Upload file to Cloudinary if credentials exist; otherwise fallback to local URL
 * @param {Object} file - Multer file object
 * @returns {Promise<{ url: string, isCloudinary: boolean }>}
 */
const processFileUpload = async (file) => {
  const isCloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
        folder: 'smart-assignment-tracker/submissions',
        use_filename: true,
      });

      // Optionally clean up local temp file after Cloudinary upload
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.warn('Could not remove temporary local file:', err.message);
      }

      return {
        url: result.secure_url,
        isCloudinary: true,
      };
    } catch (cloudErr) {
      console.warn('Cloudinary upload failed, falling back to local storage:', cloudErr.message);
    }
  }

  // Fallback: Local URL served statically via Express
  const localUrl = `/uploads/${file.filename}`;
  return {
    url: localUrl,
    isCloudinary: false,
  };
};

module.exports = {
  upload,
  processFileUpload,
  ALLOWED_EXTENSIONS,
};

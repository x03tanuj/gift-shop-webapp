import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Configure Cloudinary if credentials are provided in environment
const isCloudinaryConfigured = () => {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (cloud_name && api_key && api_secret) {
    cloudinary.config({ cloud_name, api_key, api_secret });
    return true;
  }
  return false;
};

// Initial config attempt
isCloudinaryConfigured();

// Allowed MIME types for image uploads
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];

// Configure Multer with memory storage and size/type validation
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid file type. Only JPG, PNG, WebP, GIF, and AVIF images are allowed.'
        ),
        false
      );
    }
  },
});

/**
 * Uploads a file buffer to Cloudinary or falls back to local static storage.
 *
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} Hosted image URL
 */
export async function processImageUpload(file) {
  if (!file || !file.buffer) {
    throw new Error('No image buffer provided for upload.');
  }

  // 1. Cloudinary upload if configured
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'shive_shakti_products',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  // 2. Local fallback storage (serves via /uploads static route)
  const uploadsDir = path.resolve(__dirname, '../../public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const cleanName = (file.originalname || 'image.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${Date.now()}-${cleanName}`;
  const filePath = path.join(uploadsDir, filename);

  fs.writeFileSync(filePath, file.buffer);

  const port = process.env.PORT || 5000;
  return `http://localhost:${port}/uploads/${filename}`;
}

export default upload;

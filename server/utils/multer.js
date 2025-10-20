import multer from "multer";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from './cloudinary.js'; // 💡 Import the initialized instance

// 🛑 STEP 1: DEFINE THE CLOUDINARY STORAGE ENGINE
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Pass the initialized Cloudinary instance
  params: {
    folder: 'blogpost-images', // A dedicated folder on your Cloudinary account
    allowed_formats: ['jpeg', 'png', 'jpg'], // Optional: Restrict file types
    // The public_id logic will be handled by multer and cloudinary
  },
});

// 🛑 STEP 2: CONFIGURE MULTER TO USE THE CLOUD STORAGE
// Multer will now use the stream-based Cloudinary storage instead of disk storage.
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Optional: 5MB limit
});

export default upload;
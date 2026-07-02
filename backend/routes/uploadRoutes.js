import express from 'express';
import { uploadImageController } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/verifyJWT.js';
import { uploadImage } from '../services/cloudinary/uploadService.js';

export const uploadRouter = express.Router();

// Multer reads one file field named "image", then controller returns the image URL.
uploadRouter.post('/images', authenticate, uploadImage.single('image'), uploadImageController);

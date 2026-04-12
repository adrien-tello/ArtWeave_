import { Router, Response } from 'express';
import multer from 'multer';
import { uploadToCloudinary } from '../lib/cloudinary';
import { requireSeller, AuthRequest } from '../middleware/auth';

const router  = Router();

// Store file in memory (buffer) — no disk writes needed
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

/**
 * POST /api/upload
 * Seller sends a multipart/form-data request with field "image".
 * Backend uploads to Cloudinary and returns { url } to the frontend.
 * Frontend then uses that url as image_url when creating/updating a product.
 */
router.post('/', requireSeller, upload.single('image'), async (req: AuthRequest, res: Response) => {
  if (!req.file) { res.status(400).json({ error: 'No image file provided' }); return; }
  const url = await uploadToCloudinary(req.file.buffer);
  res.json({ url });
});

export default router;

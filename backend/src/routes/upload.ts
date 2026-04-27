import { Router, Response } from 'express';
import multer from 'multer';
import { uploadToCloudinary } from '../lib/cloudinary';
import { requireSeller, AuthRequest } from '../middleware/auth';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (allowed.includes(file.mimetype) || file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// POST /api/upload — seller uploads product image → stored in Cloudinary → returns secure_url
router.post('/', requireSeller, upload.single('image'), async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file provided' }); return;
  }

  console.log(`[upload] Received file: ${req.file.originalname} (${req.file.size} bytes)`);
  console.log(`[upload] Cloudinary config — cloud_name: ${process.env.CLOUDINARY_CLOUD_NAME}, api_key: ${process.env.CLOUDINARY_API_KEY?.slice(0, 6)}...`);

  try {
    const url = await uploadToCloudinary(req.file.buffer);
    console.log(`[upload] ✅ Uploaded to Cloudinary: ${url}`);
    res.json({ url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[upload] ❌ Failed:', msg);
    res.status(502).json({ error: `Image upload failed: ${msg}` });
  }
});

export default router;

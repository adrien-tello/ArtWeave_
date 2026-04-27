import { v2 as cloudinary } from 'cloudinary';

// dotenv is already loaded by index.ts before this module is imported
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate on startup so we catch missing vars immediately
const { cloud_name, api_key, api_secret } = cloudinary.config();
if (!cloud_name || !api_key || !api_secret) {
  console.error('❌ Cloudinary config missing — check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env');
}

export async function uploadToCloudinary(
  buffer: Buffer,
  folder = 'artweave/products'
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, resource_type: 'image' },
        (err, result) => {
          if (err) {
            // Log the real Cloudinary error object
            console.error('❌ Cloudinary upload_stream error:', JSON.stringify(err));
            return reject(new Error(err.message ?? 'Cloudinary upload failed'));
          }
          if (!result) return reject(new Error('No result from Cloudinary'));
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

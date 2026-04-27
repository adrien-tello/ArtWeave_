# Cloudinary Image Upload — How It Works

This document explains the complete image upload pipeline: from a seller picking a file in the browser, to the image being stored on Cloudinary, and the URL being saved in PostgreSQL and displayed to buyers.

---

## The Full Flow (Step by Step)

```
Seller picks a file
      │
      ▼
Frontend (React)
  → sends multipart/form-data POST to /api/upload
  → includes JWT token in Authorization header
      │
      ▼
Backend (Express + Multer)
  → validates JWT (must be a seller)
  → reads file into memory buffer (never touches disk)
  → calls Cloudinary SDK with the buffer
      │
      ▼
Cloudinary
  → stores the image in the "artweave/products" folder
  → returns a permanent HTTPS URL (secure_url)
      │
      ▼
Backend
  → sends { url: "https://res.cloudinary.com/..." } back to frontend
      │
      ▼
Frontend
  → stores the URL in the product form field (image_url)
  → seller fills in the rest of the form and submits
      │
      ▼
Backend (POST /api/products)
  → saves the product row in PostgreSQL
  → image_url column = the Cloudinary URL
      │
      ▼
Buyer visits the store
  → frontend fetches products from /api/products
  → renders <img src={product.image_url} /> directly from Cloudinary CDN
```

---

## Files Involved

### Backend

| File | Role |
|---|---|
| `backend/src/lib/cloudinary.ts` | Configures the Cloudinary SDK and exports `uploadToCloudinary(buffer)` |
| `backend/src/routes/upload.ts` | `POST /api/upload` — receives the file, calls Cloudinary, returns the URL |
| `backend/src/middleware/auth.ts` | `requireSeller` guard — only approved sellers can upload |

### Frontend

| File | Role |
|---|---|
| `src/pages/SellerDashboard.tsx` | Product form with the file picker and upload logic |
| `src/lib/api.ts` | `upload.image(file)` — sends the file to the backend |

---

## Setting Up Cloudinary Credentials

You need three values from your Cloudinary dashboard (https://cloudinary.com/console):

1. **Cloud Name** — already set: `deshpjl5v`
2. **API Key** — a number like `123456789012345`
3. **API Secret** — a string like `abcDEF_ghiJKL-mnoPQR`

Open `backend/.env` and fill them in:

```env
CLOUDINARY_CLOUD_NAME=deshpjl5v
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
```

> ⚠️ Never commit `.env` to Git. It is already in `.gitignore`.

---

## How to Find Your API Key and Secret

1. Go to https://cloudinary.com and log in
2. Click your avatar (top right) → **Console**
3. On the Dashboard you will see **API Keys** section
4. Copy the **API Key** and **API Secret**

---

## What Happens in the Code

### 1. Seller picks a file (`SellerDashboard.tsx`)

```tsx
const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  setImagePreview(URL.createObjectURL(file)); // show local preview instantly
  const url = await uploadApi.image(file);    // upload to backend → Cloudinary
  setValue('image_url', url);                 // store Cloudinary URL in form
};
```

### 2. Frontend sends file to backend (`api.ts`)

```ts
upload.image = async (file: File) => {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token()}` },
    body: form,
  });
  return (await res.json()).url; // returns the Cloudinary URL
};
```

### 3. Backend receives and uploads (`upload.ts`)

```ts
router.post('/', requireSeller, upload.single('image'), async (req, res) => {
  const url = await uploadToCloudinary(req.file.buffer);
  res.json({ url });
});
```

Multer stores the file in memory (`memoryStorage`) — no temp files on disk.

### 4. Cloudinary stores the image (`cloudinary.ts`)

```ts
cloudinary.uploader.upload_stream(
  { folder: 'artweave/products', resource_type: 'image' },
  (err, result) => resolve(result.secure_url)
).end(buffer);
```

The image lands in your Cloudinary media library under `artweave/products/`.

### 5. URL saved to PostgreSQL

When the seller submits the product form, the Cloudinary URL is sent as `image_url` in the product creation request (`POST /api/products`). Prisma saves it to the `Product` table:

```
Product.image_url = "https://res.cloudinary.com/deshpjl5v/image/upload/v.../artweave/products/abc123.jpg"
```

### 6. Displayed to buyers

The Home page and ProductDetail page fetch products from the API and render:

```tsx
<img src={product.image_url} alt={product.name} />
```

The browser loads the image directly from Cloudinary's global CDN — fast, no load on your server.

---

## Limits & Validation

| Rule | Value |
|---|---|
| Max file size | 5 MB |
| Allowed types | Images only (`image/*`) |
| Who can upload | Sellers only (JWT required) |
| Storage folder | `artweave/products` |

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `Image upload failed` toast | Wrong API key/secret | Check `backend/.env` credentials |
| `401 Unauthorized` on upload | Not logged in as seller | Log in as a seller first |
| `Only image files are allowed` | Non-image file selected | Pick a JPG, PNG, WEBP, etc. |
| Image shows broken in product card | `image_url` is empty or wrong | Check Cloudinary dashboard for the uploaded file |
| Upload works but product has no image | Form submitted before upload finished | Wait for "Image uploaded" toast before submitting |

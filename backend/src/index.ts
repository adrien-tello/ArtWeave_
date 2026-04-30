import 'dotenv/config';

// Fallback for environments where env vars are not injected (e.g. Coolify)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://ecommerce_user:TKcooporation12@kscgkggcc4sssskgc8ogokcw:5432/ecommerce_db';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = '07b43689ef24448cc2ef8e7e82392c174fbaee7d1e491a1df1e18af33bf3f25ad65b7138fa36ee74a4b2c006bf5a383d7e15a66add482d4efe7570d241607b2d';
}
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  process.env.CLOUDINARY_CLOUD_NAME = 'deshpjl5v';
}
if (!process.env.CLOUDINARY_API_KEY) {
  process.env.CLOUDINARY_API_KEY = '689313516477913';
}
if (!process.env.CLOUDINARY_API_SECRET) {
  process.env.CLOUDINARY_API_SECRET = 'UEnfveSaLwkDmDJVvFTMApCu_Bo';
}
import express from 'express';
import cors from 'cors';
import uploadRouter    from './routes/upload';
import authRouter      from './routes/auth';
import productsRouter  from './routes/products';
import cartRouter      from './routes/cart';
import ordersRouter    from './routes/orders';
import paymentsRouter  from './routes/payments';
import adminRouter     from './routes/admin';

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Request logger ─────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} — origin: ${req.headers.origin || 'none'}`);
  next();
});

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  'https://artweave.95.111.228.35.sslip.io',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow no-origin requests (mobile apps, curl, etc)
    
    // Check exact match
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    
    // For production, also allow sslip.io domains dynamically
    if (origin.includes('sslip.io')) {
      return callback(null, true);
    }
    
    console.warn(`[CORS] Blocked origin: ${origin}. Allowed: ${ALLOWED_ORIGINS.join(', ')}`);
    return callback(null, true); // Log and allow for debugging
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/upload',   uploadRouter);
app.use('/api/auth',     authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart',     cartRouter);
app.use('/api/orders',   ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin',    adminRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
  console.log(`DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
  console.log(`JWT_SECRET set: ${!!process.env.JWT_SECRET}`);
});

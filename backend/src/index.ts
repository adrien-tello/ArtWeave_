import 'dotenv/config';

// Fallback for environments where DATABASE_URL is not injected (e.g. Coolify)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://ecommerce_user:TKcooporation12@kscgkggcc4sssskgc8ogokcw:5432/ecommerce_db';
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

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  'https://artweave.95.111.228.35.sslip.io',
  'http://localhost:5173',
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

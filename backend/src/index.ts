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

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
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

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRouter    from './routes/upload';
import authRouter     from './routes/auth';
import productsRouter from './routes/products';
import cartRouter     from './routes/cart';
import ordersRouter   from './routes/orders';
import paymentsRouter from './routes/payments';
import adminRouter    from './routes/admin';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // needed for Monetbil webhook

app.use('/api/upload',   uploadRouter);
app.use('/api/auth',     authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart',     cartRouter);
app.use('/api/orders',   ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin',    adminRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Global error handler — catches unhandled async errors
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

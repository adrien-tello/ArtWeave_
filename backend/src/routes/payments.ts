import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { requireUser, AuthRequest } from '../middleware/auth';

const router = Router();

const MONETBIL_SERVICE_KEY = process.env.MONETBIL_SERVICE_KEY!;
const MONETBIL_API = 'https://api.monetbil.com/payment/v1/placePayment';

// POST /api/payments/initiate
router.post('/initiate', requireUser, async (req: AuthRequest, res: Response) => {
  const { order_id, phone, operator } = req.body;

  const order = await prisma.order.findUnique({
    where: { id: order_id, user_id: req.actor!.id },
  });
  if (!order) { res.status(404).json({ error: 'Order not found' }); return; }
  if (order.payment_status === 'paid') { res.status(400).json({ error: 'Already paid' }); return; }

  const payment = await prisma.payment.create({
    data: { order_id, amount: order.total_amount, phone, operator },
  });

  const body = new URLSearchParams({
    service_key:  MONETBIL_SERVICE_KEY,
    amount:       String(order.total_amount),
    phone,
    operator,
    item_ref:     order_id,
    payment_ref:  payment.id,
    notify_url:   `${process.env.BACKEND_URL}/api/payments/webhook`,
    return_url:   `${process.env.FRONTEND_URL}/orders`,
    logo:         `${process.env.FRONTEND_URL}/logo.png`,
  });

  const monetbilRes = await fetch(MONETBIL_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const data = await monetbilRes.json() as { success: boolean; payment_url?: string; message?: string };

  if (!data.success) {
    res.status(502).json({ error: data.message || 'Payment initiation failed' }); return;
  }

  res.json({ payment_url: data.payment_url, payment_id: payment.id });
});

// POST /api/payments/webhook — Monetbil callback
router.post('/webhook', async (req: Request, res: Response) => {
  const { payment_ref, transaction_id, status, operator } = req.body;
  const isSuccess = status === '1';

  await prisma.payment.update({
    where: { id: payment_ref },
    data: {
      status:       isSuccess ? 'success' : 'failed',
      monetbil_ref: transaction_id,
      operator,
    },
  });

  if (isSuccess) {
    const payment = await prisma.payment.findUnique({ where: { id: payment_ref } });
    if (payment) {
      await prisma.order.update({
        where: { id: payment.order_id },
        data: { payment_status: 'paid', status: 'confirmed' },
      });
    }
  }

  res.status(200).send('OK');
});

// GET /api/payments/status/:order_id
router.get('/status/:order_id', requireUser, async (req: AuthRequest, res: Response) => {
  const payment = await prisma.payment.findFirst({
    where: { order_id: req.params.order_id },
    orderBy: { created_at: 'desc' },
    select: { status: true, operator: true, created_at: true },
  });
  res.json(payment || { status: 'no_payment' });
});

export default router;

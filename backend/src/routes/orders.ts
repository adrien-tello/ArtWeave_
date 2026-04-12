import { Router, Response } from 'express';
import { prisma } from '../db/prisma';
import { requireUser, requireSeller, requireAdmin, AuthRequest } from '../middleware/auth';
import { OrderStatus } from '@prisma/client';

const router = Router();

// POST /api/orders — user places order from cart
router.post('/', requireUser, async (req: AuthRequest, res: Response) => {
  const { delivery_address, payment_method } = req.body;

  const cartItems = await prisma.cartItem.findMany({
    where: { user_id: req.actor!.id },
    include: { product: true },
  });

  if (!cartItems.length) { res.status(400).json({ error: 'Cart is empty' }); return; }

  const outOfStock = cartItems.find(i => !i.product.in_stock);
  if (outOfStock) { res.status(400).json({ error: `"${outOfStock.product.name}" is out of stock` }); return; }

  // Group cart items by seller
  const bySeller: Record<string, typeof cartItems> = {};
  for (const item of cartItems) {
    const sid = item.product.seller_id;
    if (!bySeller[sid]) bySeller[sid] = [];
    bySeller[sid].push(item);
  }

  // Use Prisma transaction
  const orders = await prisma.$transaction(async (tx) => {
    const created = [];

    for (const [seller_id, items] of Object.entries(bySeller)) {
      const total = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

      const order = await tx.order.create({
        data: {
          user_id: req.actor!.id,
          seller_id,
          total_amount: total,
          delivery_address,
          payment_method,
          order_items: {
            create: items.map(i => ({
              product_id: i.product_id,
              quantity:   i.quantity,
              unit_price: i.product.price,
            })),
          },
        },
      });

      // Decrement stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.product_id },
          data: { stock_qty: { decrement: item.quantity } },
        });
      }

      created.push(order);
    }

    // Clear cart
    await tx.cartItem.deleteMany({ where: { user_id: req.actor!.id } });

    return created;
  });

  res.status(201).json(orders.map(o => ({ ...o, total_amount: Number(o.total_amount) })));
});

// GET /api/orders/mine — buyer's orders
router.get('/mine', requireUser, async (req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { user_id: req.actor!.id },
    include: {
      seller: { select: { shop_name: true } },
      order_items: {
        include: { product: { select: { name: true } } },
      },
    },
    orderBy: { created_at: 'desc' },
  });

  const result = orders.map(({ seller, order_items, ...o }) => ({
    ...o,
    total_amount: Number(o.total_amount),
    shop_name: seller?.shop_name,
    items: order_items.map(i => ({
      product_id: i.product_id,
      quantity:   i.quantity,
      unit_price: Number(i.unit_price),
      name:       i.product?.name,
    })),
  }));

  res.json(result);
});

// GET /api/orders/seller — seller's incoming orders
router.get('/seller', requireSeller, async (req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { seller_id: req.actor!.id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      order_items: {
        include: { product: { select: { name: true } } },
      },
    },
    orderBy: { created_at: 'desc' },
  });

  const result = orders.map(({ user, order_items, ...o }) => ({
    ...o,
    total_amount:  Number(o.total_amount),
    buyer_name:    user?.name,
    buyer_email:   user?.email,
    buyer_phone:   user?.phone,
    items: order_items.map(i => ({
      product_id: i.product_id,
      quantity:   i.quantity,
      unit_price: Number(i.unit_price),
      name:       i.product?.name,
    })),
  }));

  res.json(result);
});

// PATCH /api/orders/:id/status — seller updates order status
router.patch('/:id/status', requireSeller, async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const valid: OrderStatus[] = ['confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) { res.status(400).json({ error: 'Invalid status' }); return; }
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id, seller_id: req.actor!.id },
      data: { status },
    });
    res.json({ ...order, total_amount: Number(order.total_amount) });
  } catch {
    res.status(404).json({ error: 'Order not found' });
  }
});

// GET /api/orders/admin/all — admin sees all orders
router.get('/admin/all', requireAdmin, async (_req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      user:   { select: { name: true } },
      seller: { select: { shop_name: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  res.json(orders.map(({ user, seller, ...o }) => ({
    ...o,
    total_amount: Number(o.total_amount),
    buyer_name:   user?.name,
    shop_name:    seller?.shop_name,
  })));
});

export default router;

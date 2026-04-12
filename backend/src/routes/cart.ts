import { Router, Response } from 'express';
import { prisma } from '../db/prisma';
import { requireUser, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/cart
router.get('/', requireUser, async (req: AuthRequest, res: Response) => {
  const items = await prisma.cartItem.findMany({
    where: { user_id: req.actor!.id },
    include: {
      product: {
        select: { name: true, name_fr: true, price: true, image_url: true, in_stock: true,
          seller: { select: { shop_name: true } },
        },
      },
    },
  });

  const result = items.map(({ product, ...item }) => ({
    id:         item.id,
    quantity:   item.quantity,
    product_id: item.product_id,
    name:       product.name,
    name_fr:    product.name_fr,
    price:      Number(product.price),
    image_url:  product.image_url,
    in_stock:   product.in_stock,
    shop_name:  product.seller.shop_name,
  }));

  res.json(result);
});

// POST /api/cart — add or increment item
router.post('/', requireUser, async (req: AuthRequest, res: Response) => {
  const { product_id, quantity = 1 } = req.body;

  const existing = await prisma.cartItem.findUnique({
    where: { user_id_product_id: { user_id: req.actor!.id, product_id } },
  });

  const item = existing
    ? await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      })
    : await prisma.cartItem.create({
        data: { user_id: req.actor!.id, product_id, quantity },
      });

  res.status(201).json(item);
});

// PATCH /api/cart/:id — update quantity
router.patch('/:id', requireUser, async (req: AuthRequest, res: Response) => {
  const { quantity } = req.body;
  if (quantity < 1) {
    await prisma.cartItem.deleteMany({ where: { id: req.params.id, user_id: req.actor!.id } });
    res.status(204).send(); return;
  }
  const item = await prisma.cartItem.updateMany({
    where: { id: req.params.id, user_id: req.actor!.id },
    data: { quantity },
  });
  res.json(item);
});

// DELETE /api/cart/:id — remove one item
router.delete('/:id', requireUser, async (req: AuthRequest, res: Response) => {
  await prisma.cartItem.deleteMany({ where: { id: req.params.id, user_id: req.actor!.id } });
  res.status(204).send();
});

// DELETE /api/cart — clear entire cart
router.delete('/', requireUser, async (req: AuthRequest, res: Response) => {
  await prisma.cartItem.deleteMany({ where: { user_id: req.actor!.id } });
  res.status(204).send();
});

export default router;

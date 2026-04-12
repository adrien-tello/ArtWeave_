import { Router, Response } from 'express';
import { prisma } from '../db/prisma';
import { requireSeller, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/products/seller/mine — must be before /:id
router.get('/seller/mine', requireSeller, async (req: AuthRequest, res: Response) => {
  const products = await prisma.product.findMany({
    where: { seller_id: req.actor!.id },
    orderBy: { created_at: 'desc' },
  });
  res.json(products);
});

// GET /api/products — public
router.get('/', async (req, res: Response) => {
  const { category, search, seller_id } = req.query;

  const products = await prisma.product.findMany({
    where: {
      seller: { is_approved: true },
      ...(category && category !== 'all' ? { category: category as string } : {}),
      ...(seller_id ? { seller_id: seller_id as string } : {}),
      ...(search ? {
        OR: [
          { name:    { contains: search as string, mode: 'insensitive' } },
          { name_fr: { contains: search as string, mode: 'insensitive' } },
        ],
      } : {}),
    },
    include: {
      seller: { select: { name: true, phone: true, whatsapp: true, shop_name: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  // flatten seller fields into product object
  const result = products.map(({ seller, ...p }) => ({
    ...p,
    price: Number(p.price),
    seller_name:     seller.name,
    seller_phone:    seller.phone,
    seller_whatsapp: seller.whatsapp,
    shop_name:       seller.shop_name,
  }));

  res.json(result);
});

// GET /api/products/:id — public
router.get('/:id', async (req, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: {
      seller: { select: { name: true, phone: true, whatsapp: true, shop_name: true } },
    },
  });
  if (!product) { res.status(404).json({ error: 'Product not found' }); return; }
  const { seller, ...p } = product;
  res.json({
    ...p,
    price: Number(p.price),
    seller_name:     seller.name,
    seller_phone:    seller.phone,
    seller_whatsapp: seller.whatsapp,
    shop_name:       seller.shop_name,
  });
});

// POST /api/products — seller only
router.post('/', requireSeller, async (req: AuthRequest, res: Response) => {
  const { name, name_fr, description, description_fr, price, category, image_url, in_stock, stock_qty } = req.body;
  const product = await prisma.product.create({
    data: {
      seller_id: req.actor!.id,
      name, name_fr, description, description_fr,
      price, category, image_url,
      in_stock: in_stock ?? true,
      stock_qty: stock_qty ?? 1,
    },
  });
  res.status(201).json({ ...product, price: Number(product.price) });
});

// PUT /api/products/:id — seller only (own products)
router.put('/:id', requireSeller, async (req: AuthRequest, res: Response) => {
  const { name, name_fr, description, description_fr, price, category, image_url, in_stock, stock_qty } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id, seller_id: req.actor!.id },
      data: { name, name_fr, description, description_fr, price, category, image_url, in_stock, stock_qty },
    });
    res.json({ ...product, price: Number(product.price) });
  } catch {
    res.status(404).json({ error: 'Product not found or not yours' });
  }
});

// DELETE /api/products/:id — seller only (own products)
router.delete('/:id', requireSeller, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id, seller_id: req.actor!.id },
    });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Product not found or not yours' });
  }
});

export default router;

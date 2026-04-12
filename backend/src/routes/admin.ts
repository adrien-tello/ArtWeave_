import { Router, Response } from 'express';
import { prisma } from '../db/prisma';
import { requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/admin/sellers
router.get('/sellers', requireAdmin, async (_req: AuthRequest, res: Response) => {
  const sellers = await prisma.seller.findMany({
    select: { id: true, name: true, email: true, phone: true, shop_name: true, is_approved: true, created_at: true },
    orderBy: { created_at: 'desc' },
  });
  res.json(sellers);
});

// PATCH /api/admin/sellers/:id/approve
router.patch('/sellers/:id/approve', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { approved } = req.body;
  try {
    const seller = await prisma.seller.update({
      where: { id: req.params.id },
      data: { is_approved: approved },
      select: { id: true, name: true, shop_name: true, is_approved: true },
    });
    res.json(seller);
  } catch {
    res.status(404).json({ error: 'Seller not found' });
  }
});

// GET /api/admin/users
router.get('/users', requireAdmin, async (_req: AuthRequest, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, phone: true, created_at: true },
    orderBy: { created_at: 'desc' },
  });
  res.json(users);
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Product not found' });
  }
});

export default router;

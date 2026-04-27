import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { prisma } from '../db/prisma';

const router = Router();

// Strict rate limit for admin login — 5 attempts per 15 minutes per IP
const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

function signToken(id: string, role: string, email: string) {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

// ── USER REGISTER ──────────────────────────────────────────
router.post('/user/register', async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'name, email and password required' }); return;
  }
  try {
    const user = await prisma.user.create({
      data: { name, email, phone: phone || null, password_hash: await bcrypt.hash(password, 10) },
      select: { id: true, name: true, email: true, phone: true },
    });
    res.status(201).json({ token: signToken(user.id, 'user', user.email), user });
  } catch {
    res.status(409).json({ error: 'Email already registered' });
  }
});

// ── USER LOGIN ─────────────────────────────────────────────
router.post('/user/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    res.status(401).json({ error: 'Invalid credentials' }); return;
  }
  const { password_hash: _, ...safe } = user;
  res.json({ token: signToken(user.id, 'user', user.email), user: safe });
});

// ── SELLER REGISTER ────────────────────────────────────────
router.post('/seller/register', async (req: Request, res: Response) => {
  const { name, email, phone, whatsapp, shop_name, shop_desc, password } = req.body;
  if (!name || !email || !phone || !shop_name || !password) {
    res.status(400).json({ error: 'name, email, phone, shop_name and password required' }); return;
  }
  try {
    const seller = await prisma.seller.create({
      data: {
        name, email, phone,
        whatsapp: whatsapp || null,
        shop_name,
        shop_desc: shop_desc || null,
        password_hash: await bcrypt.hash(password, 10),
      },
      select: { id: true, name: true, email: true, phone: true, whatsapp: true, shop_name: true, is_approved: true },
    });
    res.status(201).json({ token: signToken(seller.id, 'seller', seller.email), seller });
  } catch {
    res.status(409).json({ error: 'Email already registered' });
  }
});

// ── SELLER LOGIN ───────────────────────────────────────────
router.post('/seller/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const seller = await prisma.seller.findUnique({ where: { email } });
  if (!seller || !(await bcrypt.compare(password, seller.password_hash))) {
    res.status(401).json({ error: 'Invalid credentials' }); return;
  }
  const { password_hash: _, ...safe } = seller;
  res.json({ token: signToken(seller.id, 'seller', seller.email), seller: safe });
});

// ── ADMIN LOGIN ────────────────────────────────────────────
router.post('/admin/login', adminRateLimit, async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    res.status(401).json({ error: 'Invalid credentials' }); return;
  }
  res.json({ token: signToken(admin.id, 'admin', admin.username), admin: { id: admin.id, username: admin.username } });
});

export default router;

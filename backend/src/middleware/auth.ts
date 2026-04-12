import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  actor?: { id: string; role: 'user' | 'seller' | 'admin'; email?: string };
}

function verify(req: AuthRequest, res: Response, next: NextFunction, roles: string[]) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ error: 'No token' }); return; }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthRequest['actor'];
    if (!roles.includes(decoded!.role)) { res.status(403).json({ error: 'Forbidden' }); return; }
    req.actor = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export const requireUser   = (req: AuthRequest, res: Response, next: NextFunction) => verify(req, res, next, ['user']);
export const requireSeller = (req: AuthRequest, res: Response, next: NextFunction) => verify(req, res, next, ['seller']);
export const requireAdmin  = (req: AuthRequest, res: Response, next: NextFunction) => verify(req, res, next, ['admin']);
export const requireAuth   = (req: AuthRequest, res: Response, next: NextFunction) => verify(req, res, next, ['user', 'seller', 'admin']);

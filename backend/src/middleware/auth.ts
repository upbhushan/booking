import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// role values use Prisma enum strings: 'PATIENT' | 'ADMIN'
export interface AuthRequest extends Request { user?: { id: string; role: 'PATIENT' | 'ADMIN' }; }

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: { code: 'NO_TOKEN', message: 'Missing token' } });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = payload as any;
    next();
  } catch (e) {
    return res.status(401).json({ error: { code: 'BAD_TOKEN', message: 'Invalid token' } });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Admin only' } });
  next();
}

export function requirePatient(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'PATIENT') return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Patient only' } });
  next();
}

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const authRouter = Router();

const registerSchema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6), role: z.enum(['PATIENT','ADMIN']).optional(), adminKey: z.string().optional() });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

authRouter.post('/register', async (req: any, res: any) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: { code: 'BAD_INPUT', message: parsed.error.flatten() } });
  const { name, email, password, role, adminKey } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: { code: 'EMAIL_TAKEN', message: 'Email already registered' } });
  let finalRole: 'PATIENT' | 'ADMIN' = 'PATIENT';
  if (role === 'ADMIN') {
    if (!adminKey || adminKey !== process.env.ADMIN_SIGNUP_KEY) {
      return res.status(403).json({ error: { code: 'BAD_ADMIN_KEY', message: 'Invalid admin key' } });
    }
    finalRole = 'ADMIN';
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash, role: finalRole } });
  return res.status(201).json({ id: user.id, role: user.role });
});

authRouter.post('/login', async (req: any, res: any) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: { code: 'BAD_INPUT', message: parsed.error.flatten() } });
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '2h' });
  res.json({ token, role: user.role, name: user.name, email: user.email });
});

// current authenticated user info
authRouter.get('/me', authenticate as any, async (req: AuthRequest, res: any) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

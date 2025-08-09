import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRouter } from './routes/auth';
import { slotsRouter } from './routes/slots';
import { bookingsRouter } from './routes/bookings';
import { authenticate, requireAdmin } from './middleware/auth';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

app.get('/health', (_req: any, res: any) => res.json({ ok: true }));

// Protected seed endpoint (admin-only + requires ADMIN_SEED_KEY)
app.post('/admin/seed', authenticate, requireAdmin, async (req: any, res: any) => {
  // Extra layer of protection
  const { adminSeedKey } = req.body;
  if (adminSeedKey !== process.env.ADMIN_SIGNUP_KEY) {
    return res.status(403).json({ error: 'Invalid admin seed key' });
  }

  const prisma = new PrismaClient();
  try {
    // Same code as seed.ts
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      console.warn('Skipping admin user creation: ADMIN_EMAIL or ADMIN_PASSWORD not set');
    } else {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await prisma.user.upsert({
        where: { email: adminEmail },
        update: { passwordHash, role: 'ADMIN', name: 'Admin' },
        create: { email: adminEmail, passwordHash, role: 'ADMIN', name: 'Admin' }
      });
    }

    // generate slots for next 7 days 09:00-17:00 30-min
    const startHour = 9;
    const endHour = 17;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (let day = 0; day < 7; day++) {
      for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += 30) {
          const start = new Date(today.getTime() + day * 24 * 60 * 60 * 1000);
          start.setHours(h, m, 0, 0);
          const end = new Date(start.getTime() + 30 * 60 * 1000);
          try {
            await prisma.slot.create({ data: { startAt: start, endAt: end } });
          } catch { /* ignore duplicates */ }
        }
      }
    }
    
    return res.json({ success: true, message: 'Seed completed' });
  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({ error: 'Seed failed' });
  } finally {
    await prisma.$disconnect();
  }
});

app.use('/api', authRouter);
app.use('/api', authenticate, slotsRouter);
app.use('/api', authenticate, bookingsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on :${port}`);
});

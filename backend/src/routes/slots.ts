import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
export const slotsRouter = Router();

const querySchema = z.object({ from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });

slotsRouter.get('/slots', async (req: any, res: any) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: { code: 'BAD_INPUT', message: parsed.error.flatten() } });
  const { from, to } = parsed.data;
  const slots = await prisma.slot.findMany({
    where: { startAt: { gte: new Date(from), lt: new Date(new Date(to).getTime() + 24*60*60*1000) } },
    orderBy: { startAt: 'asc' }
  });

  // find taken slots
  const bookings = await prisma.booking.findMany({ where: { slotId: { in: slots.map(s => s.id) } } });
  const taken = new Set(bookings.map(b => b.slotId));

  const available = slots.filter(s => !taken.has(s.id)).map(s => ({ id: s.id, startAt: s.startAt, endAt: s.endAt }));
  res.json({ slots: available });
});

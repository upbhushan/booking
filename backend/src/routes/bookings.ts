import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest, requireAdmin, requirePatient } from '../middleware/auth';

const prisma = new PrismaClient();
export const bookingsRouter = Router();

const bookSchema = z.object({ slotId: z.string().cuid() });

// Patients create bookings
bookingsRouter.post('/book/:slotId?', requirePatient as any, async (req: AuthRequest, res: any) => {
  const slotId = req.params.slotId || req.body.slotId;
  const parsed = bookSchema.safeParse({ slotId });
  if (!parsed.success) return res.status(400).json({ error: { code: 'BAD_INPUT', message: parsed.error.flatten() } });
  try {
    const booking = await prisma.booking.create({ data: { slotId: parsed.data.slotId, userId: req.user!.id } });
    return res.status(201).json({ id: booking.id });
  } catch (e: any) {
    if (e.code === 'P2002') return res.status(400).json({ error: { code: 'SLOT_TAKEN', message: 'Slot already booked' } });
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Could not book' } });
  }
});

// Patients list their own bookings
bookingsRouter.get('/my-bookings', requirePatient as any, async (req: AuthRequest, res: any) => {
  const bookings = await prisma.booking.findMany({ where: { userId: req.user!.id }, include: { slot: true }, orderBy: { createdAt: 'desc' } });
  res.json({ bookings: bookings.map(b => ({ id: b.id, slotId: b.slotId, startAt: b.slot.startAt, endAt: b.slot.endAt })) });
});

// Admin lists all bookings
bookingsRouter.get('/all-bookings', requireAdmin as any, async (_req: any, res: any) => {
  const bookings = await prisma.booking.findMany({ include: { slot: true, user: true }, orderBy: { createdAt: 'desc' } });
  res.json({ bookings: bookings.map(b => ({ id: b.id, user: { id: b.userId, name: b.user.name, email: b.user.email }, slot: { id: b.slotId, startAt: b.slot.startAt, endAt: b.slot.endAt } })) });
});
